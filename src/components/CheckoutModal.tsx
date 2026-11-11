import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RelayPoint } from '../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  Wallet,
  Smartphone,
  Lock,
  MapPin,
  Check,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    selectedArticle,
    closeModal,
    openModal,
    relayPoints,
    currentUser,
    createOrder,
  } = useApp();

  const [selectedRelay, setSelectedRelay] = useState<RelayPoint>(relayPoints[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('4970 8200 1934 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('742');
  const [isProcessing, setIsProcessing] = useState(false);
  const [is3DSecureActive, setIs3DSecureActive] = useState(false);
  const [threeDSCode, setThreeDSCode] = useState('');

  if (!selectedArticle) return null;

  // Pricing calculations
  const articlePrice = selectedArticle.price;
  const buyerProtectionFee = Number((0.70 + articlePrice * 0.05).toFixed(2));
  
  // Shipping cost based on carrier
  let shippingCost = 2.89;
  if (selectedRelay.carrier === 'Chronopost Shop2Shop') shippingCost = 3.20;
  if (selectedRelay.carrier === 'Colissimo Relais') shippingCost = 4.95;

  const totalAmount = Number((articlePrice + buyerProtectionFee + shippingCost).toFixed(2));
  const canPayWithWallet = currentUser.balanceAvailable >= totalAmount;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'card') {
      // Simulate 3D Secure banking verification flow
      setTimeout(() => {
        setIsProcessing(false);
        setIs3DSecureActive(true);
      }, 900);
    } else {
      // Direct Apple Pay or Wallet payment
      setTimeout(() => {
        finalizeOrder();
      }, 1200);
    }
  };

  const handleValidate3DSecure = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIs3DSecureActive(false);
      finalizeOrder();
    }, 1100);
  };

  const finalizeOrder = () => {
    const order = createOrder({
      article: selectedArticle,
      paymentMethod,
      relayPoint: selectedRelay,
      carrierName: selectedRelay.carrier,
      shippingFee: shippingCost,
      protectionFee: buyerProtectionFee,
      total: totalAmount,
    });

    setIsProcessing(false);
    closeModal();
    // Automatically transition to the live parcel tracker for immediate gratification!
    openModal('tracking');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900 dark:text-white">
                Paiement Sécurisé & Séquestre Garanti
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Protocole de séquestre bancaire certifié Vinted Plus
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Secure Simulation Modal Overlay */}
        {is3DSecureActive && (
          <div className="absolute inset-0 z-30 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-2xl border border-emerald-500/30 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Authentification Forte 3D-Secure
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Votre banque demande une confirmation pour l'achat de <strong>{totalAmount.toFixed(2)} €</strong>.
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl text-xs text-left space-y-1 text-stone-600 dark:text-stone-300">
                <div className="flex justify-between">
                  <span>Commerçant :</span>
                  <span className="font-bold">Vinted Plus Escrow SAS</span>
                </div>
                <div className="flex justify-between">
                  <span>Montant sous séquestre :</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalAmount.toFixed(2)} €</span>
                </div>
              </div>

              <form onSubmit={handleValidate3DSecure} className="space-y-3">
                <input
                  type="text"
                  placeholder="Code de validation SMS (ex: 849204)"
                  value={threeDSCode}
                  onChange={(e) => setThreeDSCode(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-sm px-3 py-2 bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validation bancaire en cours...</span>
                    </>
                  ) : (
                    <span>Confirmer le paiement sécurisé</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Article Summary Header */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
            <img
              src={selectedArticle.images[0]}
              alt={selectedArticle.title}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white truncate">
                {selectedArticle.brand} · {selectedArticle.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Taille: {selectedArticle.size} · État: {selectedArticle.condition}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Vendeur : <strong>{selectedArticle.seller.name}</strong> ({selectedArticle.seller.city})
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-stone-900 dark:text-white">
                {selectedArticle.price.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Escrow Guarantee Highlight Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-stone-700 dark:text-stone-300">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">
                Fonds conservés sous séquestre sécurisé
              </p>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                Le vendeur ne recevra l'argent que lorsque vous aurez retiré votre colis et confirmé sa conformité. En cas de perte ou d'article non conforme, vous êtes intégralement remboursé(e).
              </p>
            </div>
          </div>

          {/* Step 1: Choose Relay Point */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>1. Point de retrait & transporteur</span>
              </label>
              <span className="text-[11px] text-stone-400">Autour de Lyon (69002)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relayPoints.map((rp) => {
                const isSelected = selectedRelay.id === rp.id;
                let cost = 2.89;
                if (rp.carrier === 'Chronopost Shop2Shop') cost = 3.20;
                if (rp.carrier === 'Colissimo Relais') cost = 4.95;

                return (
                  <div
                    key={rp.id}
                    onClick={() => setSelectedRelay(rp)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                        <span className="truncate pr-1">{rp.name}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
                          {cost.toFixed(2)} €
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {rp.address}, {rp.city}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {rp.openingHours}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400">
                      <span>Distance: {rp.distance}</span>
                      {isSelected && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Sélectionné
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Payment Method */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
              <span>2. Mode de paiement sécurisé</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-500" />
                <span>Carte Bancaire</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Smartphone className="w-5 h-5 text-stone-800 dark:text-white" />
                <span>Apple / G-Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Wallet className="w-5 h-5 text-emerald-500" />
                <span>Solde ({currentUser.balanceAvailable.toFixed(2)} €)</span>
              </button>
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2.5 text-xs animate-in fade-in">
                <div>
                  <label className="text-[11px] font-medium text-stone-500 block mb-1">
                    Numéro de carte bancaire
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-stone-500 block mb-1">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-500 block mb-1">
                      CVC / Cryptogramme
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Wallet warning if insufficient */}
            {paymentMethod === 'wallet' && !canPayWithWallet && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Solde insuffisant ({currentUser.balanceAvailable.toFixed(2)} € disponibles pour un total de {totalAmount.toFixed(2)} €). Veuillez choisir la Carte Bancaire.
                </span>
              </div>
            )}
          </div>

          {/* Price Breakdown Final Recap */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-xs space-y-1.5 text-stone-600 dark:text-stone-400">
            <div className="flex justify-between">
              <span>Prix de l'article :</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {articlePrice.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between">
              <span>Protection Acheteurs (Séquestre anti-fraude) :</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {buyerProtectionFee.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frais de port ({selectedRelay.carrier}) :</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {shippingCost.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-800">
              <span>Total à régler :</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {totalAmount.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Submit Payment Button */}
          <button
            onClick={handleStartPayment}
            disabled={isProcessing || (paymentMethod === 'wallet' && !canPayWithWallet)}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.01]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sécurisation de la transaction sous séquestre...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Régler {totalAmount.toFixed(2)} € en toute sécurité</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
