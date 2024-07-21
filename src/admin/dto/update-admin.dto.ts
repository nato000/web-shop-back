import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @ApiProperty()
  username: string;

  @IsOptional()
  @ApiProperty()
  password: string;
}
