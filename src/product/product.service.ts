import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private ProductRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existingLector = await this.ProductRepository.findOne({
      where: {
        name: createProductDto.name,
      },
    });
    if (existingLector) {
      throw new ConflictException('Lector with this email already exists');
    }
    console.log('ok');

    return this.ProductRepository.save(createProductDto);
  }

  findAll() {
    return this.ProductRepository.find();
  }

  findOne(id: string): Promise<Product> {
    return this.ProductRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return `This action updates a #${id} Product`;
  }

  remove(id: number) {
    return `This action removes a #${id} Product`;
  }
}
