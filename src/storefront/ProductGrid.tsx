import { motion } from 'framer-motion';
import { PackageIcon } from 'lucide-react';
import { formatCurrency, normalizeAmount } from '../lib/currency';
import type { StorefrontThemePalette } from '../lib/theme';
import { useCart } from './useCart';
import type { CurrencyCode, ProductRecord } from '../lib/types';

export interface Product extends ProductRecord {
  price: number | string;
}

interface ProductGridProps {
  products: Product[];
  category: string;
  searchQuery: string;
  currency: CurrencyCode;
  theme: StorefrontThemePalette;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({
  products,
  category,
  searchQuery,
  currency,
  theme,
  onProductClick,
}: ProductGridProps) {
  const { addItem } = useCart();
  const filtered = products.filter((product) => {
    const matchesCategory =
      category === 'all' || product.category?.slug === category || product.category?.id === category;
    const matchesSearch =
      !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!filtered.length) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <PackageIcon className="h-7 w-7 text-gray-300" />
        </div>
        <p className="font-medium text-gray-500">Aucun produit trouve</p>
        <p className="mt-1 text-sm text-gray-400">Essaie une autre recherche</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
        {filtered.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onProductClick(product)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              {product.images[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <PackageIcon className="h-10 w-10 text-slate-300" />
                </div>
              )}

              {product.status === 'OUT_OF_STOCK' ? (
                <span className="absolute left-3 top-3 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
                  Rupture
                </span>
              ) : null}
            </div>

            <div className="p-3">
              <h3 className="truncate text-sm font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm font-bold" style={{ color: theme.primaryColor }}>
                {formatCurrency(normalizeAmount(product.price), currency)}
              </p>
              <button
                type="button"
                disabled={product.status === 'OUT_OF_STOCK'}
                onClick={(event) => {
                  event.stopPropagation();
                  addItem(
                    {
                      id: product.id,
                      name: product.name,
                      price: normalizeAmount(product.price),
                      color: 'bg-slate-100',
                      icon: 'bag',
                    },
                    1,
                  );
                }}
                className={`mt-2.5 w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
                  product.status === 'OUT_OF_STOCK'
                    ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                    : 'text-white'
                }`}
                style={
                  product.status === 'OUT_OF_STOCK'
                    ? undefined
                    : { backgroundColor: theme.accentColor }
                }
              >
                {product.status === 'OUT_OF_STOCK' ? 'Rupture' : 'Ajouter'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
