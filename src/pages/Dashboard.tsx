import { useEffect, useMemo, useState, type ElementType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellIcon,
  CrownIcon,
  HomeIcon,
  MoreHorizontalIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { DashboardHome } from '../dashboard/DashboardHome';
import { OrdersView } from '../dashboard/OrdersView';
import { ProductsView } from '../dashboard/ProductsView';
import { CustomersView } from '../dashboard/CustomersView';
import { SettingsView } from '../dashboard/SettingsView';
import { AdminView } from '../dashboard/AdminView';
import { PremiumUpgradeModal } from '../components/PremiumUpgradeModal';
import { BrandLogo } from '../components/BrandLogo';
import { useAuth } from '../auth/AuthContext';
import { apiRequest } from '../lib/api';
import type {
  DashboardSummary,
  NotificationRecord,
} from '../lib/types';

type Tab = 'accueil' | 'commandes' | 'produits' | 'clients' | 'plus' | 'admin';

const mobileTabs: Array<{
  id: Exclude<Tab, 'admin'>;
  label: string;
  icon: ElementType;
}> = [
  { id: 'accueil', label: 'Accueil', icon: HomeIcon },
  { id: 'commandes', label: 'Commandes', icon: ShoppingBagIcon },
  { id: 'produits', label: 'Catalogue', icon: PackageIcon },
  { id: 'clients', label: 'CRM', icon: UsersIcon },
  { id: 'plus', label: 'Plus', icon: MoreHorizontalIcon },
];

const tabTitles: Record<Tab, string> = {
  accueil: 'Tableau de bord',
  commandes: 'Commandes & suivi',
  produits: 'Catalogue vendeur',
  clients: 'CRM clients',
  plus: 'Paramètres',
  admin: 'Administration plateforme',
};

function extractTabFromLink(link?: string | null): Tab | null {
  if (!link) {
    return null;
  }

  try {
    const url = new URL(link, window.location.origin);
    const tab = url.searchParams.get('tab');

    if (
      tab === 'accueil' ||
      tab === 'commandes' ||
      tab === 'produits' ||
      tab === 'clients' ||
      tab === 'plus' ||
      tab === 'admin'
    ) {
      return tab;
    }
  } catch (_error) {
    return null;
  }

  return null;
}

export function Dashboard() {
  const { session, signOut, reloadSession } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(
    (searchParams.get('tab') as Tab | null) ?? 'accueil',
  );
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const isSuperAdmin = session?.user.role === 'SUPER_ADMIN';
  const store = session?.store ?? null;
  const capabilities = session?.capabilities ?? null;
  const storeName = store?.name ?? session?.tenant?.name ?? 'Ma boutique';
  const publishedProductsLabel =
    summary?.topProducts.length !== undefined && summary.topProducts.length >= 0
      ? summary.topProducts.length
      : 0;
  const defaultTabItems: Array<{
    id: Tab;
    label: string;
    icon: ElementType;
  }> = [
    { id: 'accueil', label: 'Tableau de bord', icon: HomeIcon },
    { id: 'commandes', label: 'Commandes', icon: ShoppingBagIcon },
    { id: 'produits', label: 'Catalogue vendeur', icon: PackageIcon },
    { id: 'clients', label: 'CRM clients', icon: UsersIcon },
    { id: 'plus', label: 'Paramètres', icon: SettingsIcon },
  ];

  const sidebarItems = isSuperAdmin
    ? [
        ...defaultTabItems,
        { id: 'admin' as Tab, label: 'Admin plateforme', icon: CrownIcon },
      ]
    : defaultTabItems;

  useEffect(() => {
    const tab = searchParams.get('tab');

    if (
      tab === 'accueil' ||
      tab === 'commandes' ||
      tab === 'produits' ||
      tab === 'clients' ||
      tab === 'plus' ||
      (tab === 'admin' && isSuperAdmin)
    ) {
      setActiveTab(tab);
    }
  }, [isSuperAdmin, searchParams]);

  const loadDashboardData = async () => {
    setDashboardLoading(true);

    try {
      const [summaryPayload, notificationsPayload, unreadPayload] = await Promise.all([
        apiRequest<DashboardSummary>('/dashboard/summary'),
        apiRequest<NotificationRecord[]>('/notifications'),
        apiRequest<{ count: number }>('/notifications/unread-count'),
      ]);

      setSummary(summaryPayload);
      setNotifications(notificationsPayload);
      setUnreadCount(unreadPayload.count);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'accueil' ? {} : { tab });
  };

  const handleNotificationClick = async (notification: NotificationRecord) => {
    if (notification.status === 'UNREAD') {
      await apiRequest(`/notifications/${notification.id}/read`, {
        method: 'POST',
      });
    }

    const nextTab = extractTabFromLink(notification.link);

    if (nextTab) {
      handleTabChange(nextTab);
    }

    setNotificationsOpen(false);
    await loadDashboardData();
  };

  const handleRefreshSession = async () => {
    await reloadSession();
    await loadDashboardData();
  };

  const handlePlanUpdated = async () => {
    await handleRefreshSession();
  };

  const planBadgeLabel = useMemo(() => {
    if (!capabilities) {
      return 'Plan Basique';
    }

    if (capabilities.currentPlan === 'PREMIUM') {
      return 'Plan Premium actif';
    }

    if (capabilities.premiumPreviewEnabled) {
      return 'Aperçu Premium';
    }

    return 'Plan Basique actif';
  }, [capabilities]);

  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return (
          <DashboardHome
            sellerName={session?.user.name ?? 'Vendeur'}
            storeName={storeName}
            summary={summary}
            capabilities={capabilities}
            currency={store?.defaultCurrency ?? 'USD'}
            loading={dashboardLoading}
            onNavigate={(tab) => handleTabChange(tab as Tab)}
            onOpenUpgrade={() => setUpgradeOpen(true)}
          />
        );
      case 'commandes':
        return (
          <OrdersView
            store={store}
            currency={store?.defaultCurrency ?? 'USD'}
            onChanged={loadDashboardData}
            onOpenUpgrade={() => setUpgradeOpen(true)}
          />
        );
      case 'produits':
        return (
          <ProductsView
            store={store}
            capabilities={capabilities}
            onChanged={handleRefreshSession}
            onOpenUpgrade={() => setUpgradeOpen(true)}
          />
        );
      case 'clients':
        return (
          <CustomersView
            store={store}
            currency={store?.defaultCurrency ?? 'USD'}
            onChanged={loadDashboardData}
            onOpenUpgrade={() => setUpgradeOpen(true)}
          />
        );
      case 'plus':
        return (
          <SettingsView
            session={session}
            onSignedOut={() => {
              signOut();
            }}
            onOpenUpgrade={() => setUpgradeOpen(true)}
            onChanged={handleRefreshSession}
          />
        );
      case 'admin':
        return isSuperAdmin ? <AdminView /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-6">
          <div>
            <BrandLogo
              iconClassName="h-9 w-9 rounded-xl"
              nameClassName="block text-lg font-bold text-slate-900"
            />
            <span className="ml-[46px] text-xs text-slate-500">Espace vendeur</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${
                  activeTab === item.id ? 'text-primary-500' : ''
                }`}
              />
              <span>{item.label}</span>
              {item.id === 'commandes' && (summary?.orderStatusBreakdown.new ?? 0) > 0 ? (
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {summary?.orderStatusBreakdown.new}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-100 px-4 py-4">
          <div className="rounded-3xl bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {capabilities?.currentPlan === 'PREMIUM' ? 'Premium' : 'Basique'}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {publishedProductsLabel} top produits ce mois
                </p>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {capabilities?.currentPlan === 'PREMIUM' ? 'Premium' : 'Free'}
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {capabilities?.currentPlan === 'PREMIUM'
                ? 'Ta boutique profite des options Premium et de la personnalisation avancée.'
                : 'Passe au Premium pour retirer le branding, personnaliser la boutique et publier sans limite.'}
            </p>

            <button
              type="button"
              onClick={() => setUpgradeOpen(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              <SparklesIcon className="h-4 w-4" />
              {capabilities?.currentPlan === 'PREMIUM'
                ? 'Voir les options Premium'
                : 'Passer au Premium'}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <span className="text-sm font-bold text-slate-600">
                {session?.user.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {session?.user.name}
              </p>
              <p className="truncate text-xs text-slate-500">{storeName}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                SellFlow
              </p>
              <h2 className="truncate text-lg font-bold text-slate-900">
                {tabTitles[activeTab]}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setUpgradeOpen(true)}
                className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 sm:inline-flex"
              >
                {planBadgeLabel}
              </button>

              {isSuperAdmin ? (
                <button
                  type="button"
                  onClick={() => handleTabChange('admin')}
                  className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 lg:flex"
                >
                  <CrownIcon className="h-4 w-4" />
                  Admin
                </button>
              ) : null}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((current) => !current)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-slate-100"
                >
                  <BellIcon className="h-5 w-5 text-slate-600" />
                  {unreadCount > 0 ? (
                    <span className="absolute right-1.5 top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>

                <AnimatePresence>
                  {notificationsOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 z-40 w-[340px] rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Notifications
                          </p>
                          <p className="text-xs text-slate-500">
                            {unreadCount} non lues
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                        >
                          Fermer
                        </button>
                      </div>

                      <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto">
                        {notifications.length ? (
                          notifications.map((notification) => (
                            <button
                              type="button"
                              key={notification.id}
                              onClick={() => void handleNotificationClick(notification)}
                              className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                                notification.status === 'UNREAD'
                                  ? 'border-primary-100 bg-primary-50/60'
                                  : 'border-slate-200 bg-white hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {notification.title}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {notification.body}
                                  </p>
                                </div>
                                {notification.status === 'UNREAD' ? (
                                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-500" />
                                ) : null}
                              </div>
                              <p className="mt-3 text-xs text-slate-400">
                                {new Date(notification.createdAt).toLocaleString('fr-FR')}
                              </p>
                            </button>
                          ))
                        ) : (
                          <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                            Aucune notification pour le moment.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <a
                href={`https://wa.me/${session?.user.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 lg:flex"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </header>

        <main className="px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-around">
          {mobileTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-primary-600' : 'text-slate-400'
                }`}
              >
                {isActive ? (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 h-0.5 w-12 rounded-full bg-primary-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                ) : null}

                <tab.icon className={`h-5 w-5 ${isActive ? 'text-primary-500' : ''}`} />
                <span className="text-[10px] font-medium">{tab.label}</span>

                {tab.id === 'commandes' && (summary?.orderStatusBreakdown.new ?? 0) > 0 ? (
                  <span className="absolute right-1/2 top-2 flex h-4 w-4 translate-x-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {summary?.orderStatusBreakdown.new}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>

      <PremiumUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        onPlanUpdated={handlePlanUpdated}
      />
    </div>
  );
}

