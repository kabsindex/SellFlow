import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
const categories = [
{
  id: 'all',
  label: 'Tout'
},
{
  id: 'vetements',
  label: 'Vêtements'
},
{
  id: 'accessoires',
  label: 'Accessoires'
},
{
  id: 'chaussures',
  label: 'Chaussures'
},
{
  id: 'sacs',
  label: 'Sacs'
}];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}
export function CategoryTabs({
  activeCategory,
  onCategoryChange
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const button = activeRef.current;
      const scrollLeft =
      button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
          
          {categories.map((cat) =>
          <button
            key={cat.id}
            ref={activeCategory === cat.id ? activeRef : undefined}
            onClick={() => onCategoryChange(cat.id)}
            className="relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            
              {activeCategory === cat.id &&
            <motion.div
              layoutId="categoryTab"
              className="absolute inset-0 bg-primary-50 border border-primary-200 rounded-xl"
              transition={{
                type: 'spring',
                bounce: 0.15,
                duration: 0.4
              }} />

            }
              <span
              className={`relative z-10 ${activeCategory === cat.id ? 'text-primary-700' : 'text-gray-500'}`}>
              
                {cat.label}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>);

}
