export type CurrencyCode = 'USD' | 'CDF' | 'FCFA';
export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'SUPER_ADMIN';
export type PlanType = 'BASIC' | 'PREMIUM';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'PENDING' | 'NONE';
export type NotificationStatus = 'UNREAD' | 'READ';
export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'OUT_OF_STOCK' | 'ARCHIVED';
export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'PAYMENT_PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED'
  | 'OUT_OF_STOCK';
export type PaymentStatus =
  | 'PENDING'
  | 'PROOF_SUBMITTED'
  | 'VALIDATED'
  | 'REJECTED'
  | 'FAILED';
export type PaymentNetwork = 'ORANGE' | 'AIRTEL' | 'VODACOM' | 'AFRICELL';
export type ShipmentStatus = 'PENDING' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'FAILED';

export interface PlanCapabilities {
  currentPlan: PlanType;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate: string | null;
  canRemoveBranding: boolean;
  canCustomizeStore: boolean;
  canUsePremiumPreview: boolean;
  premiumPreviewEnabled: boolean;
  canAddLogo: boolean;
  brandingEnabled: boolean;
  premiumPriceLabel: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string | null;
  whatsappNumber: string;
  role: UserRole;
}

export interface SessionTenant {
  id: string;
  name: string;
  slug: string;
  premiumPreview: boolean;
}

export interface StoreTheme {
  id?: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string | null;
  visualPreset: string;
}

export interface StoreRecord {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  defaultCurrency: CurrencyCode;
  brandingEnabled: boolean;
  allowCustomTheme: boolean;
  theme?: StoreTheme | null;
}

export interface AuthSession {
  user: SessionUser;
  tenant: SessionTenant | null;
  store: StoreRecord | null;
  capabilities: PlanCapabilities;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  session: AuthSession;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface CategoryRecord {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
}

export interface ProductImageRecord {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

export interface ProductRecord {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string | null;
  referenceNumber: string;
  price: number | string;
  stock: number;
  status: ProductStatus;
  category?: CategoryRecord | null;
  images: ProductImageRecord[];
}

export interface PaymentMethodRecord {
  id: string;
  network: PaymentNetwork;
  phoneNumber: string;
  displayName: string;
  isActive: boolean;
}

export interface DeliveryZoneRecord {
  id: string;
  name: string;
  price: number | string;
  isActive: boolean;
}

export interface PaymentProofRecord {
  id: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId?: string | null;
  paymentMethodId?: string | null;
  amount: number | string;
  status: PaymentStatus;
  message?: string | null;
  createdAt: string;
  order?: OrderRecord | null;
  paymentMethod?: PaymentMethodRecord | null;
  proofs: PaymentProofRecord[];
}

export interface OrderItemRecord {
  id?: string;
  productId?: string | null;
  name: string;
  categoryName?: string | null;
  quantity: number;
  unitPrice: number | string;
  lineTotal: number | string;
}

export interface OrderHistoryRecord {
  id: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface ShipmentRecord {
  id: string;
  trackingReference: string;
  status: ShipmentStatus;
  statusHistory?: Array<{
    id: string;
    status: ShipmentStatus;
    note?: string | null;
    createdAt: string;
  }>;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  nextAction?: string | null;
  totalOrders: number;
  totalSpent: number | string;
  lastOrderAt?: string | null;
  notes?: Array<{
    id: string;
    content: string;
    attachments?: string[] | null;
    createdAt: string;
  }>;
  tags?: Array<{
    id: string;
    label: string;
  }>;
  suggestions?: string[];
  orders?: OrderRecord[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  trackingReference: string;
  status: OrderStatus;
  subtotal: number | string;
  deliveryFee: number | string;
  total: number | string;
  currency: CurrencyCode;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string | null;
  internalNote?: string | null;
  attachments?: string[] | null;
  createdAt: string;
  updatedAt: string;
  customer?: CustomerRecord;
  deliveryZone?: DeliveryZoneRecord | null;
  paymentMethod?: PaymentMethodRecord | null;
  payment?: PaymentRecord | null;
  shipment?: ShipmentRecord | null;
  items: OrderItemRecord[];
  statusHistory?: OrderHistoryRecord[];
}

export interface NotificationRecord {
  id: string;
  type: string;
  title: string;
  body: string;
  link?: string | null;
  status: NotificationStatus;
  createdAt: string;
  readAt?: string | null;
}

export interface DashboardSummary {
  revenueLabel: string;
  revenueTotal: number;
  monthOrdersCount: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  pendingPaymentsCount: number;
  topProducts: Array<{
    name: string;
    revenue: number;
    quantity: number;
  }>;
  recentActivity: Array<{
    id: string;
    orderNumber: string;
    trackingReference: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
  }>;
  orderStatusBreakdown: {
    new: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
  capabilities: PlanCapabilities;
}

export interface WhatsAppConnectionRecord {
  tenantId?: string;
  phoneNumber: string;
  displayName: string;
  isActive: boolean;
  defaultPrefix?: string | null;
}

export interface PublicStorePayload {
  store: StoreRecord & {
    tenant: {
      subscriptions: Array<{
        status: SubscriptionStatus;
        endsAt?: string | null;
      }>;
    };
  };
  productsCount: number;
  paymentMethods: PaymentMethodRecord[];
  deliveryZones: DeliveryZoneRecord[];
  whatsappConnection?: WhatsAppConnectionRecord | null;
}

export interface PublicOrderResponse {
  order: OrderRecord;
  whatsapp: {
    connection: WhatsAppConnectionRecord;
    message: string;
    targetPhone: string;
    whatsappUrl: string | null;
  };
}

export interface AdminDashboardPayload {
  totals: {
    accounts: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    basicAccounts: number;
    premiumAccounts: number;
  };
  accounts: Array<{
    tenantId: string;
    tenantName: string;
    storeName: string;
    currentPlan: PlanType;
    premiumPreview: boolean;
    ownerName: string | null;
    ownerWhatsapp: string | null;
    subscriptionStatus: SubscriptionStatus | 'NONE';
    subscriptionEndDate: string | null;
  }>;
}

export interface BillingUpgradeResponse {
  tenantId: string;
  currentPlan: PlanType;
  subscriptionId: string;
  premiumPrice: string;
  paymentMethodId?: string | null;
  maketou: {
    cartId: string;
    status: 'waiting_payment' | 'completed' | 'abandoned' | 'payment_failed';
    redirectUrl: string;
  };
}

export interface BillingConfirmResponse {
  tenantId: string;
  subscriptionId: string;
  cartId: string;
  cartStatus: 'waiting_payment' | 'completed' | 'abandoned' | 'payment_failed';
  activated: boolean;
  capabilities: PlanCapabilities;
  message: string;
}
