import {
  PlanType,
  Store,
  Subscription,
  SubscriptionStatus,
} from '@prisma/client';

export interface PlanCapabilities {
  currentPlan: PlanType;
  subscriptionStatus: SubscriptionStatus | 'NONE';
  subscriptionEndDate: string | null;
  canRemoveBranding: boolean;
  canCustomizeStore: boolean;
  canUsePremiumPreview: boolean;
  premiumPreviewEnabled: boolean;
  canAddLogo: boolean;
  brandingEnabled: boolean;
  premiumPriceLabel: string;
}

export function buildPlanCapabilities(
  plan: PlanType,
  subscription: Subscription | null,
  store: Pick<Store, 'brandingEnabled'> | null,
  premiumPreview = false,
): PlanCapabilities {
  const isPremiumActive =
    plan === PlanType.PREMIUM &&
    subscription?.status === SubscriptionStatus.ACTIVE &&
    !!subscription.endsAt &&
    subscription.endsAt > new Date();

  return {
    currentPlan: isPremiumActive ? PlanType.PREMIUM : PlanType.BASIC,
    subscriptionStatus: subscription?.status ?? 'NONE',
    subscriptionEndDate: subscription?.endsAt?.toISOString() ?? null,
    canRemoveBranding: isPremiumActive,
    canCustomizeStore: isPremiumActive,
    canUsePremiumPreview: true,
    premiumPreviewEnabled: premiumPreview,
    canAddLogo: isPremiumActive,
    brandingEnabled: store?.brandingEnabled ?? true,
    premiumPriceLabel: '1$ / mois',
  };
}
