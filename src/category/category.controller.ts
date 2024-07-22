import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@ApiTags('Category')
@ApiBearerAuth('jwt')
@Controller('category')
@UseGuards(AuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findCategoryById(@Param('id') id: string) {
    return this.categoryService.findCategoryById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategoryById(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deleteCategoryById(@Param('id') id: string) {
    return this.categoryService.deleteCategoryById(id);
  }
}
