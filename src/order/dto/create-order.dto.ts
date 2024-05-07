import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @IsNotEmpty()
  @ApiProperty()
  clientId: string;

  @IsNotEmpty()
  @ApiProperty()
  productIds: string[];
}
