import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanType, SubscriptionStatus } from '@prisma/client';
import { BillingService } from '../billing/billing.service';
import { buildPlanCapabilities } from '../common/utils/plan-capabilities';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {}

  async getDashboard() {
    const [tenants, subscriptions] = await Promise.all([
      this.prisma.tenant.findMany({
        include: {
          store: true,
          users: {
            orderBy: { createdAt: 'asc' },
          },
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscription.findMany(),
    ]);

    const activeSubscriptions = subscriptions.filter(
      (item) => item.status === SubscriptionStatus.ACTIVE,
    ).length;
    const expiredSubscriptions = subscriptions.filter(
      (item) => item.status === SubscriptionStatus.EXPIRED,
    ).length;

    return {
      totals: {
        accounts: tenants.length,
        activeSubscriptions,
        expiredSubscriptions,
        basicAccounts: tenants.filter((tenant) => tenant.currentPlan === PlanType.BASIC)
          .length,
        premiumAccounts: tenants.filter((tenant) => tenant.currentPlan === PlanType.PREMIUM)
          .length,
      },
      accounts: tenants.map((tenant) => ({
        tenantId: tenant.id,
        tenantName: tenant.name,
        storeName: tenant.store?.name ?? tenant.name,
        currentPlan: tenant.currentPlan,
        premiumPreview: tenant.premiumPreview,
        ownerName: tenant.users[0]?.name ?? null,
        ownerWhatsapp: tenant.users[0]?.whatsappNumber ?? null,
        subscriptionStatus: tenant.subscriptions[0]?.status ?? 'NONE',
        subscriptionEndDate: tenant.subscriptions[0]?.endsAt ?? null,
      })),
    };
  }

  async getSubscriptions() {
    return this.prisma.subscription.findMany({
      include: {
        tenant: {
          include: {
            store: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateSubscriptionPlan(tenantId: string, dto: UpdateSubscriptionPlanDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        store: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Compte vendeur introuvable.');
    }

    const subscription = await this.billingService.forcePlan(tenantId, dto.planType);

    if (dto.previewMode !== undefined) {
      await this.billingService.setPreviewMode(tenantId, dto.previewMode);
    }

    await this.prisma.eventLog.create({
      data: {
        tenantId,
        type: 'ADMIN_PLAN_UPDATED',
        entityType: 'subscription',
        entityId: subscription.id,
        payload: {
          planType: dto.planType,
          previewMode: dto.previewMode ?? tenant.premiumPreview,
        },
      },
    });

    return {
      tenantId,
      planType: dto.planType,
      previewMode: dto.previewMode ?? tenant.premiumPreview,
      subscription,
    };
  }

  async getAccounts() {
    const tenants = await this.prisma.tenant.findMany({
      include: {
        users: {
          orderBy: { createdAt: 'asc' },
        },
        store: {
          include: {
            theme: true,
          },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tenants.map((tenant) => ({
      tenantId: tenant.id,
      tenantName: tenant.name,
      store: tenant.store,
      users: tenant.users.map((user) => ({
        id: user.id,
        name: user.name,
        role: user.role,
        whatsappNumber: user.whatsappNumber,
      })),
      capabilities: buildPlanCapabilities(
        tenant.currentPlan,
        tenant.subscriptions[0] ?? null,
        tenant.store ?? null,
        tenant.premiumPreview,
      ),
      premiumPreview: tenant.premiumPreview,
    }));
  }

  getPlanPreview() {
    return {
      premiumPrice: '1$ / mois',
      plans: {
        basic: {
          name: 'Basic',
          features: [
            'Maximum 5 produits',
            'Branding SellFlow actif',
            'Panier client et commandes',
            'Paiements simples',
            'Livraison simple',
            'Dashboard essentiel',
            'CRM basique',
          ],
        },
        premium: {
          name: 'Premium',
          features: [
            'Produits illimités',
            'Suppression du branding SellFlow',
            'Personnalisation visuelle de la boutique',
            'Ajout du logo vendeur',
            'CRM ameliore avec tags, notes et historique',
            'Analytics sur revenus du mois et top produits',
            'Support des vues Premium dans l interface',
          ],
        },
      },
    };
  }
}

