import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShirtIcon,
  ShoppingBagIcon,
  GemIcon,
  FootprintsIcon,
  SparklesIcon,
  WatchIcon,
  ArrowRightIcon } from
'lucide-react';
import { formatUsd } from '../lib/currency';
import { useCart } from './useCart';
function getIcon(icon: string) {
  switch (icon) {
    case 'shirt':
      return ShirtIcon;
    case 'bag':
      return ShoppingBagIcon;
    case 'gem':
      return GemIcon;
    case 'footprints':
      return FootprintsIcon;
    case 'sparkles':
      return SparklesIcon;
    case 'watch':
      return WatchIcon;
    default:
      return ShoppingBagIcon;
  }
}
interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}
export function CartFAB({
  onClick,
  itemCount



}: {onClick: () => void;itemCount: number;}) {
  if (itemCount === 0) return null;
  return (
    <motion.button
      initial={{
        scale: 0,
        opacity: 0
      }}
      animate={{
        scale: 1,
        opacity: 1
      }}
      exit={{
        scale: 0,
        opacity: 0
      }}
      whileTap={{
        scale: 0.9
      }}
      onClick={onClick}
      className="fixed bottom-6 right-4 z-40 w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-xl flex items-center justify-center">
      
      <ShoppingCartIcon className="w-6 h-6" />
      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {itemCount}
      </span>
    </motion.button>);

}
export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-50" />
        
          <motion.div
          initial={{
            y: '100%'
          }}
          animate={{
            y: 0
          }}
          exit={{
            y: '100%'
          }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 300
          }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
          
            <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100 rounded-t-3xl">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Panier{' '}
                  <span className="text-gray-400 font-normal text-sm">
                    ({itemCount})
                  </span>
                </h2>
                <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {items.length === 0 ?
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <ShoppingCartIcon className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Ton panier est vide</p>
                <p className="text-sm text-gray-400 mt-1">
                  Ajoute des produits pour commencer
                </p>
                <button
              onClick={onClose}
              className="mt-6 text-sm font-semibold text-primary-600 hover:text-primary-700">
              
                  Continuer mes achats
                </button>
              </div> :

          <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {items.map((item) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <motion.div
                    key={`${item.id}-${item.size || 'default'}`}
                    layout
                    initial={{
                      opacity: 0,
                      x: -20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: 20
                    }}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    
                        <div
                      className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      
                          <IconComponent className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>
                          {item.size &&
                      <p className="text-xs text-gray-400">
                              Taille : {item.size}
                            </p>
                      }
                          <p className="text-sm font-bold text-primary-600 mt-0.5">
                            {formatUsd(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                        onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1,
                          item.size
                        )
                        }
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300">
                        
                            <MinusIcon className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold text-gray-900 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                        onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1,
                          item.size
                        )
                        }
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300">
                        
                            <PlusIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="p-1.5 text-gray-300 hover:text-red-400 transition-colors">
                      
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </motion.div>);

              })}
                </div>

                <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Sous-total</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatUsd(total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Livraison</span>
                    <span className="text-sm text-gray-400">
                      Calculée à la commande
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-bold text-primary-600">
                      {formatUsd(total)}
                    </span>
                  </div>
                  <motion.button
                whileTap={{
                  scale: 0.97
                }}
                onClick={onCheckout}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl text-base transition-colors shadow-sm">
                
                    Commander via WhatsApp
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </>
          }
          </motion.div>
        </>
      }
    </AnimatePresence>);

}
