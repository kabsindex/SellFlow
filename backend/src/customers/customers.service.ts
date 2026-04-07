import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerNoteDto } from './dto/create-customer-note.dto';
import { CreateCustomerTagDto } from './dto/create-customer-tag.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string, search?: string) {
    const customers = await this.prisma.customer.findMany({
      where: {
        tenantId,
        OR: search
          ? [
              { name: { contains: search } },
              { phone: { contains: search } },
            ]
          : undefined,
      },
      include: {
        tags: true,
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        orders: {
          include: {
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return customers.map((customer) => ({
      ...customer,
      suggestedActions: this.buildSuggestions(customer),
    }));
  }

  async getById(tenantId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        tenantId,
      },
      include: {
        addresses: true,
        tags: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          include: {
            items: true,
            payment: {
              include: {
                proofs: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Client introuvable.');
    }

    return {
      ...customer,
      suggestedActions: this.buildSuggestions(customer),
    };
  }

  async update(tenantId: string, customerId: string, dto: UpdateCustomerDto) {
    await this.getById(tenantId, customerId);

    return this.prisma.customer.update({
      where: { id: customerId },
      data: {
        nextAction: dto.nextAction,
      },
    });
  }

  async addNote(tenantId: string, customerId: string, dto: CreateCustomerNoteDto) {
    await this.getById(tenantId, customerId);

    return this.prisma.customerNote.create({
      data: {
        tenantId,
        customerId,
        content: dto.content,
        attachments: dto.attachments ?? [],
      },
    });
  }

  async addTag(tenantId: string, customerId: string, dto: CreateCustomerTagDto) {
    await this.getById(tenantId, customerId);

    return this.prisma.customerTag.upsert({
      where: {
        customerId_label: {
          customerId,
          label: dto.label,
        },
      },
      update: {},
      create: {
        tenantId,
        customerId,
        label: dto.label,
      },
    });
  }

  private buildSuggestions(customer: {
    totalOrders: number;
    totalSpent: { toNumber?: () => number } | number;
    lastOrderAt: Date | null;
    orders?: Array<{
      items?: Array<{ categoryName: string | null }>;
    }>;
  }) {
    const totalSpent =
      typeof customer.totalSpent === 'number'
        ? customer.totalSpent
        : customer.totalSpent?.toNumber?.() ?? 0;

    const lastOrderDays =
      customer.lastOrderAt === null
        ? null
        : Math.floor(
            (Date.now() - customer.lastOrderAt.getTime()) / (1000 * 60 * 60 * 24),
          );

    const categoryFrequency = new Map<string, number>();
    for (const order of customer.orders ?? []) {
      for (const item of order.items ?? []) {
        if (!item.categoryName) {
          continue;
        }

        categoryFrequency.set(
          item.categoryName,
          (categoryFrequency.get(item.categoryName) ?? 0) + 1,
        );
      }
    }

    const favoriteCategory = [...categoryFrequency.entries()].sort(
      (left, right) => right[1] - left[1],
    )[0]?.[0];

    const suggestions = new Set<string>();

    if (customer.totalOrders >= 4) {
      suggestions.add('Relancer comme cliente récurrente');
    }

    if (totalSpent >= 100) {
      suggestions.add('Proposer une offre VIP ou un pack premium');
    }

    if (favoriteCategory) {
      suggestions.add(`Mettre en avant la categorie ${favoriteCategory}`);
    }

    if (lastOrderDays !== null && lastOrderDays > 30) {
      suggestions.add('Relancer apres periode d inactivite');
    }

    if (lastOrderDays !== null && lastOrderDays <= 7) {
      suggestions.add('Envoyer une proposition de cross-sell recente');
    }

    return Array.from(suggestions);
  }
}

