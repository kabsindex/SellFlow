import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightIcon,
  ImageIcon,
  LockIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  StoreIcon,
  XIcon,
} from 'lucide-react';
import { formatUsd } from '../lib/currency';
import { freePlanProductLimit } from '../lib/plans';

type ProductStatus = 'Publie' | 'Brouillon';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: ProductStatus;
  description: string;
}

interface ProductForm {
  name: string;
  category: string;
  price: string;
  stock: string;
  sku: string;
  status: ProductStatus;
  description: string;
}

const categories = ['Mode', 'Accessoires', 'Bijoux', 'Chaussures', 'Autre'];

const initialProducts: Product[] = [
  {
    id: 'robe-ankara',
    name: 'Robe Ankara',
    category: 'Mode',
    price: 24,
    stock: 12,
    sku: 'ANK-ROBE-01',
    status: 'Publie',
    description: 'Robe midi en tissu Ankara pour les commandes quotidiennes.',
  },
  {
    id: 'sac-cuir',
    name: 'Sac en cuir',
    category: 'Accessoires',
    price: 39,
    stock: 5,
    sku: 'SAC-CUIR-02',
    status: 'Publie',
    description: 'Sac a main structure avec finition cuir et doublure textile.',
  },
  {
    id: 'bijoux-dores',
    name: 'Bijoux dores',
    category: 'Bijoux',
    price: 12,
    stock: 18,
    sku: 'BIJ-OR-03',
    status: 'Brouillon',
    description: 'Set leger pour upsell et packs cadeaux.',
  },
];

const emptyForm: ProductForm = {
  name: '',
  category: categories[0],
  price: '',
  stock: '',
  sku: '',
  status: 'Publie',
  description: '',
};

const premiumFeatures = [
  'Produits illimites',
  'Variantes taille et couleur',
  'Collections mises en avant',
  'Suppression du branding SellFlow',
];

export function ProductsView() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    );
  });

  const publishedCount = products.filter(
    (product) => product.status === 'Publie'
  ).length;
  const draftCount = products.filter(
    (product) => product.status === 'Brouillon'
  ).length;
  const lowStockCount = products.filter((product) => product.stock <= 5).length;
  const canCreateProduct = products.length < freePlanProductLimit;
  const isEditing = Boolean(editingId);

  const openCreateModal = () => {
    if (!canCreateProduct) {
      return;
    }

    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      sku: product.sku,
      status: product.status,
      description: product.description,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = () => {
    const nextPrice = Number(form.price);
    const nextStock = Number(form.stock);

    if (!form.name.trim() || Number.isNaN(nextPrice) || Number.isNaN(nextStock)) {
      return;
    }

    if (!isEditing && !canCreateProduct) {
      return;
    }

    if (editingId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: form.name.trim(),
                category: form.category,
                price: nextPrice,
                stock: nextStock,
                sku: form.sku.trim() || product.sku,
                status: form.status,
                description: form.description.trim(),
              }
            : product
        )
      );
    } else {
      setProducts((current) => [
        {
          id: `${form.name.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          name: form.name.trim(),
          category: form.category,
          price: nextPrice,
          stock: nextStock,
          sku: form.sku.trim() || `SKU-${current.length + 1}`,
          status: form.status,
          description: form.description.trim(),
        },
        ...current,
      ]);
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!editingId) {
      return;
    }

    setProducts((current) =>
      current.filter((product) => product.id !== editingId)
    );
    closeModal();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Catalogue vendeur
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Ajoute tes produits, fixe tes prix, gere le stock et decide ce qui
            doit etre publie ou garde en brouillon.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={!canCreateProduct}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
            canCreateProduct
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'cursor-not-allowed bg-slate-200 text-slate-400'
          }`}
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter un produit
        </button>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
          >
            <div className="bg-[linear-gradient(135deg,#0f172a_0%,#111827_40%,#14532d_100%)] p-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Plan Basique
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {products.length}/{freePlanProductLimit} produits crees
                  </h2>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  Free
                </div>
              </div>

              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-emerald-400"
                  style={{
                    width: `${(products.length / freePlanProductLimit) * 100}%`,
                  }}
                />
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200">
                Le plan gratuit permet de publier jusqu a 5 produits, gerer les
                prix, le stock et le statut. Premium retire cette limite et
                ajoute des outils catalogue plus avances.
              </p>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Publies
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {publishedCount}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Brouillons
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {draftCount}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Stock faible
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {lowStockCount}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative"
          >
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher par produit, categorie ou SKU"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            />
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.map((product, index) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                onClick={() => openEditModal(product)}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <PackageIcon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.category} · {product.sku}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.status === 'Publie'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {product.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Prix
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {formatUsd(product.price)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Stock
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {product.stock}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-900">
                Aucun produit trouve
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Essaie un autre mot-cle ou ajoute un nouveau produit.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <StoreIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Conseils catalogue
                </p>
                <p className="text-xs text-slate-500">
                  Ce qui aide a mieux vendre
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Garde un prix simple et un stock fiable pour rassurer les
                acheteurs.
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Mets en avant 3 produits forts avant d elargir le catalogue.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <SparklesIcon className="h-4 w-4 text-primary-500" />
              Premium pour le catalogue
            </div>

            <div className="mt-4 space-y-3">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700"
                >
                  <LockIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600">
              Passer au Premium
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>

      <button
        onClick={openCreateModal}
        disabled={!canCreateProduct}
        className={`fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg lg:hidden ${
          canCreateProduct
            ? 'bg-primary-500 text-white shadow-primary-500/25'
            : 'bg-slate-300 text-slate-500 shadow-slate-300/30'
        }`}
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/45"
              onClick={closeModal}
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
                      {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Nom, prix, stock et publication
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                  >
                    <XIcon className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex aspect-video items-center justify-center rounded-[1.75rem] border-2 border-dashed border-slate-200 bg-slate-50">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm text-slate-500">
                      Zone image de presentation
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Nom du produit
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Ex: Robe Ankara"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Prix
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          price: event.target.value,
                        }))
                      }
                      placeholder="24"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          stock: event.target.value,
                        }))
                      }
                      placeholder="10"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Categorie
                    </label>
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          sku: event.target.value,
                        }))
                      }
                      placeholder="SKU-001"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Statut
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(['Publie', 'Brouillon'] as ProductStatus[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              status,
                            }))
                          }
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                            form.status === status
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Ce qu il faut savoir sur le produit"
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-3 pb-4 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full rounded-2xl bg-primary-500 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    {isEditing ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full rounded-2xl bg-red-50 py-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                    >
                      Supprimer le produit
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
