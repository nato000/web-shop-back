import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddProductOrderDto } from './dto/add-products-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ClientService } from 'src/client/client.service';
import { ProductService } from 'src/product/product.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
    private clientService: ClientService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({
      include: [{ model: OrderItem, include: [Product] }, 'client'],
    });
  }

  async findOneById(id: string): Promise<Order> {
    const order = await this.orderModel.findByPk(id, {
      include: [{ model: OrderItem, include: [Product] }, 'client'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { status, clientId, productIds } = createOrderDto;

    const orderClient = await this.clientService.findOneById(clientId);
    if (!orderClient) {
      throw new NotFoundException('Client not found');
    }

    let productTotal = 0;

    const orderItems = await Promise.all(
      productIds.map(async (productId) => {
        const product = await this.productService.findOneById(productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }
        productTotal += Number(product.price);

        return this.orderItemModel.create({
          productId,
          quantity: 1, // Default to 1, can be modified later
        });
      }),
    );

    const order = await this.orderModel.create({
      status,
      clientId,
      total: `${productTotal}`,
    });

    await order.$set('orderItems', orderItems); // Associate order items with the order

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
    await order.save(); // Save the updated order
    return order;
  }

  async addProductsToOrder(
    id: string,
    addProductOrderDto: AddProductOrderDto,
  ): Promise<Order> {
    const { productIds } = addProductOrderDto;

    // Find the order
    const order = await this.orderModel.findByPk(id, {
      include: [{ model: OrderItem, include: [Product] }],
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    let productTotal = Number(order.total);

    const orderItems = await Promise.all(
      productIds.map(async (productId) => {
        const product = await this.productService.findOneById(productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }
        productTotal += Number(product.price);

        const existingOrderItem = order.orderItems.find(
          (item) => item.productId === productId,
        );

        if (existingOrderItem) {
          existingOrderItem.quantity += 1;
          await existingOrderItem.save();
          return existingOrderItem;
        } else {
          return this.orderItemModel.create({
            productId,
            quantity: 1,
          });
        }
      }),
    );

    order.total = `${productTotal}`;
    await order.save(); // Save the updated order
    await order.$set('orderItems', orderItems); // Update order items association

    return order;
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOneById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await order.destroy(); // Remove the order
  }

  async updateOrdersAfterProductDeletion(productId: string): Promise<void> {
    const orders = await this.orderModel.findAll({
      include: [{ model: OrderItem, include: [Product] }],
    });

    for (const order of orders) {
      const itemsToRemove = order.orderItems.filter(
        (item) => item.productId === productId,
      );

      if (itemsToRemove.length > 0) {
        // Remove the items from the order and recalculate the total
        order.orderItems = order.orderItems.filter(
          (item) => item.productId !== productId,
        );

        let newTotal = 0;
        for (const item of order.orderItems) {
          newTotal += Number(item.product.price) * item.quantity;
        }

        order.total = `${newTotal}`;
        await order.save(); // Save the updated order
      }
    }
  }
}
