import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  currency: string;

  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsOptional()
  @ApiProperty()
  imagePath: string;

  @IsNotEmpty()
  @ApiProperty()
  categoryId: string;

  @IsNotEmpty()
  @ApiProperty()
  manufacturerId: string;
}
