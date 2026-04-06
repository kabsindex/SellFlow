import { useState, type ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  HomeIcon,
  MoreHorizontalIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  SparklesIcon,
  StoreIcon,
  UsersIcon,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { DashboardHome } from '../dashboard/DashboardHome';
import { OrdersView } from '../dashboard/OrdersView';
import { ProductsView } from '../dashboard/ProductsView';
import { CustomersView } from '../dashboard/CustomersView';
import { SettingsView } from '../dashboard/SettingsView';
import { freePlan, freePlanProductLimit } from '../lib/plans';

type Tab = 'accueil' | 'commandes' | 'produits' | 'clients' | 'plus';

const tabs: {
  id: Tab;
  label: string;
  icon: ElementType;
}[] = [
  {
    id: 'accueil',
    label: 'Accueil',
    icon: HomeIcon,
  },
  {
    id: 'commandes',
    label: 'Commandes',
    icon: ShoppingBagIcon,
  },
  {
    id: 'produits',
    label: 'Catalogue',
    icon: PackageIcon,
  },
  {
    id: 'clients',
    label: 'CRM',
    icon: UsersIcon,
  },
  {
    id: 'plus',
    label: 'Plus',
    icon: MoreHorizontalIcon,
  },
];

const sidebarItems: {
  id: Tab;
  label: string;
  icon: ElementType;
}[] = [
  {
    id: 'accueil',
    label: 'Tableau de bord',
    icon: HomeIcon,
  },
  {
    id: 'commandes',
    label: 'Commandes',
    icon: ShoppingBagIcon,
  },
  {
    id: 'produits',
    label: 'Catalogue vendeur',
    icon: PackageIcon,
  },
  {
    id: 'clients',
    label: 'CRM clients',
    icon: UsersIcon,
  },
  {
    id: 'plus',
    label: 'Parametres',
    icon: SettingsIcon,
  },
];

const tabTitles: Record<Tab, string> = {
  accueil: 'Tableau de bord',
  commandes: 'Commandes & suivi',
  produits: 'Catalogue vendeur',
  clients: 'CRM clients',
  plus: 'Parametres',
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('accueil');
  const publishedProducts = 3;
  const usagePercent = (publishedProducts / freePlanProductLimit) * 100;

  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return <DashboardHome onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case 'commandes':
        return <OrdersView />;
      case 'produits':
        return <ProductsView />;
      case 'clients':
        return <CustomersView />;
      case 'plus':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500">
            <StoreIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="block text-lg font-bold text-slate-900">
              SellFlow
            </span>
            <span className="text-xs text-slate-500">Espace vendeur</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
              {item.id === 'commandes' && (
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  4
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-100 px-4 py-4">
          <div className="rounded-3xl bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {freePlan.name}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {publishedProducts}/{freePlanProductLimit} produits publies
                </p>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                Free
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Passe au Premium pour publier sans limite, enrichir le CRM et
              retirer le branding SellFlow.
            </p>

            <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600">
              <SparklesIcon className="h-4 w-4" />
              Passer au Premium
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <span className="text-sm font-bold text-slate-600">A</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                Amina
              </p>
              <p className="truncate text-xs text-slate-500">
                Boutique Amina
              </p>
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
              <div className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
                Plan Basique actif
              </div>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-slate-100">
                <BellIcon className="h-5 w-5 text-slate-600" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
              </button>
              <a
                href="https://wa.me/221771234567"
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
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-primary-600' : 'text-slate-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 h-0.5 w-12 rounded-full bg-primary-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <tab.icon
                  className={`h-5 w-5 ${isActive ? 'text-primary-500' : ''}`}
                />
                <span className="text-[10px] font-medium">{tab.label}</span>

                {tab.id === 'commandes' && (
                  <span className="absolute right-1/2 top-2 flex h-4 w-4 translate-x-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    4
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
