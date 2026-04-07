import { motion } from 'framer-motion';
import { hexToRgba, type StorefrontThemePalette } from '../lib/theme';

interface CategoryTabsProps {
  categories: Array<{
    id: string;
    label: string;
  }>;
  activeCategory: string;
  theme: StorefrontThemePalette;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  theme,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-3xl">
        <div className="flex gap-1 overflow-x-auto px-4 py-3" style={{ scrollbarWidth: 'none' }}>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className="relative flex-shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              {activeCategory === category.id ? (
                <motion.div
                  layoutId="categoryTab"
                  className="absolute inset-0 rounded-xl border"
                  style={{
                    borderColor: hexToRgba(theme.primaryColor, 0.25),
                    backgroundColor: hexToRgba(theme.primaryColor, 0.12),
                  }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                />
              ) : null}
              <span
                className={`relative z-10 ${activeCategory === category.id ? '' : 'text-gray-500'}`}
                style={activeCategory === category.id ? { color: theme.primaryColor } : undefined}
              >
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
