import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  picture: string;

  @IsNotEmpty()
  @ApiProperty()
  categoryId: string;

  @IsNotEmpty()
  @ApiProperty()
  manufacturerId: string;
}
