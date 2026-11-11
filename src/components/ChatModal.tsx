import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  Sparkles,
  Tag,
  ShieldCheck,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
  Lock,
} from 'lucide-react';
import { ChatOffer } from '../types';

export const ChatModal: React.FC = () => {
  const {
    selectedConversation,
    closeModal,
    openModal,
    setSelectedArticle,
    sendMessage,
    handleOfferDecision,
    currentUser,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  if (!selectedConversation) return null;

  const { article, participant, messages } = selectedConversation;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(selectedConversation.id, inputText.trim());
    setInputText('');
  };

  const handleSendQuickReply = (text: string) => {
    sendMessage(selectedConversation.id, text);
  };

  const handleGenerateAiReplies = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleTitle: article.title,
          price: article.price,
          sellerName: participant.name,
          lastMessage: selectedConversation.lastMessage,
          role: 'acheteur',
        }),
      });
      const data = await res.json();
      if (data.suggestedReplies && Array.isArray(data.suggestedReplies)) {
        setAiSuggestions(data.suggestedReplies);
      }
    } catch {
      setAiSuggestions([
        'Bonjour ! L\'article est-il toujours disponible pour un envoi en Mondial Relay ?',
        'Seriez-vous ouvert(e) à une négociation si je valide aujourd\'hui ?',
        'Pouvez-vous me confirmer que la taille correspond bien ?',
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerPrice > 0 && offerPrice < article.price) {
      const offer: ChatOffer = {
        id: `off_${Date.now()}`,
        price: offerPrice,
        originalPrice: article.price,
        senderId: currentUser.id,
        status: 'pending',
        createdAt: 'À l\'instant',
      };
      sendMessage(
        selectedConversation.id,
        `Nouvelle offre officielle : ${offerPrice.toFixed(2)} € (Prix initial : ${article.price.toFixed(2)} €)`,
        offer
      );
      setShowOfferDrawer(false);
      setOfferPrice(0);
    }
  };

  const handleBuyNow = () => {
    setSelectedArticle(article);
    closeModal();
    openModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center gap-3">
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  {participant.name}
                </h3>
                {participant.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Note ★ {participant.rating} · Réponse en {participant.responseRate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBuyNow}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acheter ({article.price} €)</span>
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pinned Article Mini Card */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-stone-100 dark:bg-stone-800/60 border-b border-stone-200/80 dark:border-stone-700/80 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={article.images[0]}
              alt={article.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight truncate">
                {article.brand} · {article.title}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Taille {article.size} · {article.condition}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-stone-900 dark:text-stone-100">
              {article.price.toFixed(2)} €
            </span>
            <button
              onClick={() => setShowOfferDrawer(!showOfferDrawer)}
              className="p-1.5 rounded-lg bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-500/30 transition-colors"
              title="Faire une offre"
            >
              <Tag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offer Drawer Popover */}
        {showOfferDrawer && (
          <div className="p-3 bg-white dark:bg-stone-800 border-b border-emerald-500/30 space-y-2 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
              <span>Proposer une négociation de prix au vendeur :</span>
              <button
                onClick={() => setShowOfferDrawer(false)}
                className="text-stone-400 hover:text-stone-600 text-[11px]"
              >
                Fermer
              </button>
            </div>
            <div className="flex gap-2">
              {[5, 10, 15].map((pct) => {
                const discounted = Math.round(article.price * (1 - pct / 100));
                return (
                  <button
                    key={pct}
                    onClick={() => {
                      const offer: ChatOffer = {
                        id: `off_${Date.now()}`,
                        price: discounted,
                        originalPrice: article.price,
                        senderId: currentUser.id,
                        status: 'pending',
                        createdAt: 'À l\'instant',
                      };
                      sendMessage(
                        selectedConversation.id,
                        `Offre directe à -${pct}% : ${discounted} €`,
                        offer
                      );
                      setShowOfferDrawer(false);
                    }}
                    className="flex-1 py-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg text-xs font-bold text-stone-800 dark:text-stone-100 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    -{pct}% ({discounted} €)
                  </button>
                );
              })}
            </div>
            <form onSubmit={handleOfferSubmit} className="flex gap-2 pt-1">
              <input
                type="number"
                placeholder="Montant personnalisé (€)"
                value={offerPrice || ''}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
                className="flex-1 px-3 py-1.5 text-xs bg-stone-100 dark:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!offerPrice || offerPrice >= article.price}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 disabled:opacity-40 transition-colors"
              >
                Envoyer l'offre
              </button>
            </form>
          </div>
        )}

        {/* Message Thread Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/30 dark:bg-stone-900">
          <div className="text-center">
            <span className="text-[11px] text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
              Paiement et échanges 100% protégés par Vinted Plus
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.senderId === currentUser.id;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-sm ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {/* Render Offer negotiation card if attached */}
                  {m.offer && (
                    <div
                      className={`mt-2.5 p-3 rounded-xl border text-xs space-y-2 ${
                        isMe
                          ? 'bg-emerald-700/60 border-emerald-400/40 text-white'
                          : 'bg-stone-50 dark:bg-stone-700/60 border-stone-200 dark:border-stone-600 text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> Offre de prix officielle
                        </span>
                        <span className="text-sm font-black">
                          {m.offer.price.toFixed(2)} €
                        </span>
                      </div>
                      <p className="text-[11px] opacity-80">
                        Prix boutique initial : {m.offer.originalPrice.toFixed(2)} € (
                        {Math.round((1 - m.offer.price / m.offer.originalPrice) * 100)}% de remise)
                      </p>

                      {/* Status badge or Action buttons */}
                      {m.offer.status === 'pending' ? (
                        isMe ? (
                          <div className="text-[11px] italic opacity-80 pt-1">
                            En attente de réponse du vendeur...
                          </div>
                        ) : (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() =>
                                handleOfferDecision(selectedConversation.id, m.id, 'accepted')
                              }
                              className="flex-1 py-1 px-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg flex items-center justify-center gap-1 text-[11px] transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Accepter
                            </button>
                            <button
                              onClick={() =>
                                handleOfferDecision(selectedConversation.id, m.id, 'declined')
                              }
                              className="flex-1 py-1 px-2.5 bg-rose-500/80 hover:bg-rose-500 text-white font-bold rounded-lg flex items-center justify-center gap-1 text-[11px] transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Refuser
                            </button>
                          </div>
                        )
                      ) : (
                        <div
                          className={`text-[11px] font-bold uppercase tracking-wider pt-1 flex items-center gap-1 ${
                            m.offer.status === 'accepted' ? 'text-emerald-300' : 'text-rose-400'
                          }`}
                        >
                          {m.offer.status === 'accepted' ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" /> Offre acceptée
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Offre refusée
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-stone-400 px-1">
                  {m.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* AI Quick Responses Suggestion Bar */}
        <div className="px-4 py-2 bg-stone-100 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Réponses intelligentes suggérées
            </span>
            <button
              onClick={handleGenerateAiReplies}
              disabled={isAiLoading}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              {isAiLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              Générer avec l'IA
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(aiSuggestions.length > 0
              ? aiSuggestions
              : [
                  'Bonjour, l\'article est-il toujours dispo ?',
                  'Puis-je avoir les mesures épaules/taille ?',
                  'Envoi rapide sous 24h possible ?',
                ]
            ).map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuickReply(sugg)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600 hover:border-emerald-500 hover:text-emerald-600 text-[11px] whitespace-nowrap transition-colors"
              >
                {sugg}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3.5 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écrivez un message au vendeur..."
            className="flex-1 px-3.5 py-2.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
