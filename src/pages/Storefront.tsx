import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from '../storefront/CartContext';
import { ShopHeader } from '../storefront/ShopHeader';
import { CategoryTabs } from '../storefront/CategoryTabs';
import { ProductGrid } from '../storefront/ProductGrid';
import { ProductDetail } from '../storefront/ProductDetail';
import { Cart, CartFAB } from '../storefront/Cart';
import { CheckoutSheet } from '../storefront/CheckoutSheet';
import { ShoppingBagIcon } from 'lucide-react';
import { useCart } from '../storefront/useCart';
import type { Product } from '../storefront/ProductGrid';
function StorefrontContent() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { itemCount } = useCart();
  const handleCheckout = () => {
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 300);
  };
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <ShopHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory} />
      
      <ProductGrid
        category={activeCategory}
        searchQuery={searchQuery}
        onProductClick={setSelectedProduct} />
      

      {/* Powered by SellFlow */}
      <div className="py-8 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-500 transition-colors">
          
          <div className="w-4 h-4 bg-primary-500 rounded flex items-center justify-center">
            <ShoppingBagIcon className="w-2.5 h-2.5 text-white" />
          </div>
          Powered by SellFlow
        </a>
      </div>

      {/* Cart FAB */}
      <AnimatePresence>
        <CartFAB onClick={() => setCartOpen(true)} itemCount={itemCount} />
      </AnimatePresence>

      {/* Modals */}
      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)} />
      
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout} />
      
      <CheckoutSheet
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)} />
      
    </div>);

}
export function Storefront() {
  return (
    <CartProvider>
      <StorefrontContent />
    </CartProvider>);

}
