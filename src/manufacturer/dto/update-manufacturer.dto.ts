import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateManufacturerDto } from './create-manufacturer.dto';
import { IsOptional } from 'class-validator';

export class UpdateManufacturerDto extends PartialType(CreateManufacturerDto) {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  description: string;
}
