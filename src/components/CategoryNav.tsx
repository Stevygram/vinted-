import React from 'react';
import { Category, Condition } from '../types';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'popular';
  onSelectSort: (sort: 'relevance' | 'price_asc' | 'price_desc' | 'popular') => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'Tout explorer', value: 'all' },
  { label: 'Femmes', value: 'Femmes' },
  { label: 'Hommes', value: 'Hommes' },
  { label: 'Luxe & Vintage', value: 'Luxe & Vintage' },
  { label: 'Streetwear', value: 'Streetwear' },
  { label: 'Tech & Audio', value: 'Tech' },
  { label: 'Enfants', value: 'Enfants' },
  { label: 'Maison', value: 'Maison' },
];

const CONDITIONS: { label: string; value: string }[] = [
  { label: 'Tous les états', value: 'all' },
  { label: 'Neuf avec étiquette', value: 'Neuf avec étiquette' },
  { label: 'Très bon état', value: 'Très bon état' },
  { label: 'Bon état', value: 'Bon état' },
];

const SIZES = ['Toutes', 'XS', 'S', 'M', 'L', 'XL', '42.5 EU', '36 FR', '38', 'Unique'];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedCondition,
  onSelectCondition,
  selectedSize,
  onSelectSize,
  sortBy,
  onSelectSort,
  maxPrice,
  setMaxPrice,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="border-b border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/40 backdrop-blur-sm sticky top-[73px] z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Horizontal Category Segmented Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtres :</span>
            </div>

            {/* Condition select */}
            <select
              value={selectedCondition}
              onChange={(e) => onSelectCondition(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 border-none rounded-lg px-2.5 py-1 text-stone-800 dark:text-stone-200 font-medium cursor-pointer focus:ring-1 focus:ring-emerald-500"
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Size select */}
            <select
              value={selectedSize}
              onChange={(e) => onSelectSize(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 border-none rounded-lg px-2.5 py-1 text-stone-800 dark:text-stone-200 font-medium cursor-pointer focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Toutes tailles</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  Taille: {s}
                </option>
              ))}
            </select>

            {/* Max price slider */}
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-lg px-2.5 py-1">
              <span className="text-stone-500 dark:text-stone-400">Prix max :</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{maxPrice} €</span>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value as any)}
              className="bg-transparent font-medium text-stone-700 dark:text-stone-300 border-none cursor-pointer focus:outline-none"
            >
              <option value="relevance" className="dark:bg-stone-900">Pertinence</option>
              <option value="popular" className="dark:bg-stone-900">Plus populaires</option>
              <option value="price_asc" className="dark:bg-stone-900">Prix croissant</option>
              <option value="price_desc" className="dark:bg-stone-900">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
