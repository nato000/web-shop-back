import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [TypeOrmModule, ClientService],
})
export class ClientModule {}
