import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ExternalLinkIcon,
  ImageIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  WalletCardsIcon,
  XIcon,
} from 'lucide-react';
import { apiRequest, getApiBaseUrl } from '../lib/api';
import { formatCurrency, normalizeAmount } from '../lib/currency';
import { freePlanProductLimit } from '../lib/plans';
import type {
  CategoryRecord,
  PaymentRecord,
  PlanCapabilities,
  ProductRecord,
  StoreRecord,
} from '../lib/types';

interface ProductsViewProps {
  store: StoreRecord | null;
  capabilities: PlanCapabilities | null;
  onChanged: () => Promise<void>;
  onOpenUpgrade: () => void;
}

interface ProductFormState {
  name: string;
  price: string;
  stock: string;
  referenceNumber: string;
  description: string;
  categoryId: string;
  newCategoryName: string;
  createCategory: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  imageUrls: string[];
}

const emptyForm: ProductFormState = {
  name: '',
  price: '',
  stock: '',
  referenceNumber: '',
  description: '',
  categoryId: '',
  newCategoryName: '',
  createCategory: false,
  status: 'PUBLISHED',
  imageUrls: [],
};

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Image invalide.'));
    reader.onerror = () => reject(new Error('Image invalide.'));
    reader.readAsDataURL(file);
  });
}

export function ProductsView({
  store,
  capabilities,
  onChanged,
  onOpenUpgrade,
}: ProductsViewProps) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsPayload, categoriesPayload, paymentsPayload] = await Promise.all([
        apiRequest<ProductRecord[]>('/products'),
        apiRequest<CategoryRecord[]>('/categories'),
        apiRequest<PaymentRecord[]>('/payments'),
      ]);
      setProducts(productsPayload);
      setCategories(categoriesPayload);
      setPayments(paymentsPayload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de charger le catalogue.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return products;
    }
    return products.filter((product) => {
      const categoryName = product.category?.name.toLowerCase() ?? '';
      return (
        product.name.toLowerCase().includes(query) ||
        product.referenceNumber.toLowerCase().includes(query) ||
        categoryName.includes(query)
      );
    });
  }, [products, searchQuery]);

  const canCreateProduct =
    capabilities?.currentPlan === 'PREMIUM' || products.length < freePlanProductLimit;

  const openCreateModal = () => {
    if (!canCreateProduct) {
      onOpenUpgrade();
      return;
    }
    setEditingProductId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '' });
    setModalOpen(true);
  };

  const openEditModal = (product: ProductRecord) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      price: String(normalizeAmount(product.price)),
      stock: String(product.stock),
      referenceNumber: product.referenceNumber,
      description: product.description ?? '',
      categoryId: product.category?.id ?? '',
      newCategoryName: '',
      createCategory: false,
      status: product.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
      imageUrls: product.images.map((image) => image.url),
    });
    setModalOpen(true);
  };

  const resetModal = () => {
    setEditingProductId(null);
    setForm(emptyForm);
    setModalOpen(false);
  };

  const handleImages = async (files: FileList | null) => {
    const nextFiles = Array.from(files ?? []);
    if (!nextFiles.length) {
      return;
    }
    const urls = await Promise.all(nextFiles.map((file) => readFile(file)));
    setForm((current) => ({
      ...current,
      imageUrls: [...current.imageUrls, ...urls],
    }));
  };

  const handleSave = async () => {
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      referenceNumber: form.referenceNumber.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      categoryId: form.createCategory ? undefined : form.categoryId || undefined,
      newCategoryName: form.createCategory ? form.newCategoryName.trim() : undefined,
      imageUrls: form.imageUrls,
    };

    if (
      !payload.name ||
      !payload.referenceNumber ||
      Number.isNaN(payload.price) ||
      Number.isNaN(payload.stock) ||
      (form.createCategory && !payload.newCategoryName)
    ) {
      setError('Completes les champs obligatoires du produit.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await apiRequest(editingProductId ? `/products/${editingProductId}` : '/products', {
        method: editingProductId ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      });
      await loadData();
      await onChanged();
      resetModal();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible d enregistrer le produit.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingProductId) {
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest(`/products/${editingProductId}`, { method: 'DELETE' });
      await loadData();
      await onChanged();
      resetModal();
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrashPayment = async (paymentId: string) => {
    await apiRequest(`/payments/${paymentId}`, { method: 'DELETE' });
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catalogue vendeur</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Ajoute des photos, choisis une categorie existante ou cree-en une
            nouvelle, puis fixe le prix dans la devise principale de ta boutique.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter un produit
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {capabilities?.currentPlan === 'PREMIUM' ? 'Plan Premium' : 'Plan Basique'}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {products.length}
              {capabilities?.currentPlan === 'PREMIUM'
                ? ' produits'
                : `/${freePlanProductLimit} produits`}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Devise boutique : {store?.defaultCurrency ?? 'USD'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={store ? `/shop?slug=${store.slug}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
                store
                  ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  : 'pointer-events-none bg-slate-200 text-slate-400'
              }`}
            >
              <ExternalLinkIcon className="h-4 w-4" />
              Voir ma boutique
            </a>
            <button
              type="button"
              onClick={() => setPaymentsOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-200"
            >
              <WalletCardsIcon className="h-4 w-4" />
              Voir tous les paiements
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Publiés</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {products.filter((product) => product.status !== 'DRAFT').length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Brouillons</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {products.filter((product) => product.status === 'DRAFT').length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Stock faible</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {products.filter((product) => product.stock <= 5).length}
            </p>
          </div>
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
              placeholder="Rechercher par produit, catégorie ou référence produit"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          {loading ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
              Chargement du catalogue...
            </div>
          ) : filteredProducts.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => openEditModal(product)}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                        {product.images[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PackageIcon className="h-6 w-6 text-slate-500" />
                        )}
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-slate-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {product.category?.name ?? 'Sans catégorie'} · {product.referenceNumber}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.status === 'OUT_OF_STOCK'
                          ? 'bg-red-50 text-red-700'
                          : product.status === 'DRAFT'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {product.status === 'OUT_OF_STOCK'
                        ? 'Rupture'
                        : product.status === 'DRAFT'
                          ? 'Brouillon'
                          : 'Publié'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    {product.description || 'Aucune description pour le moment.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(normalizeAmount(product.price), store?.defaultCurrency)}
                    </span>
                    <span className="text-sm text-slate-500">Stock {product.stock}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-900">Aucun produit trouve</p>
              <p className="mt-2 text-sm text-slate-500">
                Essaie un autre mot-cle ou ajoute un nouveau produit.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <SparklesIcon className="h-4 w-4 text-primary-500" />
            Premium pour le catalogue
          </div>
          <div className="mt-4 space-y-3">
            {[
              'Produits illimités',
              'Logo vendeur et personnalisation visuelle',
              'Suppression du branding SellFlow',
              'Aperçu Premium de la boutique',
            ].map((feature) => (
              <div key={feature} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                {feature}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenUpgrade}
            className="mt-5 w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Voir les options Premium
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen ? (
          <>
            <motion.div className="fixed inset-0 z-50 bg-slate-950/45" onClick={resetModal} />
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
                      {editingProductId ? 'Modifier le produit' : 'Ajouter un produit'}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Photos, catégorie, prix, stock et référence produit
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetModal}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                  >
                    <XIcon className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <label className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-slate-200 bg-slate-50 px-4 text-center">
                  <ImageIcon className="h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-700">Ajouter des photos</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => void handleImages(event.target.files)}
                  />
                </label>

                {form.imageUrls.length ? (
                  <div className="grid grid-cols-3 gap-3">
                    {form.imageUrls.map((imageUrl, index) => (
                      <div key={`${index}-${imageUrl.slice(0, 16)}`} className="relative rounded-2xl bg-slate-100">
                        <img src={imageUrl} alt="" className="h-24 w-full rounded-2xl object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              imageUrls: current.imageUrls.filter((_, imageIndex) => imageIndex !== index),
                            }))
                          }
                          className="absolute right-2 top-2 rounded-full bg-slate-950/70 p-1 text-white"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Nom du produit"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />
                  <input
                    type="text"
                    value={form.referenceNumber}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, referenceNumber: event.target.value }))
                    }
                    placeholder="Référence produit"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                    placeholder={`Prix (${store?.defaultCurrency ?? 'USD'})`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                    placeholder="Stock"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">Categorie</p>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          createCategory: !current.createCategory,
                          newCategoryName: '',
                        }))
                      }
                      className="text-xs font-semibold text-primary-600"
                    >
                      {form.createCategory ? 'Utiliser une catégorie existante' : 'Créer une catégorie'}
                    </button>
                  </div>
                  {form.createCategory ? (
                    <input
                      type="text"
                      value={form.newCategoryName}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, newCategoryName: event.target.value }))
                      }
                      placeholder="Nouvelle categorie"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                    />
                  ) : (
                    <select
                      value={form.categoryId}
                      onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                    >
                      <option value="">Sans catégorie</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Description du produit"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  {(['PUBLISHED', 'DRAFT'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, status }))}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                        form.status === status
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pb-4">
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={submitting}
                    className="w-full rounded-2xl bg-primary-500 py-4 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {submitting ? 'Enregistrement...' : editingProductId ? 'Enregistrer' : 'Ajouter'}
                  </button>
                  {editingProductId ? (
                    <button
                      type="button"
                      onClick={() => void handleDelete()}
                      disabled={submitting}
                      className="w-full rounded-2xl bg-red-50 py-4 text-sm font-semibold text-red-600 disabled:opacity-60"
                    >
                      Supprimer le produit
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {paymentsOpen ? (
          <>
            <motion.div className="fixed inset-0 z-50 bg-slate-950/45" onClick={() => setPaymentsOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-xl overflow-y-auto bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">Tous les paiements</p>
                  <p className="mt-1 text-sm text-slate-500">Consultation, detail et corbeille securisee.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                >
                  <XIcon className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-[1.5rem] border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {payment.order?.orderNumber ?? 'Paiement boutique'}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {payment.paymentMethod?.network ?? 'Sans réseau'} · {payment.status}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      {formatCurrency(normalizeAmount(payment.amount), store?.defaultCurrency)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {payment.proofs.map((proof) => (
                        <a
                          key={proof.id}
                          href={`${getApiBaseUrl().replace(/\/api$/, '')}${proof.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          Voir preuve
                        </a>
                      ))}
                      <button
                        type="button"
                        onClick={() => void handleTrashPayment(payment.id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                      >
                        Corbeille
                      </button>
                    </div>
                  </div>
                ))}
                {!payments.length ? (
                  <div className="rounded-[1.5rem] bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    Aucun paiement enregistre pour le moment.
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}



