import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBagIcon, XIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { publicRequest } from '../lib/api';
import { normalizeAmount } from '../lib/currency';
import { hexToRgba, resolveStorefrontTheme } from '../lib/theme';
import { Cart, CartFAB } from '../storefront/Cart';
import { CartProvider } from '../storefront/CartContext';
import { CategoryTabs } from '../storefront/CategoryTabs';
import { CheckoutSheet } from '../storefront/CheckoutSheet';
import { ProductDetail } from '../storefront/ProductDetail';
import { ProductGrid, type Product } from '../storefront/ProductGrid';
import { ShopHeader } from '../storefront/ShopHeader';
import { useCart } from '../storefront/useCart';
import type { ProductRecord, PublicStorePayload } from '../lib/types';

function StorefrontContent() {
  const [searchParams] = useSearchParams();
  const [storeData, setStoreData] = useState<PublicStorePayload | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(Boolean(searchParams.get('tracking')));
  const [trackingReference, setTrackingReference] = useState(searchParams.get('tracking') ?? '');
  const [trackingResult, setTrackingResult] = useState<{
    trackingReference: string;
    status: string;
    shipmentStatus: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, itemCount } = useCart();

  const slug = searchParams.get('slug') ?? 'boutique-amina';

  const handleTrackingLookup = useCallback(
    async (value = trackingReference) => {
      if (!value.trim()) {
        return;
      }

      try {
        const payload = await publicRequest<{
          trackingReference: string;
          status: string;
          shipmentStatus: string | null;
        }>(`/public/store/${slug}/orders/tracking/${value.trim()}`);
        setTrackingResult(payload);
        setTrackingOpen(true);
      } catch (requestError) {
        setTrackingResult(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Référence de suivi introuvable.',
        );
        setTrackingOpen(true);
      }
    },
    [slug, trackingReference],
  );

  const loadStorefront = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [storePayload, productsPayload] = await Promise.all([
        publicRequest<PublicStorePayload>(`/public/store/${slug}`),
        publicRequest<ProductRecord[]>(`/public/store/${slug}/products`),
      ]);
      setStoreData(storePayload);
      setProducts(productsPayload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de charger la boutique.',
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadStorefront();
  }, [loadStorefront]);

  useEffect(() => {
    const initialTracking = searchParams.get('tracking');
    if (initialTracking) {
      void handleTrackingLookup(initialTracking);
    }
  }, [handleTrackingLookup, searchParams]);

  const categories = useMemo(() => {
    const dynamicCategories = new Map<string, { id: string; label: string }>();
    products.forEach((product) => {
      if (product.category) {
        dynamicCategories.set(product.category.slug || product.category.id, {
          id: product.category.slug || product.category.id,
          label: product.category.name,
        });
      }
    });
    return [{ id: 'all', label: 'Tout' }, ...Array.from(dynamicCategories.values())];
  }, [products]);

  const storefrontTheme = useMemo(() => {
    const previewPrimaryColor = searchParams.get('previewPrimaryColor');
    const previewAccentColor = searchParams.get('previewAccentColor');

    return resolveStorefrontTheme(
      previewPrimaryColor ?? storeData?.store.theme?.primaryColor,
      previewAccentColor ?? storeData?.store.theme?.accentColor,
    );
  }, [searchParams, storeData?.store.theme?.accentColor, storeData?.store.theme?.primaryColor]);

  const handleCheckout = () => {
    setCartOpen(false);
    window.setTimeout(() => setCheckoutOpen(true), 250);
  };

  const handleDirectWhatsAppOrder = (product: Product, quantity: number) => {
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
    setSelectedProduct(null);
    setCartOpen(false);
    window.setTimeout(() => setCheckoutOpen(true), 250);
  };

  if (loading || !storeData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-slate-500">
        Chargement de la boutique...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-gray-50"
      style={{ backgroundColor: hexToRgba(storefrontTheme.primaryColor, 0.03) }}
    >
      <ShopHeader
        storeData={storeData}
        theme={storefrontTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTrackOpen={() => setTrackingOpen(true)}
      />

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        theme={storefrontTheme}
        onCategoryChange={setActiveCategory}
      />

      {error ? (
        <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <ProductGrid
        products={products as Product[]}
        category={activeCategory}
        searchQuery={searchQuery}
        currency={storeData.store.defaultCurrency}
        theme={storefrontTheme}
        onProductClick={setSelectedProduct}
      />

      {storeData.store.brandingEnabled ? (
        <div className="py-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-500"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded bg-primary-500">
              <ShoppingBagIcon className="h-2.5 w-2.5 text-white" />
            </div>
            Powered by SellFlow
          </a>
        </div>
      ) : null}

      <AnimatePresence>
        <CartFAB
          onClick={() => setCartOpen(true)}
          itemCount={itemCount}
          theme={storefrontTheme}
        />
      </AnimatePresence>

      <ProductDetail
        product={selectedProduct}
        currency={storeData.store.defaultCurrency}
        theme={storefrontTheme}
        onOrderNow={handleDirectWhatsAppOrder}
        onClose={() => setSelectedProduct(null)}
      />

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
        currency={storeData.store.defaultCurrency}
        theme={storefrontTheme}
      />

      <CheckoutSheet
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        storeSlug={slug}
        currency={storeData.store.defaultCurrency}
        paymentMethods={storeData.paymentMethods}
        deliveryZones={storeData.deliveryZones}
        theme={storefrontTheme}
      />

      <AnimatePresence>
        {trackingOpen ? (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/40" onClick={() => setTrackingOpen(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">Suivre une commande</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Entre la référence de suivi reçue après confirmation.
                  </p>
                </div>
                <button type="button" onClick={() => setTrackingOpen(false)}>
                  <XIcon className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={trackingReference}
                  onChange={(event) => setTrackingReference(event.target.value)}
                  placeholder="Ex: TRK-SLF-123456"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => void handleTrackingLookup()}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: storefrontTheme.accentColor }}
                >
                  Rechercher
                </button>
              </div>

              {trackingResult ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {trackingResult.trackingReference}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Statut commande: {trackingResult.status}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Statut livraison: {trackingResult.shipmentStatus ?? 'En attente'}
                  </p>
                </div>
              ) : null}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Storefront() {
  return (
    <CartProvider>
      <StorefrontContent />
    </CartProvider>
  );
}


