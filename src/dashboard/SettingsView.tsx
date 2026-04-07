import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  CopyIcon,
  CreditCardIcon,
  LogOutIcon,
  MapPinIcon,
  PaletteIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
  StoreIcon,
  Trash2Icon,
  TruckIcon,
  XIcon,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { apiRequest } from '../lib/api';
import { hexToRgba, resolveStorefrontTheme } from '../lib/theme';
import type {
  AuthSession,
  DeliveryZoneRecord,
  PaymentMethodRecord,
  PaymentNetwork,
  StoreRecord,
  StoreTheme,
  WhatsAppConnectionRecord,
} from '../lib/types';

interface SettingsViewProps {
  session: AuthSession | null;
  onSignedOut: () => void;
  onOpenUpgrade: () => void;
  onChanged: () => Promise<void>;
}

const networks: PaymentNetwork[] = ['ORANGE', 'AIRTEL', 'VODACOM', 'AFRICELL'];
const emptyPaymentForm = {
  network: 'ORANGE' as PaymentNetwork,
  phoneNumber: '',
  displayName: '',
  isActive: true,
};

function readLogoFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Logo invalide.'));
    reader.onerror = () => reject(new Error('Logo invalide.'));
    reader.readAsDataURL(file);
  });
}

export function SettingsView({
  session,
  onSignedOut,
  onOpenUpgrade,
  onChanged,
}: SettingsViewProps) {
  const [store, setStore] = useState<StoreRecord | null>(null);
  const [theme, setTheme] = useState<StoreTheme | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRecord[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZoneRecord[]>([]);
  const [whatsApp, setWhatsApp] = useState<WhatsAppConnectionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState(emptyPaymentForm);
  const [editingPaymentMethodId, setEditingPaymentMethodId] = useState<string | null>(null);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(emptyPaymentForm);
  const [newDeliveryZone, setNewDeliveryZone] = useState({
    name: '',
    price: '',
    isActive: true,
  });

  const capabilities = session?.capabilities;
  const shopLink = useMemo(
    () => (store ? `${window.location.origin}/shop?slug=${store.slug}` : ''),
    [store],
  );
  const previewTheme = useMemo(
    () => resolveStorefrontTheme(theme?.primaryColor, theme?.accentColor),
    [theme?.accentColor, theme?.primaryColor],
  );
  const previewShopLink = useMemo(() => {
    if (!store) return '';
    const searchParams = new URLSearchParams({
      slug: store.slug,
      previewPrimaryColor: previewTheme.primaryColor,
      previewAccentColor: previewTheme.accentColor,
    });
    return `${window.location.origin}/shop?${searchParams.toString()}`;
  }, [previewTheme.accentColor, previewTheme.primaryColor, store]);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [storePayload, themePayload, methodsPayload, zonesPayload, whatsappPayload] =
        await Promise.all([
          apiRequest<StoreRecord>('/stores/current'),
          apiRequest<StoreTheme | null>('/stores/current/theme'),
          apiRequest<PaymentMethodRecord[]>('/payment-methods'),
          apiRequest<DeliveryZoneRecord[]>('/delivery/zones'),
          apiRequest<WhatsAppConnectionRecord>('/whatsapp/connection'),
        ]);
      setStore(storePayload);
      setTheme(themePayload);
      setPaymentMethods(methodsPayload);
      setDeliveryZones(zonesPayload);
      setWhatsApp(whatsappPayload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de charger les paramètres.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const copyShopLink = async () => {
    if (!shopLink) return;
    await navigator.clipboard.writeText(shopLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const saveStore = async () => {
    if (!store) return;
    if (store.logoUrl && !capabilities?.canAddLogo) return void onOpenUpgrade();
    if (store.brandingEnabled === false && !capabilities?.canRemoveBranding) {
      return void onOpenUpgrade();
    }
    setSaving(true);
    try {
      await apiRequest('/stores/current', {
        method: 'PATCH',
        body: JSON.stringify({
          name: store.name,
          description: store.description,
          defaultCurrency: store.defaultCurrency,
          logoUrl: store.logoUrl || undefined,
          brandingEnabled: store.brandingEnabled,
        }),
      });
      await onChanged();
      await loadSettings();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de sauvegarder la boutique.',
      );
    } finally {
      setSaving(false);
    }
  };

  const saveWhatsApp = async () => {
    if (!whatsApp) return;
    await apiRequest('/whatsapp/connection', {
      method: 'PATCH',
      body: JSON.stringify(whatsApp),
    });
    await loadSettings();
  };

  const addPaymentMethod = async () => {
    await apiRequest('/payment-methods', {
      method: 'POST',
      body: JSON.stringify(newPaymentMethod),
    });
    setNewPaymentMethod(emptyPaymentForm);
    await loadSettings();
  };

  const togglePaymentMethod = async (method: PaymentMethodRecord) => {
    await apiRequest(`/payment-methods/${method.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !method.isActive }),
    });
    await loadSettings();
  };

  const startEditingPaymentMethod = (method: PaymentMethodRecord) => {
    setEditingPaymentMethodId(method.id);
    setEditingPaymentMethod({
      network: method.network,
      phoneNumber: method.phoneNumber,
      displayName: method.displayName,
      isActive: method.isActive,
    });
  };

  const cancelEditingPaymentMethod = () => {
    setEditingPaymentMethodId(null);
    setEditingPaymentMethod(emptyPaymentForm);
  };

  const savePaymentMethod = async () => {
    if (!editingPaymentMethodId) return;
    await apiRequest(`/payment-methods/${editingPaymentMethodId}`, {
      method: 'PATCH',
      body: JSON.stringify(editingPaymentMethod),
    });
    cancelEditingPaymentMethod();
    await loadSettings();
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    await apiRequest(`/payment-methods/${paymentMethodId}`, { method: 'DELETE' });
    if (editingPaymentMethodId === paymentMethodId) cancelEditingPaymentMethod();
    await loadSettings();
  };

  const addDeliveryZone = async () => {
    await apiRequest('/delivery/zones', {
      method: 'POST',
      body: JSON.stringify({
        name: newDeliveryZone.name,
        price: Number(newDeliveryZone.price),
        isActive: newDeliveryZone.isActive,
      }),
    });
    setNewDeliveryZone({ name: '', price: '', isActive: true });
    await loadSettings();
  };

  const toggleDeliveryZone = async (zone: DeliveryZoneRecord) => {
    await apiRequest(`/delivery/zones/${zone.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !zone.isActive }),
    });
    await loadSettings();
  };

  const saveTheme = async () => {
    if (!theme) return;
    if (!capabilities?.canCustomizeStore) return void onOpenUpgrade();
    await apiRequest('/stores/current/theme', {
      method: 'PATCH',
      body: JSON.stringify(theme),
    });
    await onChanged();
    await loadSettings();
  };

  const togglePreview = async () => {
    const nextEnabled = !capabilities?.premiumPreviewEnabled;
    await apiRequest('/billing/preview', {
      method: 'POST',
      body: JSON.stringify({ enabled: nextEnabled }),
    });
    await onChanged();
    await loadSettings();
    if (nextEnabled && previewShopLink) {
      window.open(previewShopLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Chargement des paramètres...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gère ta boutique, tes paiements, tes zones de livraison, WhatsApp et
          l'aperçu Premium depuis un seul écran.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <motion.div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <StoreIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{store?.name}</h3>
                <p className="text-sm text-slate-500">{store?.description || 'Sans description'}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-medium text-slate-500">Nom de la boutique</label>
                <input type="text" value={store?.name ?? ''} onChange={(event) =>
                  setStore((current) => (current ? { ...current, name: event.target.value } : current))
                } className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-medium text-slate-500">Description</label>
                <textarea rows={3} value={store?.description ?? ''} onChange={(event) =>
                  setStore((current) => (current ? { ...current, description: event.target.value } : current))
                } className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">Devise boutique</label>
                <select value={store?.defaultCurrency ?? 'USD'} onChange={(event) =>
                  setStore((current) => current ? {
                    ...current,
                    defaultCurrency: event.target.value as StoreRecord['defaultCurrency'],
                  } : current)
                } className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <option value="USD">Dollar / USD</option>
                  <option value="CDF">Franc congolais / CDF</option>
                  <option value="FCFA">FCFA</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">Logo vendeur</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center">
                  {store?.logoUrl ? (
                    <img
                      src={store.logoUrl}
                      alt="Logo vendeur"
                      className="mb-3 h-20 w-20 rounded-2xl object-cover"
                    />
                  ) : null}
                  <span className="text-sm font-medium text-slate-700">
                    {store?.logoUrl ? 'Changer le logo PNG' : 'Importer un logo PNG'}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Le vendeur Basic peut choisir un logo, mais l'enregistrement demandera le Premium.
                  </span>
                  <input
                    type="file"
                    accept="image/png"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      try {
                        const logoUrl = await readLogoFile(file);
                        setStore((current) =>
                          current ? { ...current, logoUrl } : current,
                        );
                      } catch (requestError) {
                        setError(
                          requestError instanceof Error
                            ? requestError.message
                            : 'Impossible de charger ce logo PNG.',
                        );
                      }
                    }}
                  />
                </label>
                {store?.logoUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStore((current) => (current ? { ...current, logoUrl: null } : current))
                    }
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                  >
                    <Trash2Icon className="h-3.5 w-3.5" />
                    Retirer le logo
                  </button>
                ) : null}
              </div>
              <button type="button" onClick={() =>
                setStore((current) => current ? { ...current, brandingEnabled: !current.brandingEnabled } : current)
              } className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm">
                Branding SellFlow : <span className="font-semibold text-slate-900">{store?.brandingEnabled ? 'Actif' : 'Désactivé'}</span>
              </button>
            </div>
            <button type="button" onClick={() => void saveStore()} disabled={saving} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              Enregistrer la boutique
            </button>
          </motion.div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Voir ma boutique</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-primary-600">{shopLink}</div>
              <button type="button" onClick={() => void copyShopLink()} className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                {copied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="mt-3 flex gap-3">
              <a href={shopLink} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600">Ouvrir la boutique</a>
              {(capabilities?.premiumPreviewEnabled || capabilities?.canCustomizeStore) && previewShopLink ? (
                <a href={previewShopLink} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">Ouvrir l'aperçu</a>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <WhatsAppIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">WhatsApp vendeur</p>
                <p className="text-xs text-slate-500">Numéro utilisé pour les messages</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input type="tel" value={whatsApp?.phoneNumber ?? ''} placeholder="Numéro WhatsApp" onChange={(event) =>
                setWhatsApp((current) => current ? { ...current, phoneNumber: event.target.value } : current)
              } className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              <input type="text" value={whatsApp?.displayName ?? ''} placeholder="Nom affiché" onChange={(event) =>
                setWhatsApp((current) => current ? { ...current, displayName: event.target.value } : current)
              } className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            </div>
            <button type="button" onClick={() => void saveWhatsApp()} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Enregistrer WhatsApp</button>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <CreditCardIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Moyens de paiement</p>
                <p className="text-xs text-slate-500">Orange, Airtel, Vodacom, Africell</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="rounded-xl bg-slate-50 px-4 py-3">
                  {editingPaymentMethodId === method.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <select value={editingPaymentMethod.network} onChange={(event) =>
                          setEditingPaymentMethod((current) => ({ ...current, network: event.target.value as PaymentNetwork }))
                        } className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                          {networks.map((network) => <option key={network} value={network}>{network}</option>)}
                        </select>
                        <input type="text" value={editingPaymentMethod.phoneNumber} onChange={(event) =>
                          setEditingPaymentMethod((current) => ({ ...current, phoneNumber: event.target.value }))
                        } placeholder="Numéro" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" />
                      </div>
                      <input type="text" value={editingPaymentMethod.displayName} onChange={(event) =>
                        setEditingPaymentMethod((current) => ({ ...current, displayName: event.target.value }))
                      } placeholder="Nom affiché" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" />
                      <button type="button" onClick={() =>
                        setEditingPaymentMethod((current) => ({ ...current, isActive: !current.isActive }))
                      } className={`rounded-xl px-3 py-2 text-xs font-semibold ${editingPaymentMethod.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                        {editingPaymentMethod.isActive ? 'Actif' : 'Inactif'}
                      </button>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => void savePaymentMethod()} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"><CheckIcon className="h-4 w-4" />Enregistrer</button>
                        <button type="button" onClick={cancelEditingPaymentMethod} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"><XIcon className="h-4 w-4" />Annuler</button>
                        <button type="button" onClick={() => void deletePaymentMethod(method.id)} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-600"><Trash2Icon className="h-4 w-4" />Supprimer</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{method.network} · {method.displayName}</p>
                        <p className="text-xs text-slate-500">{method.phoneNumber}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button type="button" onClick={() => void togglePaymentMethod(method)} className={`rounded-xl px-3 py-2 text-xs font-semibold ${method.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{method.isActive ? 'Actif' : 'Inactif'}</button>
                        <button type="button" onClick={() => startEditingPaymentMethod(method)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"><PencilIcon className="h-3.5 w-3.5" />Modifier</button>
                        <button type="button" onClick={() => void deletePaymentMethod(method.id)} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"><Trash2Icon className="h-3.5 w-3.5" />Supprimer</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <select value={newPaymentMethod.network} onChange={(event) =>
                setNewPaymentMethod((current) => ({ ...current, network: event.target.value as PaymentNetwork }))
              } className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                {networks.map((network) => <option key={network} value={network}>{network}</option>)}
              </select>
              <input type="text" value={newPaymentMethod.phoneNumber} placeholder="Numéro" onChange={(event) =>
                setNewPaymentMethod((current) => ({ ...current, phoneNumber: event.target.value }))
              } className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              <input type="text" value={newPaymentMethod.displayName} placeholder="Nom affiché" onChange={(event) =>
                setNewPaymentMethod((current) => ({ ...current, displayName: event.target.value }))
              } className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm sm:col-span-2" />
            </div>
            <button type="button" onClick={() => void addPaymentMethod()} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white"><PlusIcon className="h-4 w-4" />Ajouter un moyen de paiement</button>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TruckIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Zones de livraison</p>
                <p className="text-xs text-slate-500">Ajout, modification simple et prix par zone</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {deliveryZones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{zone.name}</p>
                      <p className="text-xs text-slate-500">{zone.price}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => void toggleDeliveryZone(zone)} className={`rounded-xl px-3 py-2 text-xs font-semibold ${zone.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {zone.isActive ? 'Actif' : 'Inactif'}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="text" value={newDeliveryZone.name} placeholder="Zone" onChange={(event) =>
                setNewDeliveryZone((current) => ({ ...current, name: event.target.value }))
              } className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              <input type="number" min="0" value={newDeliveryZone.price} placeholder="Prix" onChange={(event) =>
                setNewDeliveryZone((current) => ({ ...current, price: event.target.value }))
              } className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            </div>
            <button type="button" onClick={() => void addDeliveryZone()} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white"><PlusIcon className="h-4 w-4" />Ajouter une zone</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <SparklesIcon className="h-4 w-4 text-primary-500" />
              Premium à 1$ / mois
            </div>
            <div className="mt-4 space-y-3">
              {[
                'Couleurs de boutique personnalisables',
                'Logo vendeur actif',
                'Branding SellFlow désactivable',
                'Aperçu Premium contrôlé',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">{item}</div>
              ))}
            </div>
            <button type="button" onClick={onOpenUpgrade} className="mt-5 w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white">Passer au Premium</button>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <PaletteIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Personnalisation boutique</p>
                <p className="text-xs text-slate-500">Choisis les couleurs, ouvre l'aperçu, puis enregistre si tu passes Premium.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input type="color" value={theme?.primaryColor ?? '#10b981'} onChange={(event) =>
                setTheme((current) => current
                  ? { ...current, primaryColor: event.target.value }
                  : { primaryColor: event.target.value, accentColor: '#0f172a', visualPreset: 'default' })
              } className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50" />
              <input type="color" value={theme?.accentColor ?? '#0f172a'} onChange={(event) =>
                setTheme((current) => current
                  ? { ...current, accentColor: event.target.value }
                  : { primaryColor: '#10b981', accentColor: event.target.value, visualPreset: 'default' })
              } className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50" />
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <div className="px-4 py-4 text-white" style={{ backgroundColor: previewTheme.accentColor }}>
                  <p className="text-sm font-semibold">Aperçu de la boutique</p>
                  <p className="mt-1 text-xs text-white/80">Les couleurs choisies apparaissent ici avant enregistrement.</p>
                </div>
                <div className="space-y-3 p-4">
                  <div className="h-11 rounded-xl" style={{ backgroundColor: previewTheme.primaryColor }} />
                  <div className="h-11 rounded-xl border" style={{
                    backgroundColor: hexToRgba(previewTheme.primaryColor, 0.12),
                    borderColor: hexToRgba(previewTheme.primaryColor, 0.28),
                  }} />
                  <button type="button" disabled className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: previewTheme.accentColor }}>
                    Bouton boutique
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => void saveTheme()} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Enregistrer la personnalisation</button>
              <button type="button" onClick={() => void togglePreview()} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                {capabilities?.premiumPreviewEnabled ? "Couper l'aperçu Premium" : 'Tester le mode premium'}
              </button>
            </div>
          </div>

          <button type="button" onClick={onSignedOut} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50">
            <LogOutIcon className="h-5 w-5" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}


