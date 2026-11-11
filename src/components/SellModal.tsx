import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category, Condition, ParcelSize } from '../types';
import {
  X,
  Sparkles,
  Camera,
  Upload,
  Check,
  Loader2,
  Tag,
  Truck,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const PRESET_PHOTOS = [
  {
    label: 'Blazer Oversize Noir',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    brand: 'The Frankie Shop',
    category: 'Femmes',
    size: 'M / 38',
  },
  {
    label: 'Sneakers Retro Vintage',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    brand: 'New Balance 550',
    category: 'Streetwear',
    size: '43 EU',
  },
  {
    label: 'Pull Col Roulé Cachemire',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    brand: 'Eric Bompard',
    category: 'Hommes',
    size: 'L',
  },
  {
    label: 'Sac Cuir Bandoulière',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    brand: 'A.P.C. Paris',
    category: 'Luxe & Vintage',
    size: 'Taille unique',
  },
];

export const SellModal: React.FC = () => {
  const { closeModal, addNewArticle, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Category>('Femmes');
  const [condition, setCondition] = useState<Condition>('Très bon état');
  const [size, setSize] = useState('M');
  const [price, setPrice] = useState<number>(45);
  const [originalPrice, setOriginalPrice] = useState<number>(95);
  const [parcelSize, setParcelSize] = useState<ParcelSize>('M');
  const [description, setDescription] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    recommendedPrice?: number;
    minPrice?: number;
    maxPrice?: number;
    confidence?: string;
    speedToSellEst?: string;
  } | null>(null);

  const handleSelectPreset = (preset: typeof PRESET_PHOTOS[0]) => {
    setSelectedPhoto(preset.url);
    setTitle(preset.label);
    setBrand(preset.brand);
    setCategory(preset.category as Category);
    setSize(preset.size);
  };

  const handleAiPriceAssistant = async () => {
    setIsAiEstimating(true);
    try {
      const res = await fetch('/api/gemini/price-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          brand,
          category,
          condition,
          originalPrice,
          descriptionHint: description,
        }),
      });
      const data = await res.json();
      if (data.recommendedPrice) {
        setPrice(data.recommendedPrice);
        setAiAnalysis({
          recommendedPrice: data.recommendedPrice,
          minPrice: data.minPrice,
          maxPrice: data.maxPrice,
          confidence: data.confidence,
          speedToSellEst: data.speedToSellEst,
        });

        if (data.optimizedTitle && !title) setTitle(data.optimizedTitle);
        if (data.generatedDescription) setDescription(data.generatedDescription);
        if (data.parcelSize?.includes('S')) setParcelSize('S');
        else if (data.parcelSize?.includes('L')) setParcelSize('L');
        else setParcelSize('M');

        showToast('Estimation IA calculée avec succès !', 'success');
      }
    } catch {
      showToast('Estimation automatique standard appliquée.', 'info');
    } finally {
      setIsAiEstimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !brand || price <= 0) {
      showToast('Veuillez renseigner le titre, la marque et le prix.', 'warning');
      return;
    }

    addNewArticle({
      title,
      brand,
      category,
      condition,
      size,
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      parcelSize,
      description:
        description ||
        `Superbe ${title} de chez ${brand}. État: ${condition}. Envoi rapide et soigné garanti avec Vinted Plus.`,
      images: [selectedPhoto],
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900 dark:text-white">
                Vendre un Article sur Vinted Plus
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Estimation intelligente du prix et génération de bordereau automatisée
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

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Photo Selection Presets */}
          <div className="space-y-2">
            <label className="font-bold text-stone-900 dark:text-stone-200 block uppercase tracking-wider text-[11px]">
              1. Photos de l'article (Choisissez une photo témoin ou insérez une URL)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_PHOTOS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedPhoto === preset.url
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded text-center truncate">
                    {preset.brand}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Optimizer Callout Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 animate-pulse" />
              <div>
                <p className="font-bold text-stone-900 dark:text-stone-100">
                  Assistant Prix & Référencement Gemini IA
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Calcule automatiquement le prix de vente optimal et rédige une annonce attrayante.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAiPriceAssistant}
              disabled={isAiEstimating}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0 transition-all"
            >
              {isAiEstimating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyse IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Estimer avec l'IA</span>
                </>
              )}
            </button>
          </div>

          {/* AI Analysis Insight Result */}
          {aiAnalysis && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Prix suggéré : {aiAnalysis.recommendedPrice} € (Fourchette : {aiAnalysis.minPrice} € - {aiAnalysis.maxPrice} €)
                </span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Confiance : {aiAnalysis.confidence || '94%'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                {aiAnalysis.speedToSellEst || 'Délai moyen de vente estimé à 48h-72h avec expédition Mondial Relay.'}
              </p>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Titre de l'annonce
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Veste en jean oversize vintage"
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Marque
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Sézane, Carhartt, Ralph Lauren..."
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Femmes">Femmes</option>
                <option value="Hommes">Hommes</option>
                <option value="Luxe & Vintage">Luxe & Vintage</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Tech">Tech & Audio</option>
                <option value="Enfants">Enfants</option>
                <option value="Maison">Maison</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                État de l'article
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Neuf avec étiquette">Neuf avec étiquette</option>
                <option value="Neuf sans étiquette">Neuf sans étiquette</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
                <option value="Satisfaisant">Satisfaisant</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Taille
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Ex: M / 38, L, 42 EU..."
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Prix de vente (€)
              </label>
              <input
                type="number"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Description détaillée
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez la coupe, les matières, les éventuels défauts, etc."
              className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Automated Shipping Management: Package Size Selector */}
          <div className="space-y-2">
            <label className="font-bold text-stone-900 dark:text-stone-200 block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Gestion automatisée des étiquettes : Format du colis</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 'S', label: 'Petit (S)', desc: 'T-shirts, foulards, accessoires (< 500g)' },
                { size: 'M', label: 'Moyen (M)', desc: 'Pulls, jeans, chaussures légères (500g-1kg)' },
                { size: 'L', label: 'Grand (L)', desc: 'Manteaux épais, vestes cuir, bottes (> 1kg)' },
              ].map((fmt) => (
                <div
                  key={fmt.size}
                  onClick={() => setParcelSize(fmt.size as ParcelSize)}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    parcelSize === fmt.size
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="font-bold block text-stone-900 dark:text-stone-100">{fmt.label}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">{fmt.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-stone-400">
              * Le bordereau prépayé officiel sera émis dès la vente et téléchargeable en 1 clic.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Check className="w-4 h-4" />
            <span>Mettre en vente sur Vinted Plus</span>
          </button>
        </form>
      </div>
    </div>
  );
};
