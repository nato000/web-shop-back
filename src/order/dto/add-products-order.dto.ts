import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddProductOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  productIds: string[];
}
