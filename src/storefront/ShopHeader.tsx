import { motion } from 'framer-motion';
import {
  SearchIcon,
  StarIcon,
  MapPinIcon,
  XIcon } from
'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
interface ShopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
export function ShopHeader({ searchQuery, onSearchChange }: ShopHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-primary-600">BA</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Boutique Amina</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Mode africaine & accessoires
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">Dakar, Sénégal</span>
            </div>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors flex-shrink-0 shadow-sm">
            
            <WhatsAppIcon className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="font-medium text-gray-700">32 produits</span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1">
              <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              4.8
            </span>
            <span className="text-gray-300">·</span>
            <span>156 avis</span>
          </div>
        </div>

        <motion.div className="mt-4" initial={false}>
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all" />
            
            {searchQuery &&
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600">
              
                <XIcon className="w-4 h-4" />
              </button>
            }
          </div>
        </motion.div>
      </div>
    </header>);

}
