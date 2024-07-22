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
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/roles/enums/role.enum';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@ApiTags('Product')
@UseGuards(AuthGuard, RolesGuard)
@Controller('Product')
@ApiBearerAuth('JWT')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findProductById(@Param('id') id: string) {
    return this.productService.findProductById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductById(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deleteProductById(@Param('id') id: string) {
    return this.productService.deleteProductById(id);
  }
}
