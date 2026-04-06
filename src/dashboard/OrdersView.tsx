import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircleIcon,
  InboxIcon,
  LockIcon,
  MapPinIcon,
  PackageIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { formatUsd } from '../lib/currency';

type OrderStatus =
  | 'Nouvelle'
  | 'Confirmee'
  | 'Preparation'
  | 'Expediee'
  | 'Livree';

type FilterStatus = 'Toutes' | OrderStatus;

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  phone: string;
  city: string;
  payment: string;
  total: number;
  status: OrderStatus;
  tracking: string;
  updatedAt: string;
  note: string;
  items: OrderItem[];
}

const statusFlow: OrderStatus[] = [
  'Nouvelle',
  'Confirmee',
  'Preparation',
  'Expediee',
  'Livree',
];

const statusColors: Record<OrderStatus, string> = {
  Nouvelle: 'bg-blue-50 text-blue-700',
  Confirmee: 'bg-emerald-50 text-emerald-700',
  Preparation: 'bg-amber-50 text-amber-700',
  Expediee: 'bg-violet-50 text-violet-700',
  Livree: 'bg-slate-100 text-slate-700',
};

const initialOrders: Order[] = [
  {
    id: '#1251',
    customer: 'Fatou Diallo',
    phone: '+221771234567',
    city: 'Dakar, Plateau',
    payment: 'Mobile Money',
    total: 24,
    status: 'Nouvelle',
    tracking: '',
    updatedAt: 'Aujourd hui, 14:32',
    note: 'Cliente deja interessee, prefere la livraison avant 18h.',
    items: [{ name: 'Robe Ankara', qty: 1, price: 24 }],
  },
  {
    id: '#1250',
    customer: 'Awa Sow',
    phone: '+221782345678',
    city: 'Dakar, Almadies',
    payment: 'Paiement a la livraison',
    total: 39,
    status: 'Preparation',
    tracking: 'SLF-DKR-2003',
    updatedAt: 'Aujourd hui, 11:20',
    note: 'Verifier la disponibilite du sac noir.',
    items: [{ name: 'Sac en cuir', qty: 1, price: 39 }],
  },
  {
    id: '#1249',
    customer: 'Moussa Konate',
    phone: '+223763456789',
    city: 'Bamako, ACI 2000',
    payment: 'Virement',
    total: 12,
    status: 'Expediee',
    tracking: 'BKO-LOG-9812',
    updatedAt: 'Hier, 17:40',
    note: 'Commande cadeau, emballage simple.',
    items: [{ name: 'Bijoux dores', qty: 1, price: 12 }],
  },
  {
    id: '#1248',
    customer: 'Aicha Bah',
    phone: '+224624567890',
    city: 'Conakry, Kaloum',
    payment: 'Mobile Money',
    total: 19,
    status: 'Confirmee',
    tracking: '',
    updatedAt: 'Hier, 09:15',
    note: 'Demande une photo finale avant expedition.',
    items: [{ name: 'Sandales cuir', qty: 1, price: 19 }],
  },
  {
    id: '#1247',
    customer: 'Mariama Camara',
    phone: '+225076789012',
    city: 'Abidjan, Cocody',
    payment: 'Mobile Money',
    total: 55,
    status: 'Livree',
    tracking: 'ABJ-7743',
    updatedAt: '02 avr., 10:42',
    note: 'Cliente satisfaite, proposer un article complementaire.',
    items: [{ name: 'Sneakers Nike', qty: 1, price: 55 }],
  },
];

const premiumHighlights = [
  'Relances automatiques WhatsApp',
  'Vue prioritaire des commandes a risque',
  'SLA livraison et historique detaille',
];

export function OrdersView() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingDraft, setTrackingDraft] = useState('');

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? null;

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesFilter =
      activeFilter === 'Toutes' || order.status === activeFilter;
    const matchesSearch =
      !query ||
      order.customer.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.city.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const revenueInOrders = orders
    .filter((order) => order.status !== 'Livree')
    .reduce((sum, order) => sum + order.total, 0);

  const openOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setTrackingDraft(order.tracking);
  };

  const updateOrder = (orderId: string, patch: Partial<Order>) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, ...patch } : order
      )
    );
  };

  const handleStatusChange = (status: OrderStatus) => {
    if (!selectedOrderId) {
      return;
    }

    updateOrder(selectedOrderId, { status });
  };

  const handleTrackingSave = () => {
    if (!selectedOrderId) {
      return;
    }

    updateOrder(selectedOrderId, { tracking: trackingDraft.trim() });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Commandes et suivi
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          Retrouve les nouvelles commandes, confirme leur statut, garde une
          trace du suivi livraison et recontacte les clientes rapidement.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Nouvelles
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {orders.filter((order) => order.status === 'Nouvelle').length}
          </p>
          <p className="mt-2 text-sm text-slate-500">A confirmer au plus vite</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Preparation
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {orders.filter((order) => order.status === 'Preparation').length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Commandes a preparer</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            En cours
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {formatUsd(revenueInOrders)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Valeur des commandes ouvertes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-5"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <SparklesIcon className="h-4 w-4 text-primary-500" />
            Premium
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Le plan gratuit couvre le suivi manuel. Premium ajoute les relances
            automatiques, la priorite sur les dossiers et plus de visibilite.
          </p>
        </motion.div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="relative"
          >
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher par cliente, numero ou ville"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {(['Toutes', ...statusFlow] as FilterStatus[]).map((filter) => {
              const count =
                filter === 'Toutes'
                  ? orders.length
                  : orders.filter((order) => order.status === filter).length;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {filter} ({count})
                </button>
              );
            })}
          </motion.div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <InboxIcon className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Aucune commande trouvee
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Essaie un autre filtre ou un autre mot-cle.
                </p>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.button
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  onClick={() => openOrder(order)}
                  className="w-full rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-slate-900">
                          {order.customer}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {order.id} · {order.city}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {formatUsd(order.total)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span
                        key={item.name}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {item.qty} x {item.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
                    <span>Paiement: {order.payment}</span>
                    <span>Mis a jour: {order.updatedAt}</span>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-900">
              Suivi inclus dans le plan Free
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Mise a jour manuelle des statuts
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Contact direct avec la cliente via WhatsApp
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Reference de suivi et note vendeur
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <LockIcon className="h-4 w-4 text-primary-500" />
              Premium debloque
            </div>
            <div className="mt-4 space-y-3">
              {premiumHighlights.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700"
                >
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/45"
              onClick={() => setSelectedOrderId(null)}
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-[2rem] bg-white"
            >
              <div className="sticky top-0 z-10 rounded-t-[2rem] border-b border-slate-100 bg-white px-5 pb-4 pt-3">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      Commande {selectedOrder.id}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedOrder.customer} · {selectedOrder.updatedAt}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                  >
                    <XIcon className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Statut
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-5">
                    {statusFlow.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(status)}
                        className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors ${
                          selectedOrder.status === status
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Cliente
                  </p>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedOrder.customer}
                    </p>
                    <p className="text-sm text-slate-600">{selectedOrder.phone}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPinIcon className="h-4 w-4 text-slate-400" />
                      <span>{selectedOrder.city}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Produits
                  </p>
                  <div className="mt-3 space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-[1.5rem] bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500">
                            <PackageIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Quantite: {item.qty}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatUsd(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Paiement
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {selectedOrder.payment}
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Total
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formatUsd(selectedOrder.total)}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Reference de suivi
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={trackingDraft}
                      onChange={(event) => setTrackingDraft(event.target.value)}
                      placeholder="Ex: SLF-DKR-2003"
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    />
                    <button
                      type="button"
                      onClick={handleTrackingSave}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Note interne
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {selectedOrder.note}
                  </p>
                </div>

                <div className="space-y-3 pb-4">
                  <a
                    href={`https://wa.me/${selectedOrder.phone.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-green-600"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Contacter sur WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Livree')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Marquer comme livree
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
