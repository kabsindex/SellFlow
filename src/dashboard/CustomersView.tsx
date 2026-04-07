import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SearchIcon,
  ShoppingBagIcon,
  SparklesIcon,
  StickyNoteIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { apiRequest } from '../lib/api';
import { formatCurrency, normalizeAmount } from '../lib/currency';
import type { CurrencyCode, CustomerRecord, StoreRecord } from '../lib/types';

interface CustomersViewProps {
  store: StoreRecord | null;
  currency: CurrencyCode;
  onChanged: () => Promise<void>;
  onOpenUpgrade: () => void;
}

export function CustomersView({
  currency,
  onChanged,
  onOpenUpgrade,
}: CustomersViewProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [nextActionDraft, setNextActionDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await apiRequest<CustomerRecord[]>('/customers');
      setCustomers(payload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de charger le CRM.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return customers;
    }
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query),
    );
  }, [customers, searchQuery]);

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + normalizeAmount(customer.totalSpent),
    0,
  );

  const repeatCustomers = customers.filter((customer) => customer.totalOrders >= 2).length;

  const openCustomer = async (customerId: string) => {
    const payload = await apiRequest<CustomerRecord>(`/customers/${customerId}`);
    setSelectedCustomer(payload);
    setNoteDraft('');
    setNextActionDraft(payload.nextAction ?? '');
  };

  const handleSave = async () => {
    if (!selectedCustomer) {
      return;
    }

    setSaving(true);
    try {
      await apiRequest(`/customers/${selectedCustomer.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nextAction: nextActionDraft.trim() || null,
        }),
      });

      if (noteDraft.trim()) {
        await apiRequest(`/customers/${selectedCustomer.id}/notes`, {
          method: 'POST',
          body: JSON.stringify({
            content: noteDraft.trim(),
            attachments: [],
          }),
        });
      }

      await loadCustomers();
      const refreshed = await apiRequest<CustomerRecord>(`/customers/${selectedCustomer.id}`);
      setSelectedCustomer(refreshed);
      setNoteDraft('');
      setNextActionDraft(refreshed.nextAction ?? '');
      await onChanged();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CRM clients</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          Le CRM affiche l historique d achat, les categories preferees, la
          frequence, le total commande et les suggestions basees sur ces regles simples.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Clientes
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{customers.length}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Clientes récurrentes
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{repeatCustomers}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Valeur CRM
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {formatCurrency(totalRevenue, currency)}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <SparklesIcon className="h-4 w-4 text-primary-500" />
            Premium = 1$ / mois
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Le Premium débloque surtout la personnalisation boutique, le branding
            off, les produits illimités et les vues avancées de la plateforme.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher une cliente ou un numéro"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          {loading ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
              Chargement du CRM...
            </div>
          ) : filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => void openCustomer(customer.id)}
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
                      <p className="text-lg font-bold text-slate-900">{customer.name}</p>
                      <p className="text-sm text-slate-500">{customer.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(normalizeAmount(customer.totalSpent), currency)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{customer.totalOrders} commandes</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Prochaine action</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {customer.nextAction || 'A definir'}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Suggestions</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {customer.suggestions?.[0] ?? 'Suggestions disponibles dans la fiche cliente'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <UsersIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">CRM déjà utile</p>
                <p className="text-xs text-slate-500">Notes, historique et WhatsApp</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Historique des commandes par cliente
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Prochaine action modifiable
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Suggestions simples basees sur les achats
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Fonctions Premium</p>
            <div className="mt-4 space-y-3">
              {[
                'Personnalisation boutique',
                'Branding SellFlow désactivable',
                'Produits illimités et vues avancées',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="mt-5 w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Voir le Premium
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCustomer ? (
          <>
            <motion.div className="fixed inset-0 z-50 bg-slate-950/45" onClick={() => setSelectedCustomer(null)} />
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
                    <p className="text-lg font-bold text-slate-900">{selectedCustomer.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedCustomer.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
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
                    <p className="mt-3 text-2xl font-bold text-slate-900">{selectedCustomer.totalOrders}</p>
                    <p className="mt-1 text-xs text-slate-500">Commandes</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-4 text-center">
                    <SparklesIcon className="mx-auto h-5 w-5 text-amber-500" />
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {formatCurrency(normalizeAmount(selectedCustomer.totalSpent), currency)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Depense</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-4 text-center">
                    <StickyNoteIcon className="mx-auto h-5 w-5 text-slate-500" />
                    <p className="mt-3 text-sm font-bold text-slate-900">
                      {selectedCustomer.lastOrderAt
                        ? new Date(selectedCustomer.lastOrderAt).toLocaleDateString('fr-FR')
                        : 'Aucune'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Derniere commande</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Prochaine action</p>
                  <input
                    type="text"
                    value={nextActionDraft}
                    onChange={(event) => setNextActionDraft(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />
                </div>

                <div className="rounded-[1.75rem] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Suggestions basees sur les achats</p>
                  <div className="mt-3 space-y-2">
                    {(selectedCustomer.suggestions ?? []).map((suggestion) => (
                      <div key={suggestion} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                        {suggestion}
                      </div>
                    ))}
                    {!selectedCustomer.suggestions?.length ? (
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500">
                        Aucune suggestion pour le moment.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Ajouter une note</p>
                  <textarea
                    rows={4}
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void handleSave()}
                    className="mt-3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedCustomer.notes?.map((note) => (
                    <div key={note.id} className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
                      <p className="text-sm text-slate-700">{note.content}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${selectedCustomer.phone.replace(/\D/g, '')}`,
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 text-sm font-semibold text-white hover:bg-green-600"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Ecrire sur WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}


