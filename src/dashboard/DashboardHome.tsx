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
import { formatUsd } from '../lib/currency';
import { freePlanProductLimit } from '../lib/plans';

const revenueData = [
  { day: 'Lun', value: 72 },
  { day: 'Mar', value: 94 },
  { day: 'Mer', value: 121 },
  { day: 'Jeu', value: 88 },
  { day: 'Ven', value: 167 },
  { day: 'Sam', value: 142 },
  { day: 'Dim', value: 199 },
];

const stats = [
  {
    icon: TrendingUpIcon,
    label: 'Revenus du mois',
    value: formatUsd(399),
    note: '+18% vs semaine precedente',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: ShoppingBagIcon,
    label: 'Commandes en cours',
    value: '18',
    note: '4 a confirmer aujourd hui',
    tone: 'bg-blue-50 text-blue-700',
  },
  {
    icon: UsersIcon,
    label: 'Clients actifs',
    value: '42',
    note: '12 clientes recurrentes ce mois',
    tone: 'bg-slate-100 text-slate-700',
  },
  {
    icon: PackageIcon,
    label: 'Produits publies',
    value: `3/${freePlanProductLimit}`,
    note: '2 slots restants en Free',
    tone: 'bg-amber-50 text-amber-700',
  },
];

const recentOrders = [
  {
    id: '#1251',
    customer: 'Fatou Diallo',
    product: 'Robe Ankara',
    amount: formatUsd(24),
    status: 'Nouvelle',
    statusClass: 'bg-blue-50 text-blue-700',
  },
  {
    id: '#1250',
    customer: 'Awa Sow',
    product: 'Sac en cuir',
    amount: formatUsd(39),
    status: 'Preparation',
    statusClass: 'bg-amber-50 text-amber-700',
  },
  {
    id: '#1249',
    customer: 'Moussa Konate',
    product: 'Bijoux dores',
    amount: formatUsd(12),
    status: 'Expediee',
    statusClass: 'bg-violet-50 text-violet-700',
  },
  {
    id: '#1248',
    customer: 'Aicha Bah',
    product: 'Sandales cuir',
    amount: formatUsd(19),
    status: 'Livree',
    statusClass: 'bg-slate-100 text-slate-700',
  },
];

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
  onNavigate: (tab: string) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const today = new Date();
  const dateLabel = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">Bonjour, Amina</h1>
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
              Plan Basique
            </div>
          </div>

          <h2 className="mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-[2.2rem]">
            Pilote ton activite depuis un tableau de bord simple, rapide et
            centre sur la vente.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200">
            Tu peux publier tes produits, repondre aux commandes, suivre les
            livraisons et garder les notes utiles sur chaque cliente. Premium
            debloque ensuite le CRM avance, les analytics et les produits sans
            limite.
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
                <p className="text-sm font-semibold text-slate-900">
                  4 nouvelles commandes
                </p>
                <p className="text-xs text-slate-500">
                  Recues sur WhatsApp depuis ce matin
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">
                Boutique Amina
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Les clientes demandent surtout la robe Ankara et le sac en cuir.
              </p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">Temps moyen de reponse</span>
                <span className="font-semibold text-emerald-700">8 min</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <SparklesIcon className="h-4 w-4 text-primary-500" />
              Premium debloque
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Produits illimites et suppression du branding
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                CRM avance avec tags, segments et historique enrichi
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Analytics sur les revenus, panier moyen et top produits
              </div>
            </div>
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
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {stat.note}
            </p>
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
                Revenus cette semaine
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Lecture rapide de la performance de la boutique
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              +23%
            </div>
          </div>

          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
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
                  formatter={(value: number) => [formatUsd(value), 'Revenus']}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#dashboardRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
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
                Commandes recentes
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Les derniers paiements et statuts
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
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {order.customer}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {order.id} · {order.product}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {order.amount}
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${order.statusClass}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
