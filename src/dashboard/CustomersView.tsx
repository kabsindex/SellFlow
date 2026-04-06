import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LockIcon,
  SearchIcon,
  ShoppingBagIcon,
  SparklesIcon,
  StickyNoteIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { formatUsd } from '../lib/currency';

interface CustomerOrder {
  id: string;
  product: string;
  amount: number;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  note: string;
  nextAction: string;
  orders: CustomerOrder[];
}

const initialCustomers: Customer[] = [
  {
    id: 'fatou',
    name: 'Fatou Diallo',
    phone: '+221771234567',
    totalOrders: 8,
    totalSpent: 229,
    lastOrder: '05 avr.',
    note: 'Cliente fidele. Aime les robes et prefere une reponse rapide.',
    nextAction: 'Relancer pour les nouveaux arrivages mode',
    orders: [
      { id: '#1251', product: 'Robe Ankara', amount: 24, date: '05 avr.' },
      { id: '#1227', product: 'Bijoux dores', amount: 12, date: '28 mars' },
    ],
  },
  {
    id: 'awa',
    name: 'Awa Sow',
    phone: '+221782345678',
    totalOrders: 5,
    totalSpent: 184,
    lastOrder: '05 avr.',
    note: 'Peut commander en lot pour revendre certains produits.',
    nextAction: 'Proposer un pack accessoires',
    orders: [{ id: '#1250', product: 'Sac en cuir', amount: 39, date: '05 avr.' }],
  },
  {
    id: 'aicha',
    name: 'Aicha Bah',
    phone: '+224624567890',
    totalOrders: 3,
    totalSpent: 78,
    lastOrder: '04 avr.',
    note: 'Aime voir une photo finale avant expedition.',
    nextAction: 'Confirmer la commande et rassurer sur le suivi',
    orders: [
      { id: '#1248', product: 'Sandales cuir', amount: 19, date: '04 avr.' },
    ],
  },
  {
    id: 'mariama',
    name: 'Mariama Camara',
    phone: '+225076789012',
    totalOrders: 4,
    totalSpent: 109,
    lastOrder: '02 avr.',
    note: 'Bonne cliente pour les produits lifestyle.',
    nextAction: 'Envoyer une offre cross-sell sur les sacs',
    orders: [
      { id: '#1247', product: 'Sneakers Nike', amount: 55, date: '02 avr.' },
    ],
  },
];

const premiumCrmFeatures = [
  'Tags et segments automatiques',
  'Historique client enrichi',
  'Vue recurrente et panier moyen',
];

export function CustomersView() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [noteDraft, setNoteDraft] = useState('');

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? null;

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
  });

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );
  const averageBasket = customers.length
    ? Math.round(totalRevenue / customers.length)
    : 0;
  const repeatCustomers = customers.filter(
    (customer) => customer.totalOrders >= 4
  ).length;

  const openCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setNoteDraft(customer.note);
  };

  const handleSaveNote = () => {
    if (!selectedCustomerId) {
      return;
    }

    setCustomers((current) =>
      current.map((customer) =>
        customer.id === selectedCustomerId
          ? { ...customer, note: noteDraft.trim() }
          : customer
      )
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">CRM clients</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          Le plan gratuit te laisse garder les informations essentielles sur les
          clientes. Le Premium va plus loin avec des segments, des tags et plus
          de lecture business.
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
            Clientes
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {customers.length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Contacts en CRM</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Clientes recurrentes
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {repeatCustomers}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            4 commandes ou plus
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Valeur CRM
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {formatUsd(totalRevenue)}
          </p>
          <p className="mt-2 text-sm text-slate-500">Depense cumulee</p>
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
            Le plan gratuit couvre les notes et l historique simple. Premium
            ajoute les tags, segments et la lecture du panier moyen.
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
              placeholder="Rechercher une cliente ou un numero"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            />
          </motion.div>

          <div className="space-y-4">
            {filteredCustomers.map((customer, index) => (
              <motion.button
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                onClick={() => openCustomer(customer)}
                className="w-full rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                        {customer.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {customer.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Derniere commande: {customer.lastOrder}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatUsd(customer.totalSpent)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {customer.totalOrders} commandes
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Note
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {customer.note}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Prochaine action
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {customer.nextAction}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <UsersIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  CRM inclus en Free
                </p>
                <p className="text-xs text-slate-500">
                  Fiches simples pour ne rien oublier
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Historique des commandes par cliente
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Notes internes pour mieux relancer
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Contact direct via WhatsApp
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <LockIcon className="h-4 w-4 text-primary-500" />
              Premium debloque
            </div>
            <div className="mt-4 space-y-3">
              {premiumCrmFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700"
                >
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-slate-900 p-4 text-white">
              <p className="text-sm font-semibold">Panier moyen Premium</p>
              <p className="mt-2 text-2xl font-bold">{formatUsd(averageBasket)}</p>
              <p className="mt-1 text-xs text-slate-300">
                Lecture business disponible dans le plan Premium
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/45"
              onClick={() => setSelectedCustomerId(null)}
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
                      {selectedCustomer.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCustomerId(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                  >
                    <XIcon className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] bg-slate-50 p-4 text-center">
                    <ShoppingBagIcon className="mx-auto h-5 w-5 text-primary-500" />
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {selectedCustomer.totalOrders}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Commandes</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-4 text-center">
                    <SparklesIcon className="mx-auto h-5 w-5 text-amber-500" />
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {formatUsd(selectedCustomer.totalSpent)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Depense</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-4 text-center">
                    <StickyNoteIcon className="mx-auto h-5 w-5 text-slate-500" />
                    <p className="mt-3 text-sm font-bold text-slate-900">
                      {selectedCustomer.lastOrder}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Derniere commande</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Prochaine action
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {selectedCustomer.nextAction}
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Notes vendeur
                  </p>
                  <textarea
                    rows={4}
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="mt-3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Enregistrer la note
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Historique des commandes
                  </p>
                  <div className="mt-3 space-y-3">
                    {selectedCustomer.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-[1.5rem] bg-slate-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {order.product}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {order.id} · {order.date}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatUsd(order.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/${selectedCustomer.phone.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-green-600"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Ecrire sur WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
