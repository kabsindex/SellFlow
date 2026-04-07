import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MinusIcon, PackageIcon, PlusIcon, ShoppingCartIcon, XIcon } from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { formatCurrency, normalizeAmount } from '../lib/currency';
import type { StorefrontThemePalette } from '../lib/theme';
import { useCart } from './useCart';
import type { CurrencyCode } from '../lib/types';
import type { Product } from './ProductGrid';

interface ProductDetailProps {
  product: Product | null;
  currency: CurrencyCode;
  theme: StorefrontThemePalette;
  onOrderNow: (product: Product, quantity: number) => void;
  onClose: () => void;
}

export function ProductDetail({
  product,
  currency,
  theme,
  onOrderNow,
  onClose,
}: ProductDetailProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
  }, [product?.id]);

  const handleAdd = () => {
    if (!product) {
      return;
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        price: normalizeAmount(product.price),
        color: 'bg-slate-100',
        icon: 'bag',
      },
      quantity,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  };

  const handleOrderNow = () => {
    if (!product) {
      return;
    }

    onOrderNow(product, quantity);
  };

  return (
    <AnimatePresence>
      {product ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-50 bg-white px-4 py-3">
              <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-200" />
              <h2 className="mt-2 text-lg font-bold text-gray-900">{product.name}</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-[4/3] bg-slate-100">
              {product.images[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <PackageIcon className="h-20 w-20 text-slate-300" />
                </div>
              )}
            </div>

            <div className="space-y-5 px-4 py-5">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <p className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                    {formatCurrency(normalizeAmount(product.price), currency)}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {product.description || 'Description produit bientot disponible.'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-900">Quantite</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-lg font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                  <span className="ml-2 text-sm text-gray-400">
                    Total :{' '}
                    <span className="font-semibold text-gray-700">
                      {formatCurrency(normalizeAmount(product.price) * quantity, currency)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-3 pb-4">
                <motion.button
                  type="button"
                  onClick={handleAdd}
                  whileTap={{ scale: 0.97 }}
                  disabled={product.status === 'OUT_OF_STOCK'}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold transition-all ${
                    product.status === 'OUT_OF_STOCK'
                      ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                      : 'text-white'
                  }`}
                  style={
                    product.status === 'OUT_OF_STOCK'
                      ? undefined
                      : { backgroundColor: added ? theme.primaryColor : theme.accentColor }
                  }
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {product.status === 'OUT_OF_STOCK'
                    ? 'Produit en rupture'
                    : added
                      ? 'Ajoute au panier'
                      : 'Ajouter au panier'}
                </motion.button>

                <button
                  type="button"
                  onClick={handleOrderNow}
                  disabled={product.status === 'OUT_OF_STOCK'}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold transition-colors ${
                    product.status === 'OUT_OF_STOCK'
                      ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                      : 'text-white'
                  }`}
                  style={
                    product.status === 'OUT_OF_STOCK'
                      ? undefined
                      : { backgroundColor: theme.primaryColor }
                  }
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Commander via WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
