import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;
}
