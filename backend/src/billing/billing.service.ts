import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  PlanType,
  StoreCurrency,
  Subscription,
  SubscriptionStatus,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPlanCapabilities } from '../common/utils/plan-capabilities';
import { NotificationsService } from '../notifications/notifications.service';
import { UpgradeDto } from './dto/upgrade.dto';
import { MaketouWebhookDto } from './dto/maketou-webhook.dto';
import { MaketouCart, MaketouService } from './maketou.service';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly maketouService: MaketouService,
    @InjectQueue('subscription-expiry')
    private readonly subscriptionExpiryQueue: Queue,
  ) {}

  async getCurrentPlan(tenantId: string) {
    const tenant = await this.requireTenant(tenantId);
    const subscription = await this.getLatestSubscription(tenantId);

    return buildPlanCapabilities(
      tenant.currentPlan,
      subscription,
      tenant.store ?? null,
      tenant.premiumPreview,
    );
  }

  async getSubscription(tenantId: string) {
    const tenant = await this.requireTenant(tenantId);
    const subscription = await this.getLatestSubscription(tenantId);

    return {
      tenantId,
      currentPlan: tenant.currentPlan,
      subscription,
      capabilities: buildPlanCapabilities(
        tenant.currentPlan,
        subscription,
        tenant.store ?? null,
        tenant.premiumPreview,
      ),
    };
  }

  async upgrade(userId: string, tenantId: string, dto: UpgradeDto) {
    const tenant = await this.requireTenant(tenantId);
    const subscription = await this.getLatestSubscription(tenantId);

    if (!subscription) {
      throw new NotFoundException('Abonnement introuvable pour ce vendeur.');
    }

    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser || currentUser.tenantId !== tenantId) {
      throw new ForbiddenException('Utilisateur non autorise pour cet abonnement.');
    }

    if (
      tenant.currentPlan === PlanType.PREMIUM &&
      subscription.status === SubscriptionStatus.ACTIVE &&
      subscription.endsAt &&
      subscription.endsAt > new Date()
    ) {
      throw new BadRequestException(
        `Ton abonnement Premium est déjà actif jusqu'au ${subscription.endsAt.toLocaleDateString('fr-FR')}.`,
      );
    }

    if (!currentUser.email) {
      throw new BadRequestException(
        'Ajoute une adresse email à ton compte avant de lancer le paiement Premium.',
      );
    }

    const { firstName, lastName } = this.splitDisplayName(
      currentUser.name,
      tenant.name,
    );

    const checkout = await this.maketouService.createSubscriptionCheckout({
      subscriptionId: subscription.id,
      tenantId,
      userId: currentUser.id,
      email: currentUser.email,
      firstName,
      lastName,
      phone: currentUser.whatsappNumber,
    });

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        planType: PlanType.PREMIUM,
        status: SubscriptionStatus.PENDING,
        amount: 1,
        currency: StoreCurrency.USD,
        providerReference: checkout.cart.id,
      },
    });

    return {
      tenantId,
      currentPlan: tenant.currentPlan,
      subscriptionId: subscription.id,
      premiumPrice: '1$ / mois',
      paymentMethodId: dto.paymentMethodId ?? null,
      maketou: {
        cartId: checkout.cart.id,
        status: checkout.cart.status,
        redirectUrl: checkout.redirectUrl,
      },
    };
  }

  async confirmUpgrade(userId: string, tenantId: string, subscriptionId: string) {
    if (!subscriptionId) {
      throw new BadRequestException('subscriptionId manquant.');
    }

    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser || currentUser.tenantId !== tenantId) {
      throw new ForbiddenException('Utilisateur non autorise pour cette verification.');
    }

    const tenant = await this.requireTenant(tenantId);
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        tenantId,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Abonnement introuvable.');
    }

    if (!subscription.providerReference) {
      throw new BadRequestException(
        'Aucun paiement Maketou n est associe a cet abonnement.',
      );
    }

    const cart = await this.maketouService.getCart(subscription.providerReference);

    const updatedSubscription = await this.applyCartStatus(
      tenant.id,
      subscription,
      cart,
    );
    const capabilities = await this.getCurrentPlan(tenant.id);

    return {
      tenantId: tenant.id,
      subscriptionId: updatedSubscription.id,
      cartId: cart.id,
      cartStatus: cart.status,
      activated:
        capabilities.currentPlan === PlanType.PREMIUM &&
        updatedSubscription.status === SubscriptionStatus.ACTIVE,
      capabilities,
      message: this.getConfirmationMessage(cart.status),
    };
  }

  async handleMaketouWebhook(dto: MaketouWebhookDto) {
    const tenant = await this.requireTenant(dto.tenantId);
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        tenantId: tenant.id,
        providerReference: dto.providerReference,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Abonnement Maketou introuvable.');
    }

    const cartStatus = dto.success
      ? 'completed'
      : dto.status === 'payment_failed'
        ? 'payment_failed'
        : 'abandoned';

    return this.applyCartStatus(tenant.id, subscription, {
      id: dto.providerReference,
      status: cartStatus,
    });
  }

  async setPreviewMode(tenantId: string, enabled: boolean) {
    await this.requireTenant(tenantId);

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { premiumPreview: enabled },
    });
  }

  async forcePlan(tenantId: string, planType: PlanType) {
    const tenant = await this.requireTenant(tenantId);

    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setMonth(endsAt.getMonth() + 1);

    await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        currentPlan: planType,
        premiumPreview: false,
      },
    });

    await this.prisma.store.update({
      where: { tenantId },
      data: {
        allowCustomTheme: planType === PlanType.PREMIUM,
      },
    });

    const existingSubscription = await this.getLatestSubscription(tenantId);

    if (existingSubscription) {
      return this.prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planType,
          status: SubscriptionStatus.ACTIVE,
          amount: planType === PlanType.PREMIUM ? 1 : 0,
          currency: StoreCurrency.USD,
          providerReference: null,
          startsAt: now,
          endsAt: planType === PlanType.PREMIUM ? endsAt : null,
        },
      });
    }

    return this.prisma.subscription.create({
      data: {
        tenantId,
        planType,
        status: SubscriptionStatus.ACTIVE,
        amount: planType === PlanType.PREMIUM ? 1 : 0,
        currency: StoreCurrency.USD,
        startsAt: now,
        endsAt: planType === PlanType.PREMIUM ? endsAt : null,
      },
    });
  }

  async downgradeExpiredSubscription(tenantId: string) {
    const tenant = await this.requireTenant(tenantId);

    await this.prisma.$transaction(async (tx) => {
      await tx.tenant.update({
        where: { id: tenant.id },
        data: {
          currentPlan: PlanType.BASIC,
        },
      });

      await tx.store.update({
        where: { tenantId },
        data: {
          brandingEnabled: true,
          allowCustomTheme: false,
        },
      });

      await tx.subscription.updateMany({
        where: {
          tenantId,
          planType: PlanType.PREMIUM,
          status: SubscriptionStatus.ACTIVE,
        },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });
    });
  }

  async ensureCanCreateProduct(tenantId: string) {
    const tenant = await this.requireTenant(tenantId);

    if (tenant.currentPlan === PlanType.PREMIUM) {
      return;
    }

    const productsCount = await this.prisma.product.count({
      where: { tenantId },
    });

    if (productsCount >= 5) {
      throw new ForbiddenException(
        'Le plan Basic est limite a 5 produits. Passe au Premium pour continuer.',
      );
    }
  }

  async ensurePremiumFeature(tenantId: string) {
    const tenant = await this.requireTenant(tenantId);
    const subscription = await this.getLatestSubscription(tenantId);
    const capabilities = buildPlanCapabilities(
      tenant.currentPlan,
      subscription,
      tenant.store ?? null,
      tenant.premiumPreview,
    );

    if (!capabilities.canCustomizeStore) {
      throw new ForbiddenException(
        'Fonction Premium. Passe au Premium ou utilise l apercu Premium.',
      );
    }
  }

  private async applyCartStatus(
    tenantId: string,
    subscription: Subscription,
    cart: MaketouCart,
  ) {
    if (cart.status === 'completed') {
      return this.activatePremiumSubscription(tenantId, subscription, cart.id);
    }

    if (cart.status === 'waiting_payment') {
      return this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          planType: PlanType.PREMIUM,
          status: SubscriptionStatus.PENDING,
          providerReference: cart.id,
        },
      });
    }

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELED,
        providerReference: cart.id,
      },
    });
  }

  private async activatePremiumSubscription(
    tenantId: string,
    subscription: Subscription,
    cartId: string,
  ) {
    const tenant = await this.requireTenant(tenantId);

    if (
      tenant.currentPlan === PlanType.PREMIUM &&
      subscription.status === SubscriptionStatus.ACTIVE &&
      subscription.endsAt &&
      subscription.endsAt > new Date()
    ) {
      return subscription;
    }

    const startsAt = new Date();
    const endsAt = new Date(startsAt);
    endsAt.setMonth(endsAt.getMonth() + 1);

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.tenant.update({
        where: { id: tenant.id },
        data: {
          currentPlan: PlanType.PREMIUM,
          premiumPreview: false,
        },
      });

      await tx.store.update({
        where: { tenantId: tenant.id },
        data: {
          allowCustomTheme: true,
        },
      });

      return tx.subscription.update({
        where: { id: subscription.id },
        data: {
          planType: PlanType.PREMIUM,
          status: SubscriptionStatus.ACTIVE,
          amount: 1,
          currency: StoreCurrency.USD,
          providerReference: cartId,
          startsAt,
          endsAt,
        },
      });
    });

    await this.subscriptionExpiryQueue.add(
      'expire-premium',
      { tenantId: tenant.id, subscriptionId: updated.id },
      { delay: Math.max(endsAt.getTime() - Date.now(), 1) },
    );

    const owner = await this.prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        role: UserRole.OWNER,
      },
    });

    if (owner) {
      await this.notificationsService.createNotification({
        userId: owner.id,
        tenantId: tenant.id,
        type: 'SUBSCRIPTION_ACTIVATED',
        title: 'Premium active',
        body: 'Ton abonnement Premium est actif pour 1 mois.',
        link: '/dashboard',
      });
    }

    return updated;
  }

  private getConfirmationMessage(
    status: MaketouCart['status'],
  ): string {
    if (status === 'completed') {
      return 'Paiement confirme. Ton abonnement Premium est actif.';
    }

    if (status === 'waiting_payment') {
      return 'Paiement encore en attente de confirmation chez Maketou.';
    }

    if (status === 'payment_failed') {
      return 'Le paiement a echoue. Tu peux relancer le passage au Premium.';
    }

    return 'Le panier Maketou a été abandonné.';
  }

  private async requireTenant(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        store: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant introuvable.');
    }

    return tenant;
  }

  private async getLatestSubscription(tenantId: string) {
    return this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private splitDisplayName(displayName: string, fallbackLastName: string) {
    const cleanName = displayName.trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return {
        firstName: 'SellFlow',
        lastName: fallbackLastName,
      };
    }

    if (parts.length === 1) {
      return {
        firstName: parts[0],
        lastName: fallbackLastName,
      };
    }

    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
    };
  }
}


