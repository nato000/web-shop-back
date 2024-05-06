import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepository.find();
  }

  async findOneById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    console.log(createCategoryDto);
    const { name, description } = createCategoryDto;
    const category = {
      name: name,
      description: description,
    };

    const existingManufacturer = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (existingManufacturer) {
      throw new ConflictException('Category with this name already exists');
    }
    return this.categoryRepository.save(category);
  }

  async findCategoryById(id: string): Promise<Category> {
    const result = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'], // Specify the relations to be fetched
    });
    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return result;
  }

  async updateCategoryById(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'], // Specify the relations to be fetched
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (updateCategoryDto.name) {
      category.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.description) {
      category.description = updateCategoryDto.description;
    }
    return this.categoryRepository.save(category);
  }

  async deleteCategoryById(id: string) {
    const result = await this.categoryRepository.delete({
      id,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }
}
