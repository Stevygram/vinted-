import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  PlusCircle,
  Sparkles,
  Package,
  MessageSquare,
  Wallet,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery }) => {
  const {
    isDark,
    toggleTheme,
    currentUser,
    orders,
    conversations,
    activeView,
    setActiveView,
    openModal,
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Active parcels in progress (not yet delivered/validated)
  const activeOrdersCount = orders.filter((o) => o.status !== 'valide').length;
  // Total unread messages
  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const quickTrends = ['Carhartt Vintage', 'Sézane Gaspard', 'Jacquemus Chiquito', 'Salomon XT-6', 'Burberry Vintage'];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      {/* Top Banner: Buyer Protection & Escrow Guarantee */}
      <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between text-center overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>
            <strong>Garantie Vinted Plus :</strong> Paiement 100% sécurisé sous séquestre bancaire & expédition automatisée avec suivi en direct.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              V+
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-stone-900 dark:text-white">
                  vinted<span className="text-emerald-500 font-black">+</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                Seconde main & style sécurisé
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Rechercher des articles, marques (Carhartt, Sézane, Jacquemus...)"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Quick Search Popover on focus */}
          {isSearchFocused && !searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl z-50 animate-in fade-in">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Recherches populaires
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickTrends.map((trend) => (
                  <button
                    key={trend}
                    onMouseDown={() => setSearchQuery(trend)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors"
                  >
                    {trend}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Stylist Button */}
          <button
            onClick={() => openModal('ai_stylist')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/15 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Styliste IA</span>
          </button>

          {/* Sell Button */}
          <button
            onClick={() => openModal('sell')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Vendre</span>
          </button>

          <div className="h-5 w-px bg-stone-200 dark:bg-stone-800 mx-1 hidden sm:block" />

          {/* Real-time Tracking Nav Item */}
          <button
            onClick={() => setActiveView('orders')}
            className={`relative p-2 rounded-xl transition-colors ${
              activeView === 'orders'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title="Suivi de colis en direct"
          >
            <Package className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* Messaging Nav Item */}
          <button
            onClick={() => setActiveView('messages')}
            className={`relative p-2 rounded-xl transition-colors ${
              activeView === 'messages'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title="Messagerie instantanée"
          >
            <MessageSquare className="w-5 h-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </button>

          {/* Virtual Wallet */}
          <button
            onClick={() => openModal('wallet')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Portefeuille sous séquestre"
          >
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {currentUser.balanceAvailable.toFixed(2)} €
            </span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-600" />}
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-1 cursor-pointer" onClick={() => openModal('wallet')}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des articles, marques..."
            className="w-full pl-10 pr-4 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>
    </header>
  );
};
