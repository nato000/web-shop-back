import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.findAll({
      include: [Product], // Include related products
    });
  }

  async findOneById(id: string): Promise<Category> {
    const category = await this.categoryModel.findByPk(id, {
      include: [Product], // Include related products
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, description } = createCategoryDto;

    const existingCategory = await this.categoryModel.findOne({
      where: { name },
    });
    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.categoryModel.create({ name, description });
  }

  async findCategoryById(id: string): Promise<Category> {
    return this.findOneById(id);
  }

  async updateCategoryById(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneById(id);

    if (updateCategoryDto.name) {
      category.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.description) {
      category.description = updateCategoryDto.description;
    }

    await category.save();
    return category;
  }

  async deleteCategoryById(id: string): Promise<void> {
    const category = await this.findOneById(id);
    await category.destroy();
  }
}
