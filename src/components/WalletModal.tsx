import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const WalletModal: React.FC = () => {
  const { currentUser, transactions, closeModal, withdrawToBank, showToast } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawToBank(withdrawAmount)) {
      setShowWithdrawForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900 dark:text-white">
                Portefeuille Sécurisé & Séquestre
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Gestion des fonds, libération de séquestre et virements bancaires
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

        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Balance Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Available Balance */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg space-y-2">
              <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider block">
                Solde disponible pour retrait
              </span>
              <div className="text-2xl font-black tracking-tight">
                {currentUser.balanceAvailable.toFixed(2)} €
              </div>
              <p className="text-[10px] text-emerald-100/80">
                Fonds validés · Utilisables immédiatement pour de nouveaux achats ou virement bancaire.
              </p>
              <button
                onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                className="w-full mt-2 py-1.5 px-3 bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Transférer vers ma banque</span>
              </button>
            </div>

            {/* Escrow Balance */}
            <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  Fonds sous séquestre
                </span>
                <Lock className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                {currentUser.balanceInEscrow.toFixed(2)} €
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Bloqués en toute sécurité pendant l'acheminement des commandes en cours. Débloqués dès confirmation acheteur.
              </p>
            </div>
          </div>

          {/* Bank Transfer Drawer */}
          {showWithdrawForm && (
            <form
              onSubmit={handleWithdrawSubmit}
              className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-emerald-500/30 space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-500" />
                  Virement Instantané SEPA
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  Compte: {currentUser.ibanMasked}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-stone-500 block">
                  Montant à transférer (€)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    max={currentUser.balanceAvailable}
                    min={1}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="flex-1 px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg font-bold text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(currentUser.balanceAvailable)}
                    className="px-3 py-1 bg-stone-200 dark:bg-stone-600 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-200"
                  >
                    Tout ({currentUser.balanceAvailable.toFixed(2)} €)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={withdrawAmount <= 0 || withdrawAmount > currentUser.balanceAvailable}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Confirmer le virement de {withdrawAmount} €</span>
              </button>
            </form>
          )}

          {/* Escrow Guarantee Explainer */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-stone-700 dark:text-stone-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">
                Comment fonctionne la protection du séquestre ?
              </p>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                1. L'acheteur paie l'article : l'argent est placé dans le coffre-fort sécurisé Vinted Plus.<br />
                2. Le vendeur expédie avec l'étiquette automatisée et le suivi en direct.<br />
                3. Dès que l'acheteur valide "Tout est conforme", les fonds sont automatiquement crédités sur le solde disponible.
              </p>
            </div>
          </div>

          {/* Transaction History Log */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider text-[11px]">
              Historique des opérations & séquestres
            </h4>

            <div className="space-y-2">
              {transactions.map((tx) => {
                const isPositive = tx.amount > 0;

                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.status === 'in_escrow'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                            : isPositive
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {tx.status === 'in_escrow' ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : isPositive ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {tx.description}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {tx.date} · {tx.status === 'in_escrow' ? 'En attente de livraison' : 'Validé'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-black text-sm ${
                          tx.status === 'in_escrow'
                            ? 'text-amber-500'
                            : isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {tx.amount.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
