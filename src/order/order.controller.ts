import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { AddProductOrderDto } from './dto/add-products-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
@ApiTags('Order')
@UseGuards(AuthGuard, RolesGuard)
@Controller('order')
@ApiBearerAuth('JWT')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.User)
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOneOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOneById(id);
  }

  @Patch('/status/:id')
  @Roles(Role.Admin)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Patch('/addProducts/:id')
  @Roles(Role.User)
  addProductsToOrder(
    @Param('id') id: string,
    @Body() addProductOrderDto: AddProductOrderDto,
  ): Promise<Order> {
    return this.orderService.addProductsToOrder(id, addProductOrderDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(id);
  }
}
