import { PrismaClient, PlanType, ProductStatus, StoreCurrency, SubscriptionStatus, UserRole, OrderStatus, PaymentStatus, PaymentType, PaymentNetwork, ShipmentStatus, NotificationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { whatsappNumber: '+221700000001' },
    update: {
      name: 'Super Admin SellFlow',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      name: 'Super Admin SellFlow',
      email: 'admin@sellflow.io',
      whatsappNumber: '+221700000001',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'boutique-amina' },
    update: {
      name: 'Boutique Amina',
      currentPlan: PlanType.BASIC,
      premiumPreview: false,
    },
    create: {
      name: 'Boutique Amina',
      slug: 'boutique-amina',
      currentPlan: PlanType.BASIC,
      premiumPreview: false,
    },
  });

  const owner = await prisma.user.upsert({
    where: { whatsappNumber: '+221771234567' },
    update: {
      tenantId: tenant.id,
      name: 'Amina Diallo',
      passwordHash,
      role: UserRole.OWNER,
    },
    create: {
      tenantId: tenant.id,
      name: 'Amina Diallo',
      email: 'amina@sellflow.io',
      whatsappNumber: '+221771234567',
      passwordHash,
      role: UserRole.OWNER,
    },
  });

  const store = await prisma.store.upsert({
    where: { slug: 'amina' },
    update: {
      tenantId: tenant.id,
      name: 'Boutique Amina',
      description: 'Mode africaine et accessoires pour vendeurs mobile-first.',
      defaultCurrency: StoreCurrency.USD,
      brandingEnabled: true,
      allowCustomTheme: false,
    },
    create: {
      tenantId: tenant.id,
      name: 'Boutique Amina',
      slug: 'amina',
      description: 'Mode africaine et accessoires pour vendeurs mobile-first.',
      defaultCurrency: StoreCurrency.USD,
      brandingEnabled: true,
      allowCustomTheme: false,
    },
  });

  await prisma.storeTheme.upsert({
    where: { storeId: store.id },
    update: {
      primaryColor: '#10b981',
      accentColor: '#0f172a',
      visualPreset: 'default',
    },
    create: {
      storeId: store.id,
      primaryColor: '#10b981',
      accentColor: '#0f172a',
      visualPreset: 'default',
    },
  });

  const basicSubscription = await prisma.subscription.upsert({
    where: { tenantId: tenant.id },
    update: {
      planType: PlanType.BASIC,
      status: SubscriptionStatus.ACTIVE,
      amount: 0,
      currency: StoreCurrency.USD,
      startsAt: new Date(),
      endsAt: null,
    },
    create: {
      tenantId: tenant.id,
      planType: PlanType.BASIC,
      status: SubscriptionStatus.ACTIVE,
      amount: 0,
      currency: StoreCurrency.USD,
      startsAt: new Date(),
    },
  });

  const categoryMode = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: 'mode',
      },
    },
    update: { name: 'Mode' },
    create: {
      tenantId: tenant.id,
      name: 'Mode',
      slug: 'mode',
    },
  });

  const categoryAccessoires = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: 'accessoires',
      },
    },
    update: { name: 'Accessoires' },
    create: {
      tenantId: tenant.id,
      name: 'Accessoires',
      slug: 'accessoires',
    },
  });

  const robeAnkara = await prisma.product.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: 'robe-ankara',
      },
    },
    update: {
      categoryId: categoryMode.id,
      name: 'Robe Ankara',
      referenceNumber: 'REF-ANK-001',
      description: 'Robe midi ankara vendue via WhatsApp.',
      price: 24,
      stock: 12,
      status: ProductStatus.PUBLISHED,
    },
    create: {
      tenantId: tenant.id,
      categoryId: categoryMode.id,
      name: 'Robe Ankara',
      slug: 'robe-ankara',
      referenceNumber: 'REF-ANK-001',
      description: 'Robe midi ankara vendue via WhatsApp.',
      price: 24,
      stock: 12,
      status: ProductStatus.PUBLISHED,
    },
  });

  const sacCuir = await prisma.product.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: 'sac-en-cuir',
      },
    },
    update: {
      categoryId: categoryAccessoires.id,
      name: 'Sac en cuir',
      referenceNumber: 'REF-SAC-002',
      description: 'Sac en cuir artisanal pour boutique mobile-first.',
      price: 39,
      stock: 5,
      status: ProductStatus.PUBLISHED,
    },
    create: {
      tenantId: tenant.id,
      categoryId: categoryAccessoires.id,
      name: 'Sac en cuir',
      slug: 'sac-en-cuir',
      referenceNumber: 'REF-SAC-002',
      description: 'Sac en cuir artisanal pour boutique mobile-first.',
      price: 39,
      stock: 5,
      status: ProductStatus.PUBLISHED,
    },
  });

  await prisma.productImage.createMany({
    data: [
      {
        tenantId: tenant.id,
        productId: robeAnkara.id,
        url: 'https://images.sellflow.io/demo/robe-ankara.jpg',
        alt: 'Robe Ankara',
        sortOrder: 0,
      },
      {
        tenantId: tenant.id,
        productId: sacCuir.id,
        url: 'https://images.sellflow.io/demo/sac-cuir.jpg',
        alt: 'Sac en cuir',
        sortOrder: 0,
      },
    ],
    skipDuplicates: true,
  });

  const customer = await prisma.customer.upsert({
    where: {
      tenantId_phone: {
        tenantId: tenant.id,
        phone: '+221780000111',
      },
    },
    update: {
      name: 'Fatou Diallo',
      totalOrders: 3,
      totalSpent: 87,
      lastOrderAt: new Date(),
    },
    create: {
      tenantId: tenant.id,
      name: 'Fatou Diallo',
      phone: '+221780000111',
      totalOrders: 3,
      totalSpent: 87,
      lastOrderAt: new Date(),
    },
  });

  await prisma.customerNote.create({
    data: {
      tenantId: tenant.id,
      customerId: customer.id,
      content: 'Cliente fidele. Prefere une confirmation rapide sur WhatsApp.',
      attachments: [],
    },
  }).catch(() => undefined);

  await prisma.customerTag.createMany({
    data: [
      { tenantId: tenant.id, customerId: customer.id, label: 'VIP' },
      { tenantId: tenant.id, customerId: customer.id, label: 'Mode' },
    ],
    skipDuplicates: true,
  });

  const orangeMethod = await prisma.paymentMethod.create({
    data: {
      tenantId: tenant.id,
      network: PaymentNetwork.ORANGE,
      phoneNumber: '+221771234567',
      displayName: 'Amina Diallo',
      isActive: true,
    },
  }).catch(async () => {
    const existing = await prisma.paymentMethod.findFirstOrThrow({
      where: {
        tenantId: tenant.id,
        network: PaymentNetwork.ORANGE,
        phoneNumber: '+221771234567',
      },
    });
    return existing;
  });

  await prisma.paymentMethod.create({
    data: {
      tenantId: tenant.id,
      network: PaymentNetwork.AIRTEL,
      phoneNumber: '+221760000555',
      displayName: 'Amina Boutique',
      isActive: true,
    },
  }).catch(() => undefined);

  const dakarZone = await prisma.deliveryZone.create({
    data: {
      tenantId: tenant.id,
      name: 'Dakar Centre',
      price: 3,
      isActive: true,
    },
  }).catch(async () => {
    return prisma.deliveryZone.findFirstOrThrow({
      where: { tenantId: tenant.id, name: 'Dakar Centre' },
    });
  });

  const order = await prisma.order.upsert({
    where: {
      tenantId_orderNumber: {
        tenantId: tenant.id,
        orderNumber: 'ORD-0001',
      },
    },
    update: {
      status: OrderStatus.CONFIRMED,
      trackingReference: 'TRK-SLF-0001',
      subtotal: 24,
      deliveryFee: 3,
      total: 27,
      currency: StoreCurrency.USD,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: 'Dakar, Plateau',
      paymentMethodId: orangeMethod.id,
      deliveryZoneId: dakarZone.id,
      internalNote: 'Verification de la preuve de paiement.',
      attachments: [],
    },
    create: {
      tenantId: tenant.id,
      storeId: store.id,
      customerId: customer.id,
      paymentMethodId: orangeMethod.id,
      deliveryZoneId: dakarZone.id,
      orderNumber: 'ORD-0001',
      trackingReference: 'TRK-SLF-0001',
      status: OrderStatus.CONFIRMED,
      subtotal: 24,
      deliveryFee: 3,
      total: 27,
      currency: StoreCurrency.USD,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: 'Dakar, Plateau',
      notes: 'Livraison avant 18h.',
      internalNote: 'Verification de la preuve de paiement.',
      attachments: [],
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        productId: robeAnkara.id,
        name: robeAnkara.name,
        categoryName: 'Mode',
        quantity: 1,
        unitPrice: 24,
        lineTotal: 24,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      status: OrderStatus.CONFIRMED,
      note: 'Commande confirmee et en attente de preparation.',
      createdById: owner.id,
    },
  }).catch(() => undefined);

  const payment = await prisma.payment.upsert({
    where: { orderId: order.id },
    update: {
      tenantId: tenant.id,
      paymentMethodId: orangeMethod.id,
      type: PaymentType.ORDER,
      amount: 27,
      status: PaymentStatus.PROOF_SUBMITTED,
      message: 'Preuve recu depuis le checkout client.',
    },
    create: {
      tenantId: tenant.id,
      orderId: order.id,
      paymentMethodId: orangeMethod.id,
      type: PaymentType.ORDER,
      amount: 27,
      status: PaymentStatus.PROOF_SUBMITTED,
      message: 'Preuve recu depuis le checkout client.',
    },
  });

  await prisma.paymentProof.create({
    data: {
      tenantId: tenant.id,
      paymentId: payment.id,
      fileUrl: 'https://images.sellflow.io/demo/payment-proof-0001.jpg',
      fileName: 'payment-proof-0001.jpg',
      mimeType: 'image/jpeg',
    },
  }).catch(() => undefined);

  await prisma.shipment.upsert({
    where: { orderId: order.id },
    update: {
      tenantId: tenant.id,
      deliveryZoneId: dakarZone.id,
      trackingReference: 'TRK-SLF-0001',
      status: ShipmentStatus.PREPARING,
    },
    create: {
      tenantId: tenant.id,
      orderId: order.id,
      deliveryZoneId: dakarZone.id,
      trackingReference: 'TRK-SLF-0001',
      status: ShipmentStatus.PREPARING,
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        tenantId: tenant.id,
        userId: owner.id,
        type: 'NEW_ORDER',
        title: 'Nouvelle commande recue',
        body: 'Fatou Diallo a passe une commande ORD-0001.',
        link: '/dashboard?tab=commandes',
        data: { orderId: order.id },
        status: NotificationStatus.UNREAD,
      },
      {
        tenantId: tenant.id,
        userId: owner.id,
        type: 'PAYMENT_PROOF_RECEIVED',
        title: 'Preuve de paiement recue',
        body: 'Une preuve de paiement est disponible pour ORD-0001.',
        link: '/dashboard?tab=commandes',
        data: { paymentId: payment.id },
        status: NotificationStatus.UNREAD,
      },
      {
        userId: superAdmin.id,
        type: 'ACCOUNT_CREATED',
        title: 'Compte vendeur actif',
        body: 'Boutique Amina est active en plan Basic.',
        link: '/admin',
        data: { tenantId: tenant.id, subscriptionId: basicSubscription.id },
        status: NotificationStatus.UNREAD,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.whatsAppConnection.upsert({
    where: { tenantId: tenant.id },
    update: {
      phoneNumber: '+221771234567',
      displayName: 'Boutique Amina',
      isActive: true,
      defaultPrefix: 'Bonjour, merci pour votre commande sur Boutique Amina.',
    },
    create: {
      tenantId: tenant.id,
      phoneNumber: '+221771234567',
      displayName: 'Boutique Amina',
      isActive: true,
      defaultPrefix: 'Bonjour, merci pour votre commande sur Boutique Amina.',
    },
  });

  await prisma.dailyMetric.upsert({
    where: {
      tenantId_date: {
        tenantId: tenant.id,
        date: new Date(new Date().toISOString().slice(0, 10)),
      },
    },
    update: {
      revenueAmount: 27,
      ordersCount: 1,
      pendingPaymentsCount: 1,
      topProducts: [{ productName: 'Robe Ankara', revenue: 24 }],
    },
    create: {
      tenantId: tenant.id,
      date: new Date(new Date().toISOString().slice(0, 10)),
      revenueAmount: 27,
      ordersCount: 1,
      pendingPaymentsCount: 1,
      topProducts: [{ productName: 'Robe Ankara', revenue: 24 }],
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
