import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async unreadCount(userId: string) {
    return {
      count: await this.prisma.notification.count({
        where: {
          userId,
          status: NotificationStatus.UNREAD,
        },
      }),
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification introuvable.');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });
  }

  async createNotification(input: {
    userId: string;
    tenantId?: string | null;
    type: string;
    title: string;
    body: string;
    link?: string | null;
    data?: Record<string, unknown>;
  }) {
    return this.prisma.notification.create({
      data: {
        userId: input.userId,
        tenantId: input.tenantId ?? null,
        type: input.type,
        title: input.title,
        body: input.body,
        link: input.link ?? null,
        data: input.data as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
