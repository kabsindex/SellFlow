import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {}

  async getSummary(tenantId: string) {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [monthOrders, yearOrders, pendingPaymentsCount, recentOrders, topProducts] =
      await Promise.all([
        this.prisma.order.findMany({
          where: {
            tenantId,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
          include: {
            items: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        }),
        this.prisma.order.findMany({
          where: {
            tenantId,
            createdAt: {
              gte: yearStart,
              lte: yearEnd,
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        }),
        this.prisma.payment.count({
          where: {
            tenantId,
            status: {
              in: [PaymentStatus.PENDING, PaymentStatus.PROOF_SUBMITTED],
            },
          },
        }),
        this.prisma.order.findMany({
          where: { tenantId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        this.prisma.orderItem.groupBy({
          by: ['name'],
          where: {
            order: {
              tenantId,
              createdAt: {
                gte: monthStart,
                lte: monthEnd,
              },
            },
          },
          _sum: {
            lineTotal: true,
            quantity: true,
          },
          orderBy: {
            _sum: {
              lineTotal: 'desc',
            },
          },
          take: 5,
        }),
      ]);

    const revenueByMonth = Array.from({ length: 12 }).map((_, index) => {
      const monthDate = new Date(now.getFullYear(), index, 1);
      const monthLabel = monthDate.toLocaleDateString('fr-FR', {
        month: 'short',
      });
      const monthRevenue = yearOrders
        .filter((order) => order.createdAt.getMonth() === index)
        .reduce((sum, order) => sum + Number(order.total), 0);

      return {
        month: monthLabel,
        revenue: monthRevenue,
      };
    });

    const monthRevenueTotal = monthOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    const monthOrdersCount = monthOrders.length;
    const capabilities = await this.billingService.getCurrentPlan(tenantId);

    return {
      revenueLabel: 'Revenu du mois',
      revenueTotal: monthRevenueTotal,
      monthOrdersCount,
      revenueByMonth,
      pendingPaymentsCount,
      topProducts: topProducts.map((item) => ({
        name: item.name,
        revenue: Number(item._sum.lineTotal ?? 0),
        quantity: item._sum.quantity ?? 0,
        })),
      recentActivity: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        trackingReference: order.trackingReference,
        status: order.status,
        total: Number(order.total),
        createdAt: order.createdAt,
      })),
      orderStatusBreakdown: {
        new: monthOrders.filter((order) => order.status === OrderStatus.NEW).length,
        processing: monthOrders.filter(
          (order) =>
            order.status === OrderStatus.CONFIRMED ||
            order.status === OrderStatus.PROCESSING,
        ).length,
        shipped: monthOrders.filter((order) => order.status === OrderStatus.SHIPPED)
          .length,
        delivered: monthOrders.filter((order) => order.status === OrderStatus.DELIVERED)
          .length,
      },
      capabilities,
    };
  }
}
