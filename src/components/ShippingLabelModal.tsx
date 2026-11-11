import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, QrCode, CheckCircle, Package } from 'lucide-react';

export const ShippingLabelModal: React.FC = () => {
  const { selectedOrder, closeModal, showToast } = useApp();

  if (!selectedOrder) return null;

  const handlePrint = () => {
    showToast('Impression du bordereau officiel lancée...', 'info');
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast('Bordereau PDF prépayé téléchargé avec succès !', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 print:hidden">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Bordereau d'Expédition Prépayé Officiel
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Shipping Label Content */}
        <div className="p-6 bg-white text-stone-900 text-xs font-sans print:p-0">
          <div className="border-4 border-black p-4 space-y-4 rounded-lg">
            {/* Carrier Banner */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="text-xl font-black tracking-tighter uppercase font-display">
                  {selectedOrder.carrier.toUpperCase()}
                </span>
                <p className="text-[10px] font-mono tracking-widest text-stone-600">
                  RESEAU OFFICIEL · LIVRAISON RELAIS & LOCKER 24/7
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black border-2 border-black px-2 py-0.5 rounded">
                  FORMAT {selectedOrder.article.parcelSize}
                </span>
                <p className="text-[10px] font-mono mt-0.5">POIDS: &lt; 1.00 KG</p>
              </div>
            </div>

            {/* Barcode Visual Simulation */}
            <div className="py-2 text-center border-b-2 border-black space-y-1">
              <div className="flex justify-center items-center gap-[2px] h-14">
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3,
                  2, 1, 4, 2, 3, 1, 2, 1, 4, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 1,
                  2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1,
                ].map((width, i) => (
                  <div
                    key={i}
                    style={{ width: `${width}px` }}
                    className="h-full bg-black shrink-0"
                  />
                ))}
              </div>
              <p className="font-mono font-bold tracking-widest text-sm">
                *{selectedOrder.trackingNumber}*
              </p>
            </div>

            {/* Sender and Recipient Grid */}
            <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-3 text-[11px]">
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block mb-1">
                  Expéditeur (Vendeur) :
                </span>
                <p className="font-bold">{selectedOrder.article.seller.name}</p>
                <p>Membre vérifié Vinted Plus Pro</p>
                <p>{selectedOrder.article.seller.city}, France</p>
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block mb-1">
                  Destinataire & Point Relais :
                </span>
                <p className="font-bold">{selectedOrder.relayPoint.name}</p>
                <p>{selectedOrder.relayPoint.address}</p>
                <p className="font-bold">{selectedOrder.relayPoint.city}</p>
              </div>
            </div>

            {/* Smart Locker & QR Code drop-off section */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1 text-[11px]">
                <p className="font-bold text-stone-800">
                  OPTION : DÉPÔT EN CONSIGNE SANS ÉTIQUETTE
                </p>
                <p className="text-stone-600 text-[10px]">
                  Scannez ce QR code à la borne pour imprimer l'étiquette ou déposer directement en casier.
                </p>
                {selectedOrder.lockerPin && (
                  <p className="font-mono font-bold text-xs">
                    Code Casier : <span className="bg-stone-200 px-1.5 py-0.5 rounded">{selectedOrder.lockerPin}</span>
                  </p>
                )}
              </div>
              <img
                src={selectedOrder.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${selectedOrder.trackingNumber}`}
                alt="QR Code"
                className="w-16 h-16 border border-stone-300 p-1 shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 print:hidden">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Étiquette prépayée prise en charge par Vinted Plus.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer l'étiquette</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
