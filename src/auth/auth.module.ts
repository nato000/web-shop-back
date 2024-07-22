import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from 'src/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth.constansts';
import { ResetTokenModule } from 'src/reset-token/reset-token.module';
import { AuthGuard } from './guards/auth.guard';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    AdminModule,
    ClientModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    ResetTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
