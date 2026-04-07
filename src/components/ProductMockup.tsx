import { motion } from 'framer-motion';
import {
  BellIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  CrownIcon,
  HomeIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react';

const sidebarItems = [
  { icon: HomeIcon, label: 'Tableau de bord', active: false },
  { icon: ShoppingBagIcon, label: 'Commandes', active: true },
  { icon: PackageIcon, label: 'Catalogue vendeur', active: false },
  { icon: UsersIcon, label: 'CRM clients', active: false },
  { icon: SettingsIcon, label: 'Paramètres', active: false },
];

const summaryCards = [
  {
    label: 'Nouvelles',
    value: '12',
    note: 'A confirmer rapidement',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    label: 'Paiement en attente',
    value: '4',
    note: 'Preuves à vérifier',
    tone: 'bg-blue-50 text-blue-700',
  },
  {
    label: 'En préparation',
    value: '7',
    note: 'Commandes à préparer',
    tone: 'bg-slate-100 text-slate-700',
  },
  {
    label: 'Valeur ouverte',
    value: '$860',
    note: 'Commandes encore actives',
    tone: 'bg-amber-50 text-amber-700',
  },
];

const orderRows = [
  {
    client: 'Steven Mpiokolo',
    orderNumber: 'ORD-20260407-7298',
    tracking: 'TRK-SLF-340455',
    city: 'Dakar',
    total: '$200',
    status: 'Confirmée',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    client: 'Awa Sene',
    orderNumber: 'ORD-20260407-7181',
    tracking: 'TRK-SLF-340381',
    city: 'Abidjan',
    total: '$85',
    status: 'Paiement reçu',
    tone: 'bg-blue-50 text-blue-700',
  },
];

const sideHighlights = [
  'Référence de suivi automatique',
  'Recherche par référence dans la barre de recherche',
  'Pièces jointes et preuves visibles depuis la commande',
];

export function ProductMockup() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center sm:mb-16"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600">
            Tableau de bord vendeur
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Un aperçu beaucoup plus proche du vrai dashboard SellFlow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Visualise la structure réelle de l'espace vendeur : commandes,
            catalogue, CRM, notifications et options Premium au même endroit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white shadow-[0_40px_110px_-45px_rgba(15,23,42,0.42)]"
        >
          <div className="flex items-center gap-4 border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>

            <div className="flex-1">
              <div className="mx-auto flex max-w-xl items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                sellflow.io/amina/dashboard
              </div>
            </div>
          </div>

          <div className="grid min-h-[720px] lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-slate-50 px-5 py-6 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-white">
                  <ShoppingBagIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">SellFlow</p>
                  <p className="text-sm text-slate-500">Espace vendeur</p>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                      item.active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] bg-slate-900 p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">
                    Basique
                  </p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    Free
                  </span>
                </div>
                <p className="mt-3 text-lg font-semibold">
                  Passe au Premium pour personnaliser ta boutique et publier sans limite.
                </p>
                <button
                  type="button"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  <SparklesIcon className="h-4 w-4" />
                  Passer au Premium
                </button>
              </div>

              <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Amina Diallo
                  </p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    STEL243
                  </p>
                </div>
              </div>
            </aside>

            <div className="bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:px-7">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    Commandes & suivi
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Toutes les commandes, paiements et suivis centralisés au même endroit.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                  >
                    Aperçu Premium
                  </button>
                  <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
                  >
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      2
                    </span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                  >
                    <CheckCircle2Icon className="h-4 w-4" />
                    WhatsApp
                  </button>
                </div>
              </div>

              <div className="space-y-6 px-5 py-6 sm:px-7">
                <div className="grid gap-4 xl:grid-cols-4">
                  {summaryCards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.tone}`}
                      >
                        {card.label}
                      </div>
                      <p className="mt-4 text-4xl font-bold text-slate-900">
                        {card.value}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">{card.note}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="space-y-5">
                    <div className="rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                        <ClipboardListIcon className="h-5 w-5" />
                        Rechercher par cliente, commande, ville ou référence de suivi
                      </div>
                    </div>

                    <div className="space-y-4">
                      {orderRows.map((order) => (
                        <div
                          key={order.orderNumber}
                          className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <p className="text-2xl font-bold text-slate-900">
                                  {order.client}
                                </p>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${order.tone}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p className="mt-3 text-lg text-slate-500">
                                {order.orderNumber} â€¢ {order.tracking}
                              </p>
                              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">
                                {order.city}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-3xl font-bold text-slate-900">
                                {order.total}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xl font-bold text-slate-900">
                        Suivi déjà inclus
                      </p>
                      <div className="mt-4 space-y-3">
                        {sideHighlights.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.9rem] border border-emerald-100 bg-emerald-50 p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CrownIcon className="h-4 w-4" />
                        Premium sur la plateforme
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700">
                          Produits illimités
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700">
                          Suppression du branding SellFlow
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700">
                          Personnalisation de la boutique
                        </div>
                      </div>
                      <button
                        type="button"
                        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white"
                      >
                        Voir le Premium
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

