import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Search,
  Loader2,
  Tag,
  ArrowRight,
  Lightbulb,
  Heart,
} from 'lucide-react';
import { Article } from '../types';

const STYLE_VIBES = [
  'Streetwear vintage 90s',
  'Minimalisme chic',
  'Bohème rétro',
  'Quiet Luxury & Cachemire',
  'Gorpcore & Outdoor tech',
  'Soirée & Cérémonie',
];

interface AiStylistModalProps {
  onApplySearchQuery: (query: string) => void;
}

export const AiStylistModal: React.FC<AiStylistModalProps> = ({ onApplySearchQuery }) => {
  const { closeModal, articles, setSelectedArticle, openModal } = useApp();

  const [selectedVibe, setSelectedVibe] = useState(STYLE_VIBES[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [budget, setBudget] = useState('150');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<{
    summary?: string;
    curatedTags?: string[];
    styleTip?: string;
    suggestedQueries?: string[];
  } | null>(null);

  const handleGenerateRecommendations = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userVibe: customPrompt || selectedVibe,
          budget: `${budget} €`,
          category: 'mode seconde main premium',
        }),
      });
      const data = await res.json();
      setRecommendations(data);
    } catch {
      setRecommendations({
        summary: 'Look sélectionné pour allier pièces intemporelles de seconde main et confort.',
        curatedTags: ['Carhartt Vintage', 'Sézane Mohair', 'Laine Mérinos', 'Denim Brut'],
        styleTip: 'Associez une pièce workwear robuste avec une maille délicate pour un contraste élégant.',
        suggestedQueries: ['Veste Carhartt', 'Cardigan Sézane', 'Salomon XT-6'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyQuery = (q: string) => {
    onApplySearchQuery(q);
    closeModal();
  };

  const handleOpenArticle = (art: Article) => {
    setSelectedArticle(art);
    openModal('article');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900 dark:text-white">
                Styliste Personnel & Recommandations IA
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Propulsé par Google Gemini pour dénicher vos pépites seconde main
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Quick Vibe Selector */}
          <div className="space-y-2">
            <label className="font-bold text-stone-900 dark:text-stone-200 block uppercase tracking-wider text-[11px]">
              Quel univers stylistique souhaitez-vous explorer ?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_VIBES.map((vibe) => (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => {
                    setSelectedVibe(vibe);
                    setCustomPrompt('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedVibe === vibe && !customPrompt
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt & Budget Form */}
          <form onSubmit={handleGenerateRecommendations} className="space-y-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Ou décrivez précisément vos envies :
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ex: Une tenue chic et décontractée pour un week-end à Copenhague..."
                className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-500">Budget max souhaité :</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{budget} €</span>
                <input
                  type="range"
                  min="30"
                  max="400"
                  step="10"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-24 accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Styliste IA en recherche...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Générer mes recommandations</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Recommendations Output Block */}
          {recommendations && (
            <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800 animate-in fade-in">
              {/* Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Votre Direction Stylistique Personnalisée</span>
                </div>
                <p className="text-stone-700 dark:text-stone-200 leading-relaxed text-xs">
                  {recommendations.summary}
                </p>

                {recommendations.styleTip && (
                  <div className="flex items-start gap-2 pt-2 text-[11px] text-stone-600 dark:text-stone-400 border-t border-emerald-500/20">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Conseil du styliste :</strong> {recommendations.styleTip}</span>
                  </div>
                )}
              </div>

              {/* Curated Tags */}
              {recommendations.curatedTags && recommendations.curatedTags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px] block">
                    Mots-clés & Styles signatures
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendations.curatedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleApplyQuery(tag)}
                        className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 hover:text-emerald-600 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 transition-colors flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-emerald-500" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Instant Search Shortcuts */}
              {recommendations.suggestedQueries && recommendations.suggestedQueries.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px] block">
                    Recherches recommandées prêtes à l'emploi
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.suggestedQueries.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleApplyQuery(q)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Search className="w-3 h-3" />
                        <span>Rechercher "{q}"</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Catalog Matching Showcase */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-stone-700 dark:text-stone-300 block">
                  Pièces du catalogue correspondant à votre univers :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {articles.slice(0, 3).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => handleOpenArticle(art)}
                      className="group cursor-pointer p-2 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-emerald-500 transition-all"
                    >
                      <img
                        src={art.images[0]}
                        alt={art.title}
                        className="w-full aspect-[4/3] object-cover rounded-lg group-hover:scale-102 transition-transform"
                      />
                      <div className="mt-1.5">
                        <span className="font-bold text-stone-900 dark:text-white uppercase block truncate">
                          {art.brand}
                        </span>
                        <div className="flex justify-between items-center text-[11px] text-stone-500">
                          <span>{art.price} €</span>
                          <span className="text-emerald-600 font-bold">★ {art.seller.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
