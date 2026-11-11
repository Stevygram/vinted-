import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Truck,
  Heart,
  MessageSquare,
  Tag,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const ArticleModal: React.FC = () => {
  const {
    selectedArticle,
    closeModal,
    openModal,
    favorites,
    toggleFavorite,
    sendOffer,
    setSelectedConversation,
    conversations,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [customOfferPrice, setCustomOfferPrice] = useState<number>(0);

  if (!selectedArticle) return null;

  const isFavorite = favorites.includes(selectedArticle.id);
  const protectionFee = Number((0.70 + selectedArticle.price * 0.05).toFixed(2));
  const shippingMin = 2.89;
  const totalEstimated = Number((selectedArticle.price + protectionFee + shippingMin).toFixed(2));

  const handleBuyClick = () => {
    openModal('checkout');
  };

  const handleMessageClick = () => {
    // Check if conversation already exists or prepare a new one
    const existing = conversations.find((c) => c.articleId === selectedArticle.id);
    if (existing) {
      setSelectedConversation(existing);
    }
    openModal('chat');
  };

  const handleQuickOffer = (percent: number) => {
    const discounted = Math.round(selectedArticle.price * (1 - percent / 100));
    sendOffer(selectedArticle, discounted);
    setShowOfferInput(false);
  };

  const handleCustomOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customOfferPrice > 0 && customOfferPrice < selectedArticle.price) {
      sendOffer(selectedArticle, customOfferPrice);
      setShowOfferInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-md flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Image Showcase (7 cols) */}
          <div className="md:col-span-7 bg-stone-100 dark:bg-stone-950 p-4 sm:p-6 flex flex-col justify-between">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-900 shadow-inner">
              <img
                src={selectedArticle.images[activeImageIndex] || selectedArticle.images[0]}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />

              {/* Multi-image indicators if multiple */}
              {selectedArticle.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? selectedArticle.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === selectedArticle.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Heart favorite floating */}
              <button
                onClick={() => toggleFavorite(selectedArticle.id)}
                className="absolute top-3 left-3 p-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-md text-stone-700 dark:text-stone-200 hover:scale-105 transition-transform"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-600 dark:text-stone-300'
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail selector */}
            {selectedArticle.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {selectedArticle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-emerald-500 scale-95 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="miniature" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Buyer Protection, Seller & Actions (5 cols) */}
          <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand and Title */}
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
                  {selectedArticle.category}
                </span>
                <h1 className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tight mt-0.5">
                  {selectedArticle.brand}
                </h1>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 leading-snug">
                  {selectedArticle.title}
                </p>
              </div>

              {/* Main Price Tag */}
              <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-900 dark:text-white">
                      {selectedArticle.price.toFixed(2)} €
                    </span>
                    {selectedArticle.originalPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        {selectedArticle.originalPrice} €
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    En stock (1 exemplaire)
                  </span>
                </div>

                {/* Secure Price Breakdown */}
                <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 text-xs space-y-1.5 text-stone-600 dark:text-stone-400">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Protection acheteurs (Séquestre) :
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-200">
                      +{protectionFee.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-sky-500" />
                      Livraison Relay dès :
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-200">
                      +{shippingMin.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                    <span>Total sécurisé estimé :</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ~ {totalEstimated.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Item Specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Taille</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{selectedArticle.size}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 block text-[11px]">État</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 truncate block">
                    {selectedArticle.condition}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Format d'envoi</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    Colis Format {selectedArticle.parcelSize}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Ajouté</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {selectedArticle.createdAt}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                  Description du vendeur
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                  {selectedArticle.description}
                </p>
              </div>

              {/* Seller Profile Card */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedArticle.seller.avatar}
                    alt={selectedArticle.seller.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {selectedArticle.seller.name}
                      </span>
                      {selectedArticle.seller.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="text-amber-500 font-semibold">
                        ★ {selectedArticle.seller.rating} ({selectedArticle.seller.reviewCount})
                      </span>
                      <span>·</span>
                      <span>{selectedArticle.seller.city}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-stone-400">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>Répond en {selectedArticle.seller.responseRate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2.5 pt-2">
              {/* Primary Buy Button */}
              <button
                onClick={handleBuyClick}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Acheter avec Protection Séquestre</span>
              </button>

              {/* Secondary Actions: Make an Offer & Send Message */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowOfferInput(!showOfferInput)}
                  className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Faire une offre</span>
                </button>

                <button
                  onClick={handleMessageClick}
                  className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                  <span>Message</span>
                </button>
              </div>

              {/* Make an Offer Expandable Tray */}
              {showOfferInput && (
                <div className="p-3 bg-stone-100 dark:bg-stone-800/90 rounded-xl border border-emerald-500/30 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                    <span>Négociation rapide :</span>
                    <span className="text-[11px] text-stone-400">Jusqu'à -20% max</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[5, 10, 15].map((pct) => {
                      const discounted = Math.round(selectedArticle.price * (1 - pct / 100));
                      return (
                        <button
                          key={pct}
                          onClick={() => handleQuickOffer(pct)}
                          className="py-1 px-2 rounded-lg bg-white dark:bg-stone-700 text-xs font-bold text-stone-800 dark:text-stone-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-colors"
                        >
                          -{pct}% ({discounted} €)
                        </button>
                      );
                    })}
                  </div>
                  <form onSubmit={handleCustomOfferSubmit} className="flex gap-2 pt-1">
                    <input
                      type="number"
                      placeholder="Autre montant (€)"
                      value={customOfferPrice || ''}
                      onChange={(e) => setCustomOfferPrice(Number(e.target.value))}
                      className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!customOfferPrice || customOfferPrice >= selectedArticle.price}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 disabled:opacity-40 transition-colors"
                    >
                      Proposer
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
