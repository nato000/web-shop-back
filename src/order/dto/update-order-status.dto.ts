import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty()
  @ApiProperty()
  status: string;
}
