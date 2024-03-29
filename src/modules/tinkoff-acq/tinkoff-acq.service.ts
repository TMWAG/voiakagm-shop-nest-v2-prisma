import { Injectable } from '@nestjs/common';
import { Order, Vendor, Category } from '@prisma/client';
import { createHash } from 'crypto';

@Injectable()
export class TinkoffAcqService {
  async init(
    order: Order & {
      user: {
        name: string;
        surname: string;
        email: string;
        phone: string;
        vkLink: string;
        tgLink: string;
      };
      userAddress: { address: string };
      deliveryService: { name: string };
      orderedProducts: {
        product: {
          id: number;
          name: string;
          amount: number;
          vendor: Vendor;
          category: Category;
          price: number;
          discount: number;
          used: boolean;
          pictures: {
            filename: string;
          }[];
        };
        amount: number;
      }[];
    },
  ) {
    const url = process.env.TINKOFF_ACQ_URL + '/Init';
    const items = order.orderedProducts.map((item) => {
      const discount = item.product.discount
        ? (item.product.price / 100) * item.product.discount
        : 0;
      const price = item.product.price - discount;
      return {
        Name: item.product.name,
        Quantity: item.amount,
        Amount: item.amount * price,
        Price: price,
        PaymentMethod: 'full_prepayment',
        Tax: 'none',
      };
    });
    const totalPrice = items.reduce(
      (total, current) => total + current.Amount,
      0,
    );
    const body = {
      TerminalKey: process.env.TINKOFF_TERMINAL_KEY,
      Amount: totalPrice,
      OrderId: order.id,
      Receipt: {
        Email: order.user.email,
        Phone: order.user.phone,
        Taxation: 'osn',
        Items: items,
      },
    };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  async checkOrder(orderId: number) {
    const url = process.env.TINKOFF_ACQ_URL + '/CheckOrder';
    const stringToHash =
      orderId +
      process.env.TINKOFF_TERMINAL_PASSWORD +
      process.env.TINKOFF_TERMINAL_KEY;
    const hash = createHash('sha256').update(stringToHash).digest('hex');
    const body = {
      TerminalKey: process.env.TINKOFF_TERMINAL_KEY,
      OrderId: orderId,
      Token: hash,
    };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }
}
