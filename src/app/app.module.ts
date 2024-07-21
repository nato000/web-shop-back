import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.POSTGRES_HOST}`,
      port: 5432,
      username: `${process.env.POSTGRES_USER}`,
      password: `${process.env.POSTGRES_PASSWORD}`,
      database: `${process.env.POSTGRES_NAME}`,
      // entities: [Product, Category, Manufacturer, Client],
      synchronize: true,
      autoLoadEntities: true,
    }),
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
