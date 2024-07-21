import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordWithTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPassword: string;
}
