import type { SVGProps } from 'react';
import { motion } from 'framer-motion';
import {
  ShirtIcon,
  WatchIcon,
  FootprintsIcon,
  ShoppingBagIcon,
  SparklesIcon,
  GemIcon } from
'lucide-react';
import { formatUsd } from '../lib/currency';
import { useCart } from './useCart';
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string;
  iconColor: string;
  icon: string;
  description: string;
  sizes?: string[];
}
const products: Product[] = [
{
  id: '1',
  name: 'Robe Ankara',
  price: 24,
  category: 'vetements',
  color: 'bg-rose-50',
  iconColor: 'text-rose-400',
  icon: 'shirt',
  description:
  'Magnifique robe en tissu Ankara, coupe moderne et élégante. Parfaite pour toutes les occasions.',
  sizes: ['S', 'M', 'L', 'XL']
},
{
  id: '2',
  name: 'Sac en cuir tressé',
  price: 39,
  category: 'sacs',
  color: 'bg-amber-50',
  iconColor: 'text-amber-400',
  icon: 'bag',
  description:
  'Sac en cuir véritable tressé à la main. Design unique et artisanal.'
},
{
  id: '3',
  name: 'Bijoux dorés',
  price: 12,
  category: 'accessoires',
  color: 'bg-yellow-50',
  iconColor: 'text-yellow-500',
  icon: 'gem',
  description:
  'Ensemble de bijoux dorés comprenant collier et bracelet. Finition premium.'
},
{
  id: '4',
  name: 'Sneakers Urban',
  price: 55,
  category: 'chaussures',
  color: 'bg-slate-50',
  iconColor: 'text-slate-400',
  icon: 'footprints',
  description:
  'Sneakers confortables au design urbain. Semelle souple et résistante.',
  sizes: ['38', '39', '40', '41', '42', '43']
},
{
  id: '5',
  name: 'Robe Wax',
  price: 29,
  category: 'vetements',
  color: 'bg-orange-50',
  iconColor: 'text-orange-400',
  icon: 'shirt',
  description:
  'Robe en tissu Wax authentique. Coupe flatteuse et couleurs vibrantes.',
  sizes: ['S', 'M', 'L', 'XL']
},
{
  id: '6',
  name: 'Bracelet perles',
  price: 8,
  category: 'accessoires',
  color: 'bg-purple-50',
  iconColor: 'text-purple-400',
  icon: 'sparkles',
  description:
  'Bracelet artisanal en perles naturelles. Chaque pièce est unique.'
},
{
  id: '7',
  name: 'Chemise Bazin',
  price: 34,
  category: 'vetements',
  color: 'bg-sky-50',
  iconColor: 'text-sky-400',
  icon: 'shirt',
  description:
  'Chemise en Bazin riche brodé. Coupe traditionnelle revisitée.',
  sizes: ['S', 'M', 'L', 'XL', 'XXL']
},
{
  id: '8',
  name: 'Sandales cuir',
  price: 19,
  category: 'chaussures',
  color: 'bg-teal-50',
  iconColor: 'text-teal-400',
  icon: 'footprints',
  description:
  'Sandales en cuir souple fabriquées artisanalement. Confort garanti.',
  sizes: ['37', '38', '39', '40', '41', '42']
},
{
  id: '9',
  name: "Boucles d'oreilles",
  price: 10,
  category: 'accessoires',
  color: 'bg-pink-50',
  iconColor: 'text-pink-400',
  icon: 'gem',
  description:
  "Boucles d'oreilles pendantes en métal doré. Design moderne et léger."
},
{
  id: '10',
  name: 'Ensemble Boubou',
  price: 72,
  category: 'vetements',
  color: 'bg-emerald-50',
  iconColor: 'text-emerald-400',
  icon: 'shirt',
  description:
  'Ensemble Boubou complet en tissu premium. Broderie fine et élégante.',
  sizes: ['M', 'L', 'XL', 'XXL']
},
{
  id: '11',
  name: 'Sac bandoulière',
  price: 24,
  category: 'sacs',
  color: 'bg-stone-50',
  iconColor: 'text-stone-400',
  icon: 'bag',
  description:
  'Sac bandoulière pratique et élégant. Plusieurs compartiments.'
},
{
  id: '12',
  name: 'Foulard soie',
  price: 14,
  category: 'accessoires',
  color: 'bg-violet-50',
  iconColor: 'text-violet-400',
  icon: 'sparkles',
  description: 'Foulard en soie imprimée. Motifs africains contemporains.'
}];

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
interface ProductGridProps {
  category: string;
  searchQuery: string;
  onProductClick: (product: Product) => void;
}
export function ProductGrid({
  category,
  searchQuery,
  onProductClick
}: ProductGridProps) {
  const { addItem } = useCart();
  const filtered = products.filter((p) => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch =
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <SearchIcon className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">Aucun produit trouvé</p>
        <p className="text-sm text-gray-400 mt-1">
          Essayez une autre recherche
        </p>
      </div>);

  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((product, i) => {
          const IconComponent = getIcon(product.icon);
          return (
            <motion.div
              key={product.id}
              initial={{
                opacity: 0,
                y: 12
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.04
              }}
              whileTap={{
                scale: 0.97
              }}
              onClick={() => onProductClick(product)}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
              
              <div
                className={`${product.color} aspect-square flex items-center justify-center relative overflow-hidden`}>
                
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                    'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                
                <IconComponent
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${product.iconColor} transition-transform group-hover:scale-110`} />
                
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-primary-600 mt-1">
                  {formatUsd(product.price)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      color: product.color,
                      icon: product.icon
                    });
                  }}
                  className="w-full mt-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                  
                  Ajouter
                </button>
              </div>
            </motion.div>);

        })}
      </div>
    </div>);

}
function SearchIcon(
props: SVGProps<SVGSVGElement> & {
  className?: string;
})
{
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>);

}
