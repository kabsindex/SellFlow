import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
} from 'lucide-react';
import { formatCurrency } from '../lib/currency';
import type { StorefrontThemePalette } from '../lib/theme';
import type { CurrencyCode } from '../lib/types';
import { useCart } from './useCart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  currency: CurrencyCode;
  theme: StorefrontThemePalette;
}

export function CartFAB({
  onClick,
  itemCount,
  theme,
}: {
  onClick: () => void;
  itemCount: number;
  theme: StorefrontThemePalette;
}) {
  if (!itemCount) {
    return null;
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl"
      style={{ backgroundColor: theme.accentColor }}
    >
      <ShoppingCartIcon className="h-6 w-6" />
      <span
        className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: theme.primaryColor }}
      >
        {itemCount}
      </span>
    </motion.button>
  );
}

export function Cart({ isOpen, onClose, onCheckout, currency, theme }: CartProps) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen ? (
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
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-white"
          >
            <div className="sticky top-0 z-10 rounded-t-3xl border-b border-gray-100 bg-white px-4 py-3">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Panier <span className="text-sm font-normal text-gray-400">({itemCount})</span>
                </h2>
                <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500">
                  Fermer
                </button>
              </div>
            </div>

            {items.length ? (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size || 'default'}`}
                      layout
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                        {item.size ? (
                          <p className="text-xs text-gray-400">Option: {item.size}</p>
                        ) : null}
                        <p className="mt-0.5 text-sm font-bold" style={{ color: theme.primaryColor }}>
                          {formatCurrency(item.price, currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        className="p-1.5 text-gray-300 transition-colors hover:text-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-100 bg-white px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Sous-total</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(total, currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-base font-bold" style={{ color: theme.primaryColor }}>
                      {formatCurrency(total, currency)}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onCheckout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-sm transition-colors"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    Commander
                    <ArrowRightIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <ShoppingCartIcon className="h-7 w-7 text-gray-300" />
                </div>
                <p className="font-medium text-gray-500">Ton panier est vide</p>
              </div>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
