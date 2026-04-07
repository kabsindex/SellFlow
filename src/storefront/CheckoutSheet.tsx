import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircleIcon,
  FileTextIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { publicRequest } from '../lib/api';
import { formatCurrency, normalizeAmount } from '../lib/currency';
import { hexToRgba, type StorefrontThemePalette } from '../lib/theme';
import type {
  CurrencyCode,
  DeliveryZoneRecord,
  PaymentMethodRecord,
  PublicOrderResponse,
} from '../lib/types';
import { useCart } from './useCart';

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  storeSlug: string;
  currency: CurrencyCode;
  paymentMethods: PaymentMethodRecord[];
  deliveryZones: DeliveryZoneRecord[];
  theme: StorefrontThemePalette;
}

function readFile(file: File) {
  return new Promise<{ dataUrl: string; name: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve({ dataUrl: reader.result, name: file.name })
        : reject(new Error('Preuve invalide.'));
    reader.onerror = () => reject(new Error('Preuve invalide.'));
    reader.readAsDataURL(file);
  });
}

export function CheckoutSheet({
  isOpen,
  onClose,
  storeSlug,
  currency,
  paymentMethods,
  deliveryZones,
  theme,
}: CheckoutSheetProps) {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethodId: paymentMethods[0]?.id ?? '',
    deliveryZoneId: deliveryZones[0]?.id ?? '',
  });
  const [proof, setProof] = useState<{ dataUrl: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<PublicOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedZone = deliveryZones.find((zone) => zone.id === form.deliveryZoneId);
  const finalTotal = total + normalizeAmount(selectedZone?.price ?? 0);
  const isValid = Boolean(
    form.name.trim() &&
      form.phone.trim() &&
      form.address.trim() &&
      form.paymentMethodId &&
      proof &&
      items.length,
  );

  const noteWithOptions = useMemo(() => {
    const options = items
      .filter((item) => item.size)
      .map((item) => `${item.name}: ${item.size}`)
      .join(', ');
    return [form.notes.trim(), options ? `Options: ${options}` : '']
      .filter(Boolean)
      .join(' | ');
  }, [form.notes, items]);

  const handleSubmit = async () => {
    if (!isValid || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = await publicRequest<PublicOrderResponse>(
        `/public/store/${storeSlug}/orders`,
        {
          method: 'POST',
          body: JSON.stringify({
            customerName: form.name.trim(),
            customerPhone: form.phone.trim(),
            customerAddress: form.address.trim(),
            notes: noteWithOptions || undefined,
            paymentMethodId: form.paymentMethodId,
            deliveryZoneId: form.deliveryZoneId || undefined,
            paymentProofDataUrl: proof?.dataUrl,
            paymentProofFileName: proof?.name,
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          }),
        },
      );

      setSuccess(payload);
      clearCart();

      if (payload.whatsapp.whatsappUrl) {
        window.open(payload.whatsapp.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de confirmer cette commande.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSuccess(null);
    setError(null);
    setProof(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 z-50 bg-black/40"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[92vh] flex-col rounded-t-3xl bg-white"
          >
            <div className="sticky top-0 z-10 rounded-t-3xl border-b border-gray-100 bg-white px-4 py-3">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Finaliser la commande</h2>
                <button type="button" onClick={resetAndClose} className="text-sm font-semibold text-slate-500">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-1 flex-col items-center justify-center px-6 py-16"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircleIcon className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Commande confirmée</h3>
                <p className="mt-2 text-center text-sm text-gray-500">
                  Suivi : {success.order.trackingReference}. La preuve de paiement est
                  enregistrée et le message WhatsApp est prêt.
                </p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  Fermer
                </button>
              </motion.div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-5">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="mb-3 text-sm font-semibold text-gray-900">Résumé de la commande</p>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.size || 'default'}`} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.price * item.quantity, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Livraison</span>
                        <span>{formatCurrency(normalizeAmount(selectedZone?.price ?? 0), currency)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-base font-bold text-gray-900">
                        <span>Total</span>
                        <span style={{ color: theme.primaryColor }}>
                          {formatCurrency(finalTotal, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-900">Tes informations</p>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nom complet"
                        value={form.name}
                        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm"
                      />
                    </div>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Numéro WhatsApp"
                        value={form.phone}
                        onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm"
                      />
                    </div>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Adresse de livraison"
                        value={form.address}
                        onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm"
                      />
                    </div>
                    <div className="relative">
                      <FileTextIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                      <textarea
                        rows={2}
                        placeholder="Notes optionnelles"
                        value={form.notes}
                        onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-900">Moyens de paiement disponibles</p>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              paymentMethodId: method.id,
                            }))
                          }
                          className="w-full rounded-xl border-2 border-gray-200 p-3.5 text-left"
                          style={
                            form.paymentMethodId === method.id
                              ? {
                                  borderColor: theme.primaryColor,
                                  backgroundColor: hexToRgba(theme.primaryColor, 0.08),
                                }
                              : undefined
                          }
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {method.network} · {method.displayName}
                          </p>
                          <p className="text-xs text-gray-400">{method.phoneNumber}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-900">Zone de livraison</p>
                    <select
                      value={form.deliveryZoneId}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, deliveryZoneId: event.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                    >
                      <option value="">Sans zone</option>
                      {deliveryZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} · {zone.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-900">Preuve de paiement</p>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
                      <WhatsAppIcon className="h-6 w-6 text-green-500" />
                      <p className="mt-2 text-sm font-medium text-gray-700">
                        Téléverser la preuve après dépôt
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) {
                            return;
                          }
                          setProof(await readFile(file));
                        }}
                      />
                    </label>
                    {proof ? (
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img
                          src={proof.dataUrl}
                          alt="Preuve de paiement"
                          className="h-48 w-full object-cover"
                        />
                        <div className="px-4 py-3 text-sm text-slate-700">{proof.name}</div>
                      </div>
                    ) : null}
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}
                </div>

                <div className="sticky bottom-0 mt-6 border-t border-gray-100 bg-white px-0 py-4">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold transition-all ${
                      isValid && !submitting
                        ? 'text-white shadow-sm'
                        : 'cursor-not-allowed bg-gray-200 text-gray-400'
                    }`}
                    style={
                      isValid && !submitting
                        ? { backgroundColor: theme.primaryColor }
                        : undefined
                    }
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    {submitting ? 'Confirmation...' : 'Confirmer et envoyer via WhatsApp'}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}




