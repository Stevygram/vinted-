import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Printer,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Play,
} from 'lucide-react';

export const TrackingModal: React.FC = () => {
  const {
    selectedOrder,
    closeModal,
    openModal,
    advanceOrderStatus,
    confirmOrderReceived,
  } = useApp();

  if (!selectedOrder) return null;

  const steps = [
    { key: 'etiquette_creee', label: 'Bordereau créé', icon: Printer },
    { key: 'depose_relais', label: 'Déposé au relais', icon: Package },
    { key: 'en_transit', label: 'En transit Hub', icon: Truck },
    { key: 'en_livraison', label: 'En livraison', icon: Clock },
    { key: 'livre', label: 'Livré en Locker', icon: MapPin },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === selectedOrder.status);
  const isDelivered = selectedOrder.status === 'livre';
  const isValidated = selectedOrder.status === 'valide';
  const canAdvance = currentStepIndex >= 0 && currentStepIndex < steps.length - 1;

  const handleAdvance = () => {
    advanceOrderStatus(selectedOrder.id);
  };

  const handleConfirmOrder = () => {
    confirmOrderReceived(selectedOrder.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-stone-900 dark:text-white">
                  Suivi de Colis en Temps Réel
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/20">
                  {selectedOrder.carrier}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Numéro d'expédition : <strong className="font-mono text-stone-800 dark:text-stone-200">{selectedOrder.trackingNumber}</strong>
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

        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Article Quick Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <img
                src={selectedOrder.article.images[0]}
                alt={selectedOrder.article.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-xs uppercase text-stone-900 dark:text-white">
                  {selectedOrder.article.brand} · {selectedOrder.article.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Vendeur : {selectedOrder.article.seller.name} · Montant : {selectedOrder.total.toFixed(2)} €
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal('shipping_label')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-600 hover:bg-stone-100 transition-colors shrink-0 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Bordereau officiel</span>
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
              <span>Progression logistique de l'acheminement</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {isValidated
                  ? 'Commande clôturée avec succès'
                  : isDelivered
                  ? 'Disponible pour retrait'
                  : 'En transit'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 relative">
              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx || isValidated;
                const isCurrent = currentStepIndex === idx && !isValidated;
                const IconComponent = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700'
                      } ${isCurrent ? 'animate-bounce' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] leading-tight font-medium ${
                        isPassed
                          ? 'text-stone-900 dark:text-stone-100 font-bold'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
              <Play className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Simulateur de livraison directe :</strong> Testez en direct l'avancement du colis étape par étape.
              </span>
            </div>

            {canAdvance && (
              <button
                onClick={handleAdvance}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Faire avancer l'étape suivante</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Delivery & Locker Pickup Info Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Locker Pin / QR Code */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-stone-400 text-[11px] uppercase font-bold tracking-wider block">
                  Point de retrait sélectionné
                </span>
                <p className="font-bold text-stone-900 dark:text-white mt-0.5">
                  {selectedOrder.relayPoint.name}
                </p>
                <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                  {selectedOrder.relayPoint.address}, {selectedOrder.relayPoint.city}
                </p>
              </div>

              {selectedOrder.lockerPin && (
                <div className="p-3 bg-white dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600 text-center">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                    Code PIN de retrait Locker 24/7
                  </span>
                  <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-widest">
                    {selectedOrder.lockerPin}
                  </span>
                </div>
              )}
            </div>

            {/* Smartphone QR Code drop-off / pick-up */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg border border-stone-200 shrink-0">
                <img
                  src={selectedOrder.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${selectedOrder.trackingNumber}`}
                  alt="QR Code de suivi"
                  className="w-16 h-16"
                />
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
                <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                  QR Code Sans Impression
                </span>
                <p>
                  Présentez ce QR Code sur votre smartphone à la borne ou au commerçant pour déposer ou récupérer le colis.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Timeline Events */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Historique des scans logistiques en direct
            </h4>

            <div className="space-y-3 border-l-2 border-emerald-500/30 ml-2.5 pl-4 py-1">
              {selectedOrder.events.map((ev) => (
                <div key={ev.id} className="relative text-xs">
                  <div
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${
                      ev.completed ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-stone-300 dark:bg-stone-600'
                    }`}
                  />
                  <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {ev.location}
                    </span>
                    <span>{ev.date}</span>
                  </div>
                  <p className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {ev.label}
                  </p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Release Escrow Button if parcel is delivered */}
          {isDelivered && !isValidated && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                    Avez-vous bien récupéré et vérifié votre article ?
                  </h4>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                    En validant la réception, vous confirmez que l'article est conforme. Les fonds sous séquestre ({selectedOrder.price.toFixed(2)} €) seront automatiquement versés sur le portefeuille du vendeur.
                  </p>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tout est conforme ! Valider la commande & Débloquer les fonds</span>
              </button>
            </div>
          )}

          {isValidated && (
            <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-center text-xs text-stone-600 dark:text-stone-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Commande clôturée avec succès · Les fonds ont été débloqués au vendeur.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
