import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { StoreCurrency } from '@prisma/client';
import { BillingService } from '../billing/billing.service';
import { buildPlanCapabilities } from '../common/utils/plan-capabilities';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStoreThemeDto } from './dto/update-store-theme.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {}

  async getCurrentStore(tenantId: string) {
    return this.requireStore(tenantId);
  }

  async updateCurrentStore(tenantId: string, dto: UpdateStoreDto) {
    const store = await this.requireStore(tenantId);
    const capabilities = await this.billingService.getCurrentPlan(tenantId);

    if (dto.brandingEnabled === false && !capabilities.canRemoveBranding) {
      throw new ForbiddenException(
        'Le branding SellFlow ne peut être désactivé qu'en Premium.',
      );
    }

    if (dto.logoUrl && !capabilities.canAddLogo) {
      throw new ForbiddenException(
        'L ajout du logo vendeur est reserve au plan Premium.',
      );
    }

    return this.prisma.store.update({
      where: { id: store.id },
      data: {
        name: dto.name,
        description: dto.description,
        defaultCurrency: dto.defaultCurrency ?? undefined,
        logoUrl: dto.logoUrl,
        brandingEnabled:
          dto.brandingEnabled === undefined ? undefined : dto.brandingEnabled,
      },
    });
  }

  async getTheme(tenantId: string) {
    const store = await this.requireStore(tenantId);

    return this.prisma.storeTheme.findUnique({
      where: { storeId: store.id },
    });
  }

  async updateTheme(tenantId: string, dto: UpdateStoreThemeDto) {
    await this.billingService.ensurePremiumFeature(tenantId);
    const store = await this.requireStore(tenantId);

    return this.prisma.storeTheme.upsert({
      where: { storeId: store.id },
      update: {
        primaryColor: dto.primaryColor,
        accentColor: dto.accentColor,
        visualPreset: dto.visualPreset,
        logoUrl: dto.logoUrl,
      },
      create: {
        storeId: store.id,
        primaryColor: dto.primaryColor ?? '#10b981',
        accentColor: dto.accentColor ?? '#0f172a',
        visualPreset: dto.visualPreset ?? 'default',
        logoUrl: dto.logoUrl,
      },
    });
  }

  async getPreview(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
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
    });

    if (!tenant?.store) {
      throw new NotFoundException('Boutique introuvable.');
    }

    return {
      store: tenant.store,
      previewUrl: `/shop?slug=${tenant.store.slug}`,
      publicApiUrl: `/public/store/${tenant.store.slug}`,
      capabilities: buildPlanCapabilities(
        tenant.currentPlan,
        tenant.subscriptions[0] ?? null,
        tenant.store,
        tenant.premiumPreview,
      ),
    };
  }

  async getDashboardContext(tenantId: string) {
    const store = await this.requireStore(tenantId);
    const capabilities = await this.billingService.getCurrentPlan(tenantId);

    return {
      store,
      capabilities,
      currencies: [
        { value: StoreCurrency.USD, label: 'Dollar / USD' },
        { value: StoreCurrency.CDF, label: 'Franc congolais / CDF' },
        { value: StoreCurrency.FCFA, label: 'FCFA' },
      ],
    };
  }

  private async requireStore(tenantId: string) {
    const store = await this.prisma.store.findUnique({
      where: { tenantId },
      include: {
        theme: true,
      },
    });

    if (!store) {
      throw new NotFoundException('Boutique introuvable.');
    }

    return store;
  }
}


