import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty } from 'class-validator';

export class AddProductOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty()
  @ApiProperty()
  productIds: string[];
}
