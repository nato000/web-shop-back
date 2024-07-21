import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  accessToken: string;
}
