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

  findAll() {
    return this.productRepository.find();
  }

  findOneById(id: string): Promise<Product> {
    return this.productRepository.findOne({
      where: { id },
    });
  }
  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
      },
    });

    const { name, description, picture, categoryId, manufacturerId } =
      createProductDto;

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
      picture: picture,
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

    // Update the product properties if they are provided
    if (updateProductDto.name) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.description) {
      product.description = updateProductDto.description;
    }
    if (updateProductDto.picture) {
      product.picture = updateProductDto.picture;
    }

    // Update the manufacturer if manufacturerId is provided
    if (updateProductDto.manufacturerId) {
      const manufacturer = await this.manufacturerService.findOneById(
        updateProductDto.manufacturerId,
      );
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      product.manufacturer = manufacturer;
    }

    // Update the category if categoryId is provided
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
