import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Search,
  Tag,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { conversations, setSelectedConversation, openModal, setActiveView } = useApp();
  const [filter, setFilter] = useState<'all' | 'offers'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.participant.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.article.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.article.brand.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'offers') {
      return c.messages.some((m) => !!m.offer);
    }
    return true;
  });

  const handleOpenConversation = (conv: typeof conversations[0]) => {
    setSelectedConversation(conv);
    openModal('chat');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">
              Messagerie Instantanée
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold">
              {conversations.length} conversations
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Échangez directement avec les acheteurs et vendeurs, négociez et suivez vos offres.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Tous les messages
          </button>
          <button
            onClick={() => setFilter('offers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
              filter === 'offers'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-emerald-500" />
            <span>Offres & Négociations</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Rechercher par membre, marque ou article..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Conversation Cards List */}
      <div className="space-y-2.5">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <MessageSquare className="w-10 h-10 text-stone-400 mx-auto opacity-50" />
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
              Aucune conversation trouvée
            </p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Découvrez des pièces sur le feed et contactez les vendeurs pour démarrer une négociation !
            </p>
            <button
              onClick={() => setActiveView('home')}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-500 transition-colors"
            >
              Explorer le catalogue
            </button>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const hasOffer = conv.messages.some((m) => !!m.offer);

            return (
              <div
                key={conv.id}
                onClick={() => handleOpenConversation(conv)}
                className="group p-4 bg-white dark:bg-stone-900 hover:bg-emerald-50/20 dark:hover:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40 cursor-pointer shadow-sm transition-all duration-200 flex items-center justify-between gap-4"
              >
                {/* Left: Avatar + Item Thumbnail */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-700 group-hover:ring-emerald-500/40 transition-all"
                    />
                    <img
                      src={conv.article.images[0]}
                      alt={conv.article.title}
                      className="w-6 h-6 rounded-md object-cover absolute -bottom-1 -right-1 ring-1 ring-white dark:ring-stone-900 shadow-sm"
                    />
                  </div>

                  {/* Middle Content */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {conv.participant.name}
                      </span>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <span className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {conv.article.brand} ({conv.article.price} €)
                      </span>
                      {hasOffer && (
                        <span className="text-[10px] bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/20 shrink-0">
                          Offre
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-0.5 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1">
                      <span>{conv.lastMessageTime}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-3 h-3" /> Protection Vinted Plus
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Unread indicator & chevron */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
