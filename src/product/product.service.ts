import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoryService } from 'src/category/category.service';
import { ManufacturerService } from 'src/manufacturer/manufacturer.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
  ) {}

  async findAll() {
    return await this.productRepository.find();
  }

  async findOneById(id: string): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
    });
  }
  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
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
    const product = this.productRepository.create({
      name: name,
      description: description,
      imagePath: imagePath,
      currency: currency,
      price: price,
      category: category, // Assign category entity
      manufacturer: manufacturer, // Assign manufacturer entity
    });
    console.log('ok');
    return this.productRepository.save(product);
  }

  async findProductById(id: string): Promise<Product> {
    const result = await this.productRepository.findOne({
      where: { id },
      relations: ['manufacturer', 'category'], // Specify the relations to be fetched
    });
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }

  async updateProductById(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id: `${id}` },
      relations: ['manufacturer', 'category'], // Specify the relations to be fetched
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
      product.manufacturer = manufacturer;
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOneById(
        updateProductDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    return this.productRepository.save(product);
  }

  async deleteProductById(id: string) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}
