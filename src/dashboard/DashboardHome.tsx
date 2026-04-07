import { motion } from 'framer-motion';
import {
  ArrowUpRightIcon,
  ClipboardListIcon,
  PackageIcon,
  PlusIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { formatCurrency } from '../lib/currency';
import type { CurrencyCode, DashboardSummary, PlanCapabilities } from '../lib/types';

const quickActions = [
  {
    icon: PlusIcon,
    label: 'Ajouter un produit',
    action: 'produits',
    tone: 'bg-primary-500 text-white',
  },
  {
    icon: ClipboardListIcon,
    label: 'Suivre les commandes',
    action: 'commandes',
    tone: 'bg-slate-900 text-white',
  },
  {
    icon: UsersIcon,
    label: 'Ouvrir le CRM',
    action: 'clients',
    tone: 'bg-white text-slate-900 ring-1 ring-slate-200',
  },
];

interface DashboardHomeProps {
  sellerName: string;
  storeName: string;
  summary: DashboardSummary | null;
  capabilities: PlanCapabilities | null;
  currency: CurrencyCode;
  loading: boolean;
  onNavigate: (tab: string) => void;
  onOpenUpgrade: () => void;
}

export function DashboardHome({
  sellerName,
  storeName,
  summary,
  capabilities,
  currency,
  loading,
  onNavigate,
  onOpenUpgrade,
}: DashboardHomeProps) {
  const today = new Date();
  const dateLabel = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const stats = [
    {
      icon: TrendingUpIcon,
      label: summary?.revenueLabel ?? 'Revenu du mois',
      value: formatCurrency(summary?.revenueTotal ?? 0, currency),
      note: 'Basée sur les commandes du mois en cours',
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: ShoppingBagIcon,
      label: 'Commandes du mois',
      value: String(summary?.monthOrdersCount ?? 0),
      note: 'Volume mensuel des commandes',
      tone: 'bg-blue-50 text-blue-700',
    },
    {
      icon: UsersIcon,
      label: 'Paiements en attente',
      value: String(summary?.pendingPaymentsCount ?? 0),
      note: 'Paiements à vérifier ou confirmer',
      tone: 'bg-slate-100 text-slate-700',
    },
    {
      icon: PackageIcon,
      label: 'Top produits',
      value: String(summary?.topProducts.length ?? 0),
      note: 'Produits qui performent ce mois',
      tone: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Bonjour, {sellerName}
        </h1>
        <p className="mt-1 text-sm capitalize text-slate-500">{dateLabel}</p>
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_340px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#065f46_100%)] p-6 text-white shadow-[0_25px_70px_-35px_rgba(15,23,42,0.65)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              <WhatsAppIcon className="h-4 w-4" />
              Ventes depuis WhatsApp
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {capabilities?.currentPlan === 'PREMIUM' ? 'Plan Premium' : 'Plan Basique'}
            </div>
          </div>

          <h2 className="mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-[2.2rem]">
            Pilote ton activité depuis un tableau de bord simple, rapide et
            centre sur la vente.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200">
            Tu peux publier tes produits, suivre les paiements, préparer les
            commandes, gérer les clientes et prévisualiser ta boutique depuis
            le même espace vendeur.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.action)}
                className={`flex items-center justify-between rounded-2xl px-4 py-4 text-left text-sm font-semibold transition-transform hover:-translate-y-0.5 ${action.tone}`}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="h-5 w-5" />
                  <span>{action.label}</span>
                </div>
                <ArrowUpRightIcon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <WhatsAppIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{storeName}</p>
                <p className="text-xs text-slate-500">
                  Boutique connectée au flux commercial WhatsApp
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">
                Activité récente
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {summary?.recentActivity[0]
                  ? `Dernière commande ${summary.recentActivity[0].orderNumber} avec suivi ${summary.recentActivity[0].trackingReference}.`
                  : 'Les nouvelles commandes, paiements et suivis apparaîtront ici.'}
              </p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">Paiements en attente</span>
                <span className="font-semibold text-emerald-700">
                  {summary?.pendingPaymentsCount ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <SparklesIcon className="h-4 w-4 text-primary-500" />
              Premium débloque
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Produits illimités et suppression du branding SellFlow
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Personnalisation visuelle de la boutique et ajout du logo
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                CRM enrichi, analytics du mois et vues Premium
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              {capabilities?.currentPlan === 'PREMIUM'
                ? 'Voir les options Premium'
                : 'Passer au Premium'}
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-2 text-xs font-medium text-slate-500">{stat.note}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Revenu du mois
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Évolution mensuelle basée sur les commandes
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {formatCurrency(summary?.revenueTotal ?? 0, currency)}
            </div>
          </div>

          <div className="mt-6 h-56">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Chargement des revenus...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary?.revenueByMonth ?? []}>
                  <defs>
                    <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      border: 'none',
                      borderRadius: '16px',
                      color: '#ffffff',
                      fontSize: '12px',
                      padding: '10px 12px',
                    }}
                    formatter={(value: number) => [formatCurrency(value, currency), 'Revenus']}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#dashboardRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-[2rem] border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Commandes récentes
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Les derniers statuts et références de suivi
              </p>
            </div>
            <button
              onClick={() => onNavigate('commandes')}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              Voir tout
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {summary?.recentActivity.length ? (
              summary.recentActivity.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {order.trackingReference} · {order.status}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(order.total, currency)}
                    </p>
                    <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                Aucune commande récente pour le moment.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}



