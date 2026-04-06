import { useState, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  ShirtIcon,
  ShoppingBagIcon,
  GemIcon,
  FootprintsIcon,
  SparklesIcon,
  WatchIcon } from
'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { formatUsd } from '../lib/currency';
import { useCart } from './useCart';
import type { Product } from './ProductGrid';
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
interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}
export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined
  );
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: product.color,
        icon: product.icon
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      setQuantity(1);
      setSelectedSize(undefined);
    }, 800);
  };
  return (
    <AnimatePresence>
      {product &&
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
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
          
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="w-10 h-1 bg-gray-200 rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
              <h2 className="text-lg font-bold text-gray-900 mt-2">
                {product.name}
              </h2>
              <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
              
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div
            className={`${product.color} aspect-[4/3] flex items-center justify-center relative`}>
            
              <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
            
              {createElement(getIcon(product.icon), {
              className: `w-20 h-20 ${product.iconColor}`
            })}
            </div>

            <div className="px-4 py-5 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-primary-600">
                    {formatUsd(product.price)}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.sizes && product.sizes.length > 0 &&
            <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Taille
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) =>
                <button
                  key={size}
                  onClick={() =>
                  setSelectedSize(
                    size === selectedSize ? undefined : size
                  )
                  }
                  className={`min-w-[44px] h-10 px-3 rounded-xl text-sm font-medium border-2 transition-all ${selectedSize === size ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  
                        {size}
                      </button>
                )}
                  </div>
                </div>
            }

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Quantité
                </p>
                <div className="flex items-center gap-3">
                  <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-300 transition-colors">
                  
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-gray-900 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-300 transition-colors">
                  
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400 ml-2">
                    Total :{' '}
                    <span className="font-semibold text-gray-700">
                      {formatUsd(product.price * quantity)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-3 pb-4">
                <motion.button
                onClick={handleAdd}
                whileTap={{
                  scale: 0.97
                }}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-base transition-all ${added ? 'bg-primary-500 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
                
                  <ShoppingCartIcon className="w-5 h-5" />
                  {added ? 'Ajouté ✓' : 'Ajouter au panier'}
                </motion.button>
                <a
                href="#"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl text-base transition-colors">
                
                  <WhatsAppIcon className="w-5 h-5" />
                  Commander via WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}
