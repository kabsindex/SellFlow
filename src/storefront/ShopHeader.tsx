import { motion } from 'framer-motion';
import { MapPinIcon, SearchIcon, XIcon } from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { hexToRgba, type StorefrontThemePalette } from '../lib/theme';
import type { PublicStorePayload } from '../lib/types';

interface ShopHeaderProps {
  storeData: PublicStorePayload;
  theme: StorefrontThemePalette;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTrackOpen: () => void;
}

export function ShopHeader({
  storeData,
  theme,
  searchQuery,
  onSearchChange,
  onTrackOpen,
}: ShopHeaderProps) {
  const initials = storeData.store.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const sellerPhone = storeData.whatsappConnection?.phoneNumber?.replace(/\D/g, '') ?? '';

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-3xl px-4 pb-4 pt-6">
        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl"
            style={{ backgroundColor: hexToRgba(theme.primaryColor, 0.14) }}
          >
            {storeData.store.logoUrl ? (
              <img
                src={storeData.store.logoUrl}
                alt={storeData.store.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                {initials}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-gray-900">{storeData.store.name}</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {storeData.store.description || 'Boutique conversationnelle mobile-first'}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <MapPinIcon className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">
                Boutique en ligne · {storeData.productsCount} produits
              </span>
            </div>
          </div>

          {sellerPhone ? (
            <a
              href={`https://wa.me/${sellerPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-600"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{storeData.productsCount} produits</span>
          <button
            type="button"
            onClick={onTrackOpen}
            className="font-semibold transition-colors"
            style={{ color: theme.primaryColor }}
          >
            Suivre une commande
          </button>
        </div>

        <motion.div className="mt-4" initial={false}>
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              style={{
                borderColor: searchQuery ? hexToRgba(theme.primaryColor, 0.35) : undefined,
                boxShadow: searchQuery
                  ? `0 0 0 2px ${hexToRgba(theme.primaryColor, 0.12)}`
                  : undefined,
              }}
            />

            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
