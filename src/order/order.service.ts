import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddProductOrderDto } from './dto/add-products-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ClientService } from 'src/client/client.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private clientService: ClientService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['client', 'orderItems', 'orderItems.product'],
    });
  }

  async findOneById(id: string): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { status, clientId, productIds } = createOrderDto;

    const orderClient = await this.clientService.findOneById(clientId);
    if (!orderClient) {
      throw new NotFoundException('Client not found');
    }

    const order = this.orderRepository.create({
      status,
      client: orderClient,
      total: '0',
      orderItems: [],
    });

    let productTotal = 0;

    for (const productId of productIds) {
      const product = await this.productService.findOneById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      productTotal += Number(product.price);

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: 1, // Default to 1, can be modified later
      });

      order.orderItems.push(orderItem);
    }

    order.total = `${productTotal}`;
    return this.orderRepository.save(order);
  }

  async findOneOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'orderItems', 'orderItems.product'],
    });
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
      relations: ['orderItems', 'orderItems.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Find and validate products
    let productTotal = Number(order.total);

    for (const productId of productIds) {
      const product = await this.productService.findOneById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      productTotal += Number(product.price);

      const existingOrderItem = order.orderItems.find(
        (item) => item.product.id === productId,
      );

      if (existingOrderItem) {
        existingOrderItem.quantity += 1;
      } else {
        const orderItem = this.orderItemRepository.create({
          product,
          quantity: 1,
        });
        order.orderItems.push(orderItem);
      }
    }

    order.total = `${productTotal}`;

    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOneById(id);
    await this.orderRepository.remove(order);
  }

  async updateOrdersAfterProductDeletion(productId: string): Promise<void> {
    const orders = await this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product'],
    });

    for (const order of orders) {
      const itemsToRemove = order.orderItems.filter(
        (item) => item.product.id === productId,
      );

      if (itemsToRemove.length > 0) {
        // Remove the items from the order and recalculate the total
        order.orderItems = order.orderItems.filter(
          (item) => item.product.id !== productId,
        );

        let newTotal = 0;
        for (const item of order.orderItems) {
          newTotal += Number(item.product.price) * item.quantity;
        }

        order.total = `${newTotal}`;
        await this.orderRepository.save(order);
      }
    }
  }
}
