import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryService } from 'src/category/category.service';
import { ManufacturerService } from 'src/manufacturer/manufacturer.service';
import { OrderService } from 'src/order/order.service';
import { Product } from './entities/product.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  async findAll() {
    return this.productModel.findAll();
  }

  async findOneById(id: string): Promise<Product> {
    return this.productModel.findByPk(id);
  }

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productModel.findOne({
      where: {
        name: createProductDto.name,
      },
    });

    const {
      name,
      description,
      imagePath,
      currency,
      price,
      categoryId,
      manufacturerId,
    } = createProductDto;

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    const category = await this.categoryService.findOneById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const manufacturer =
      await this.manufacturerService.findOneById(manufacturerId);
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const product = await this.productModel.create({
      name,
      description,
      imagePath,
      currency,
      price,
      categoryId,
      manufacturerId,
    });
    return product;
  }

  async findProductById(id: string): Promise<Product> {
    const result = await this.productModel.findByPk(id, {
      include: [Manufacturer, Category], // Specify the relations to be fetched
    });
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }

  async updateProductById(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findByPk(id, {
      include: [Manufacturer, Category],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.name) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.description) {
      product.description = updateProductDto.description;
    }
    if (updateProductDto.imagePath) {
      product.imagePath = updateProductDto.imagePath;
    }
    if (updateProductDto.currency) {
      product.currency = updateProductDto.currency;
    }
    if (updateProductDto.price) {
      product.price = updateProductDto.price;
    }

    if (updateProductDto.manufacturerId) {
      const manufacturer = await this.manufacturerService.findOneById(
        updateProductDto.manufacturerId,
      );
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      product.manufacturerId = updateProductDto.manufacturerId;
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOneById(
        updateProductDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.categoryId = updateProductDto.categoryId;
    }

    await product.save(); // Save the updated product
    return product;
  }

  async deleteProductById(id: string): Promise<void> {
    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Trigger the order update before product removal
    await this.orderService.updateOrdersAfterProductDeletion(id);

    await product.destroy(); // Remove the product
  }
}
