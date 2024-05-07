import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddProductOrderDto } from './dto/add-products-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { ClientService } from 'src/client/client.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private productService: ProductService,
    private clientService: ClientService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['client', 'products'] });
  }

  async findOneById(id: string): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id } });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { status, clientId, productIds } = createOrderDto;

    const orderClient = await this.clientService.findOneById(clientId);
    if (!orderClient) {
      throw new NotFoundException('Client not found');
    }

    const products = [];
    for (const productId of productIds) {
      const product = await this.productService.findOneById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      products.push(product);
    }

    const order = this.orderRepository.create({
      status,
      client: orderClient,
      products,
    });
    console.log('ok');
    return this.orderRepository.save(order);
  }

  async findOneOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const { status } = updateOrderStatusDto;

    const order = await this.findOneById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    return this.orderRepository.save(order);
  }

  async addProductsToOrder(
    id: string,
    addProductOrderDto: AddProductOrderDto,
  ): Promise<Order> {
    const { productIds } = addProductOrderDto;

    // Find the order
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['products'], // Load products eagerly
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Find and validate products
    const productsToAdd = [];
    for (const productId of productIds) {
      const product = await this.productService.findOneById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      productsToAdd.push(product);
    }

    console.log(order);

    // Add products to the order
    order.products = [...order.products, ...productsToAdd];
    // Save the updated order
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOneById(id);
    await this.orderRepository.remove(order);
  }
}
