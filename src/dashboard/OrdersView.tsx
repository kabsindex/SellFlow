import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircleIcon,
  InboxIcon,
  MapPinIcon,
  PackageIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { apiRequest, getApiBaseUrl } from '../lib/api';
import { formatCurrency, normalizeAmount } from '../lib/currency';
import type { CurrencyCode, OrderRecord, OrderStatus, StoreRecord } from '../lib/types';

interface OrdersViewProps {
  store: StoreRecord | null;
  currency: CurrencyCode;
  onChanged: () => Promise<void>;
  onOpenUpgrade: () => void;
}

const statusFlow: OrderStatus[] = [
  'NEW',
  'PAYMENT_PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'OUT_OF_STOCK',
  'CANCELED',
];

const statusLabels: Record<OrderStatus, string> = {
  NEW: 'Nouvelle',
  PAYMENT_PENDING: 'Paiement en attente',
  CONFIRMED: 'Confirmée',
  PROCESSING: 'Préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  OUT_OF_STOCK: 'Rupture de stock',
  CANCELED: 'Annulée',
};

const statusColors: Record<OrderStatus, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  PAYMENT_PENDING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-emerald-50 text-emerald-700',
  PROCESSING: 'bg-violet-50 text-violet-700',
  SHIPPED: 'bg-sky-50 text-sky-700',
  DELIVERED: 'bg-slate-100 text-slate-700',
  OUT_OF_STOCK: 'bg-red-50 text-red-700',
  CANCELED: 'bg-slate-200 text-slate-700',
};

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Fichier invalide.'));
    reader.onerror = () => reject(new Error('Fichier invalide.'));
    reader.readAsDataURL(file);
  });
}

export function OrdersView({ store, currency, onChanged, onOpenUpgrade }: OrdersViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await apiRequest<OrderRecord[]>('/orders');
      setOrders(payload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de charger les commandes.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  useEffect(() => {
    setInternalNote(selectedOrder?.internalNote ?? '');
    setAttachmentUrls(selectedOrder?.attachments ?? []);
  }, [selectedOrder]);

  const updateOrderQueryParam = (orderId?: string) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set('tab', 'commandes');

    if (orderId) {
      nextParams.set('order', orderId);
    } else {
      nextParams.delete('order');
    }

    setSearchParams(nextParams);
  };

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return orders;
    }
    return orders.filter((order) => {
      return (
        order.customerName.toLowerCase().includes(query) ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.trackingReference.toLowerCase().includes(query) ||
        order.customerAddress.toLowerCase().includes(query)
      );
    });
  }, [orders, searchQuery]);

  const openOrderById = async (orderId: string) => {
    const payload = await apiRequest<OrderRecord>(`/orders/${orderId}`);
    setSelectedOrder(payload);
    updateOrderQueryParam(payload.id);
  };

  const openOrder = async (order: OrderRecord) => openOrderById(order.id);

  const closeSelectedOrder = () => {
    setSelectedOrder(null);
    updateOrderQueryParam(undefined);
  };

  useEffect(() => {
    const orderId = searchParams.get('order');

    if (!orderId || selectedOrder?.id === orderId) {
      return;
    }

    void openOrderById(orderId);
  }, [searchParams, selectedOrder?.id]);

  const updateOrderStatus = async (status: OrderStatus) => {
    if (!selectedOrder) {
      return;
    }

    setSaving(true);
    try {
      await apiRequest(`/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          internalNote,
          attachmentUrls: attachmentUrls.filter(Boolean),
        }),
      });
      await loadOrders();
      const refreshed = await apiRequest<OrderRecord>(`/orders/${selectedOrder.id}`);
      setSelectedOrder(refreshed);
      await onChanged();
    } finally {
      setSaving(false);
    }
  };

  const handleAttachmentFiles = async (files: FileList | null) => {
    const nextFiles = Array.from(files ?? []);
    const nextUrls = await Promise.all(nextFiles.map((file) => readFile(file)));
    setAttachmentUrls((current) => [...current, ...nextUrls]);
  };

  const openProof = (fileUrl: string) => {
    const href = fileUrl.startsWith('data:')
      ? fileUrl
      : `${getApiBaseUrl().replace(/\/api$/, '')}${fileUrl}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const getPreviewUrl = (fileUrl: string) =>
    fileUrl.startsWith('data:')
      ? fileUrl
      : `${getApiBaseUrl().replace(/\/api$/, '')}${fileUrl}`;

  const openTrackingPreview = () => {
    if (!selectedOrder || !store) {
      return;
    }

    window.open(
      `/shop?slug=${store.slug}&tracking=${selectedOrder.trackingReference}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const openWhatsApp = () => {
    if (!selectedOrder) {
      return;
    }

    window.open(
      `https://wa.me/${selectedOrder.customerPhone.replace(/\D/g, '')}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const openUpgrade = () => {
    onOpenUpgrade();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Commandes et suivi</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          Recherche les commandes par cliente, numéro de commande ou référence de
          suivi, puis mets à jour les statuts avec une logique claire côté client.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Nouvelles',
            value: orders.filter((order) => order.status === 'NEW').length,
            note: 'A confirmer rapidement',
          },
          {
            label: 'Paiement en attente',
            value: orders.filter((order) => order.status === 'PAYMENT_PENDING').length,
            note: 'Preuves à vérifier',
          },
          {
            label: 'En préparation',
            value: orders.filter((order) => order.status === 'PROCESSING').length,
            note: 'Commandes à préparer',
          },
          {
            label: 'Valeur ouverte',
            value: formatCurrency(
              orders
                .filter((order) => !['DELIVERED', 'CANCELED'].includes(order.status))
                .reduce((sum, order) => sum + normalizeAmount(order.total), 0),
              currency,
            ),
            note: 'Commandes encore actives',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm text-slate-500">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher par cliente, commande, ville ou référence de suivi"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          {loading ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
              Chargement des commandes...
            </div>
          ) : filteredOrders.length ? (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => void openOrder(order)}
                className="w-full rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-slate-900">{order.customerName}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {order.orderNumber} · {order.trackingReference}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{order.customerAddress}</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {formatCurrency(normalizeAmount(order.total), currency)}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <InboxIcon className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-sm font-semibold text-slate-900">Aucune commande trouvée</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Suivi déjà inclus</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Référence de suivi automatique</div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Recherche par référence dans la barre de recherche</div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Pièces jointes et preuves visibles depuis la commande</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Premium sur la plateforme</p>
            <div className="mt-4 space-y-3">
              {[
                'Produits illimités',
                'Suppression du branding SellFlow',
                'Personnalisation de la boutique',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={openUpgrade}
              className="mt-5 w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Voir le Premium
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder ? (
          <>
            <motion.div className="fixed inset-0 z-50 bg-slate-950/45" onClick={closeSelectedOrder} />
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
                    <p className="text-lg font-bold text-slate-900">{selectedOrder.orderNumber}</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedOrder.trackingReference}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeSelectedOrder}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                  >
                    <XIcon className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {statusFlow.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => void updateOrderStatus(status)}
                      disabled={saving}
                      className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${
                        selectedOrder.status === status
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>

                <div className="rounded-[1.75rem] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Cliente</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{selectedOrder.customerName}</p>
                  <p className="mt-1 text-sm text-slate-600">{selectedOrder.customerPhone}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <MapPinIcon className="h-4 w-4 text-slate-400" />
                    <span>{selectedOrder.customerAddress}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={`${selectedOrder.id}-${item.name}`} className="flex items-center justify-between rounded-[1.5rem] bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500">
                          <PackageIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">Quantite: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(normalizeAmount(item.lineTotal), currency)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Paiement</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {selectedOrder.paymentMethod?.network ?? 'A confirmer'}
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Suivi</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedOrder.trackingReference}</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formatCurrency(normalizeAmount(selectedOrder.total), currency)}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Note interne</p>
                  <textarea
                    rows={4}
                    value={internalNote}
                    onChange={(event) => setInternalNote(event.target.value)}
                    className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                  />
                  <label className="mt-3 inline-flex cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                    Ajouter une piece jointe
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => void handleAttachmentFiles(event.target.files)}
                    />
                  </label>

                  {attachmentUrls.length ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {attachmentUrls.map((fileUrl, index) => (
                        <button
                          key={`${fileUrl.slice(0, 16)}-${index}`}
                          type="button"
                          onClick={() => openProof(fileUrl)}
                          className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          Voir pièce jointe {index + 1}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {selectedOrder.payment?.proofs?.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {selectedOrder.payment.proofs.map((proof) => (
                        <button
                          key={proof.id}
                          type="button"
                          onClick={() => openProof(proof.fileUrl)}
                          className="overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-left"
                        >
                          <img
                            src={getPreviewUrl(proof.fileUrl)}
                            alt={proof.fileName}
                            className="h-36 w-full object-cover"
                          />
                          <div className="px-3 py-2 text-xs font-semibold text-emerald-700">
                            Voir la preuve de paiement
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-3 pb-4">
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 text-sm font-semibold text-white hover:bg-green-600"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Contacter sur WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={openTrackingPreview}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Voir le suivi côté client
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}



