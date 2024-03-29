import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  //create
  async create(userId: number): Promise<Order> {
    return await this.prisma.order.create({ data: { userId } });
  }

  //get
  async getById(id: number) {
    return await this.prisma.order.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            surname: true,
            email: true,
            phone: true,
            vkLink: true,
            tgLink: true,
          },
        },
        userAddress: {
          select: { address: true },
        },
        deliveryService: {
          select: { name: true },
        },
        orderedProducts: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
                vendor: true,
                category: true,
                price: true,
                discount: true,
                used: true,
                amount: true,
                pictures: {
                  take: 1,
                  select: {
                    filename: true,
                  },
                },
              },
            },
            amount: true,
          },
        },
      },
    });
  }

  async getCurrentByUserId(userId: number): Promise<Order | undefined> {
    return await this.prisma.order.findFirst({
      where: { userId, status: 'NOT_APPROVED' },
      include: {
        userAddress: {
          select: { address: true },
        },
        deliveryService: {
          select: { name: true },
        },
        orderedProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                vendor: true,
                price: true,
                amount: true,
                discount: true,
                used: true,
                pictures: {
                  take: 1,
                  select: {
                    filename: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getAll(options: Prisma.OrderFindManyArgs): Promise<Order[]> {
    return await this.prisma.order.findMany(options);
  }

  async getAllByUserId(userId: number): Promise<Order[]> {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        userAddress: {
          select: { address: true },
        },
        deliveryService: {
          select: { name: true },
        },
        orderedProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                vendor: true,
                price: true,
                amount: true,
                discount: true,
                used: true,
                pictures: {
                  take: 1,
                  select: {
                    filename: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  //update
  async setUserAddress(id: number, userAddressId: number): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data: { userAddressId },
    });
  }

  async setStatusToAwaitingPayment(id: number): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data: { status: 'AWAITING_PAYMENT' },
    });
  }

  async setStatusToPaid(id: number): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data: { status: 'PAID' },
    });
  }

  async setStatusToCompleted(id: number): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }

  async setStatusToSentForDelivery(
    id: number,
    trackNo: string,
  ): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data: { status: 'SENT_FOR_DELIVERY', trackNo },
    });
  }

  async setStatusToDelivered(id: number): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data: { status: 'DELIVERED' },
    });
  }

  async setTrackNo(id: number, trackNo: string): Promise<Order> {
    return await this.prisma.order.update({ where: { id }, data: { trackNo } });
  }

  async setDeliveryService(
    id: number,
    deliveryServiceId: number,
  ): Promise<Order> {
    return await this.prisma.order.update({
      where: { id },
      data: { deliveryServiceId },
    });
  }
}
