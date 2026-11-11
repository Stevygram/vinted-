import React, { useState, useMemo } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CategoryNav } from './components/CategoryNav';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackingModal } from './components/TrackingModal';
import { ShippingLabelModal } from './components/ShippingLabelModal';
import { ChatModal } from './components/ChatModal';
import { SellModal } from './components/SellModal';
import { AiStylistModal } from './components/AiStylistModal';
import { WalletModal } from './components/WalletModal';
import { MessagesView } from './components/MessagesView';
import { OrdersView } from './components/OrdersView';
import { Toast } from './components/Toast';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
  PlusCircle,
  Tag,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function App() {
  const {
    articles,
    activeView,
    setActiveView,
    modal,
    openModal,
    orders,
  } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'popular'>('relevance');
  const [maxPrice, setMaxPrice] = useState<number>(500);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedCondition !== 'all' ||
    selectedSize !== 'all' ||
    maxPrice < 500;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedSize('all');
    setMaxPrice(500);
    setSortBy('relevance');
  };

  // Filtered and sorted articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter((art) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = art.title.toLowerCase().includes(q);
          const matchBrand = art.brand.toLowerCase().includes(q);
          const matchCat = art.category.toLowerCase().includes(q);
          const matchDesc = art.description.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchCat && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && art.category !== selectedCategory) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== 'all' && art.condition !== selectedCondition) {
          return false;
        }

        // Size filter
        if (selectedSize !== 'all' && !art.size.includes(selectedSize)) {
          return false;
        }

        // Max price filter
        if (art.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'popular') return b.likes - a.likes;
        return 0; // relevance / default
      });
  }, [articles, searchQuery, selectedCategory, selectedCondition, selectedSize, maxPrice, sortBy]);

  const activeTrackingOrders = orders.filter((o) => o.status !== 'valide');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Global Navigation */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            {/* Hero / High-Impact Fashion Header Banner */}
            <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-white dark:from-stone-900 dark:via-stone-900/60 dark:to-stone-950 border-b border-stone-200/80 dark:border-stone-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Plateforme de Seconde Main Nouvelle Génération</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.1]">
                      Achetez & Vendez en toute sérénité avec le{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600">
                        Séquestre Garanti
                      </span>
                    </h1>

                    <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                      L'expérience Vinted sublimée : paiements sous séquestre bancaire sécurisé, étiquettes d'envoi automatisées sans impression, suivi des colis en direct et recommandations personnalisées par IA.
                    </p>

                    {/* Quick Call to Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => openModal('ai_stylist')}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Styliste Personnel IA</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openModal('sell')}
                        className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700/80 text-stone-900 dark:text-stone-100 font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all hover:scale-105"
                      >
                        <PlusCircle className="w-4 h-4 text-emerald-500" />
                        <span>Vendre avec l'estimation IA</span>
                      </button>

                      {activeTrackingOrders.length > 0 && (
                        <button
                          onClick={() => setActiveView('orders')}
                          className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all hover:bg-emerald-100"
                        >
                          <Truck className="w-4 h-4 animate-pulse" />
                          <span>Suivre mes {activeTrackingOrders.length} colis en direct</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Key Guarantees Feature Cards */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-sm space-y-1.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 dark:text-stone-100">
                        Séquestre Bancaire
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                        Fonds bloqués jusqu'à la vérification de conformité de l'article par l'acheteur.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-sm space-y-1.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 dark:text-stone-100">
                        Expédition 100% Automatisée
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                        Bordereaux prépayés générés instantanément et QR code casier sans étiquette.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-sm space-y-1.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 dark:text-stone-100">
                        Suivi en Temps Réel
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                        Scans d'acheminement en direct avec notification et ouverture par code PIN.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-sm space-y-1.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 dark:text-stone-100">
                        IA Gemini Fashion
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                        Assistant d'estimation de prix de vente et recommandations looks sur-mesure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Category Navigation & Interactive Filters */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedCondition={selectedCondition}
              onSelectCondition={setSelectedCondition}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              sortBy={sortBy}
              onSelectSort={setSortBy}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Article Feed Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
              {/* Feed Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
                    {searchQuery
                      ? `Résultats pour "${searchQuery}"`
                      : selectedCategory === 'all'
                      ? 'Dernières pièces disponibles'
                      : selectedCategory}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} disponible{filteredArticles.length > 1 ? 's' : ''} avec protection acheteurs
                  </p>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Réinitialiser les filtres</span>
                  </button>
                )}
              </div>

              {/* Grid of Articles */}
              {filteredArticles.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
                  <Search className="w-10 h-10 text-stone-400 mx-auto opacity-50" />
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">
                    Aucun article ne correspond à votre recherche
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    Essayez d'élargir vos filtres de prix ou testez d'autres mots-clés comme "Carhartt", "Sézane" ou "Vintage".
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-500 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeView === 'messages' && <MessagesView />}

        {activeView === 'orders' && <OrdersView />}
      </main>

      {/* Global Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-8 text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
              V+
            </div>
            <span className="font-display font-bold text-stone-900 dark:text-white">
              VINTED PLUS · Marketplace Seconde Main Augmentée
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span>Paiements sous séquestre</span>
            <span>·</span>
            <span>Expédition automatisée</span>
            <span>·</span>
            <span>Suivi colis temps réel</span>
            <span>·</span>
            <span>IA Gemini 3.8 Flash</span>
          </div>

          <p className="text-[11px] text-stone-400">
            Conçu avec amour pour une mode durable et sécurisée.
          </p>
        </div>
      </footer>

      {/* Modals Container */}
      {modal === 'article' && <ArticleModal />}
      {modal === 'checkout' && <CheckoutModal />}
      {modal === 'tracking' && <TrackingModal />}
      {modal === 'shipping_label' && <ShippingLabelModal />}
      {modal === 'chat' && <ChatModal />}
      {modal === 'sell' && <SellModal />}
      {modal === 'ai_stylist' && (
        <AiStylistModal onApplySearchQuery={(q) => setSearchQuery(q)} />
      )}
      {modal === 'wallet' && <WalletModal />}

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
}
