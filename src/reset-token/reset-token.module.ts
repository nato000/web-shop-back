import { Module } from '@nestjs/common';
import { ResetTokenService } from './reset-token.service';

@Module({
  providers: [ResetTokenService],
  exports: [ResetTokenService],
})
export class ResetTokenModule {}
