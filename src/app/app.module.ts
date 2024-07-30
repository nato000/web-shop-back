import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from 'src/category/category.module';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';
import { ClientModule } from 'src/client/client.module';
import { OrderModule } from 'src/order/order.module';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthControllerModule } from 'src/auth/auth.controller.module';
import { ResetTokenModule } from 'src/reset-token/reset-token.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { sequelizeConfig } from 'src/configs/database.config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    ProductModule,
    CategoryModule,
    ManufacturerModule,
    OrderModule,
    ClientModule,
    AdminModule,
    AuthModule,
    AuthControllerModule,
    ResetTokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
