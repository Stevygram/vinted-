import React from 'react';
import { Article } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShieldCheck, Zap } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { favorites, toggleFavorite, setSelectedArticle, openModal } = useApp();

  const isFavorite = favorites.includes(article.id);

  const handleCardClick = () => {
    setSelectedArticle(article);
    openModal('article');
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(article.id);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-stone-200/50 dark:hover:shadow-stone-950/50 transition-all duration-300"
    >
      {/* Seller Header: Clean typographic metadata without pills */}
      <div className="flex items-center justify-between p-3 border-b border-stone-100 dark:border-stone-800/60">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={article.seller.avatar}
            alt={article.seller.name}
            className="w-6 h-6 rounded-full object-cover shrink-0"
          />
          <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 truncate">
            <span className="font-semibold text-stone-900 dark:text-stone-100 truncate">
              {article.seller.name}
            </span>
            <span className="text-stone-300 dark:text-stone-600">·</span>
            <span className="text-amber-500 font-bold shrink-0">★ {article.seller.rating}</span>
            <span className="text-stone-400 text-[11px] shrink-0">({article.seller.reviewCount})</span>
          </div>
        </div>
        {article.seller.fastShipper && (
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 shrink-0" title="Expédie en moins de 24h">
            <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
            <span className="hidden sm:inline">Envoi 24h</span>
          </span>
        )}
      </div>

      {/* Image Showcase */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={article.images[0]}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-stone-700 dark:text-stone-200 hover:scale-110 active:scale-95 transition-all shadow-sm"
          title="Ajouter aux favoris"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? 'fill-rose-500 text-rose-500'
                : 'text-stone-600 dark:text-stone-300 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Subtle price tag overlay on image */}
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-stone-950/75 backdrop-blur-md text-white text-xs font-bold tracking-tight">
          {article.price.toFixed(2)} €
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wide truncate">
              {article.brand}
            </h3>
            {article.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {article.originalPrice} €
              </span>
            )}
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-0.5">
            {article.title}
          </p>

          {/* Clean unboxed metadata with dot separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-2">
            <span className="font-medium text-stone-700 dark:text-stone-300">{article.size}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{article.condition}</span>
          </div>
        </div>

        {/* Protection acheteur guarantee badge info */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Séquestre garanti</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-stone-400" />
            <span>{article.likes}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
