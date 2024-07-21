import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { AddProductOrderDto } from './dto/add-products-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOneOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOneOrderById(id);
  }

  @Patch('/status/:id')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Patch('/addProducts/:id')
  addProductsToOrder(
    @Param('id') id: string,
    @Body() addProductOrderDto: AddProductOrderDto,
  ): Promise<Order> {
    return this.orderService.addProductsToOrder(id, addProductOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(id);
  }
}
