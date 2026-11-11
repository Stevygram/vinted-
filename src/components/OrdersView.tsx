import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Truck,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Order } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, setSelectedOrder, openModal, currentUser, advanceOrderStatus } = useApp();
  const [filter, setFilter] = useState<'all' | 'in_transit' | 'delivered'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'in_transit') return o.status !== 'valide' && o.status !== 'livre';
    if (filter === 'delivered') return o.status === 'livre' || o.status === 'valide';
    return true;
  });

  const handleOpenTracking = (order: Order) => {
    setSelectedOrder(order);
    openModal('tracking');
  };

  const handleOpenLabel = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrder(order);
    openModal('shipping_label');
  };

  const activeCount = orders.filter((o) => o.status !== 'valide').length;
  const escrowTotal = orders
    .filter((o) => o.escrowStatus === 'held_in_escrow')
    .reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>Mes Expéditions & Suivi en Direct</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold">
              {activeCount} en transit
            </span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Générez vos bordereaux, déposez en casier sans étiquette et suivez vos colis en temps réel.
          </p>
        </div>

        {/* Stats Pill / Cards */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-2.5 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-[11px] text-stone-400 block">Fonds sous séquestre</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
              {escrowTotal.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          Toutes les commandes ({orders.length})
        </button>
        <button
          onClick={() => setFilter('in_transit')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'in_transit'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          En cours d'acheminement ({orders.filter((o) => o.status !== 'valide' && o.status !== 'livre').length})
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'delivered'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          Livrées & Validées ({orders.filter((o) => o.status === 'livre' || o.status === 'valide').length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
            <Package className="w-10 h-10 text-stone-400 mx-auto opacity-50" />
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
              Aucune expédition dans cette catégorie
            </p>
            <p className="text-xs text-stone-400">
              Vos nouvelles commandes et étiquettes apparaîtront ici automatiquement.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isBuyer = order.buyerId === currentUser.id;
            const statusConfig = {
              etiquette_creee: {
                label: 'Étiquette créée',
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-500/20',
              },
              depose_relais: {
                label: 'Déposé au relais',
                color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-500/20',
              },
              en_transit: {
                label: 'En transit Hub',
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-500/20',
              },
              en_livraison: {
                label: 'En livraison finale',
                color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/20',
              },
              livre: {
                label: 'Disponible au Locker !',
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/20 animate-pulse',
              },
              valide: {
                label: 'Validé & Clôturé',
                color: 'text-stone-600 bg-stone-100 dark:bg-stone-800 border-stone-200',
              },
            }[order.status];

            return (
              <div
                key={order.id}
                onClick={() => handleOpenTracking(order)}
                className="group p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40 hover:shadow-md cursor-pointer transition-all duration-200 space-y-4"
              >
                {/* Top Row: Article Info + Order Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={order.article.images[0]}
                      alt={order.article.title}
                      className="w-14 h-14 rounded-xl object-cover ring-1 ring-stone-200 dark:ring-stone-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-white uppercase">
                          {order.article.brand}
                        </span>
                        <span className="text-stone-300 dark:text-stone-700">·</span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {isBuyer ? 'Acheté' : 'Vendu'} pour {order.total.toFixed(2)} €
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-1">
                        {order.article.title}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {order.carrier} · Réf: <span className="font-mono text-stone-600 dark:text-stone-300">{order.trackingNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Livraison estimée : <strong>{order.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Bar Snapshot */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">
                      Destination : <strong>{order.relayPoint.name}</strong> ({order.relayPoint.city})
                    </span>
                  </div>
                  {order.lockerPin && (
                    <span className="text-[11px] font-mono font-bold bg-white dark:bg-stone-700 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-600 shrink-0">
                      PIN: {order.lockerPin}
                    </span>
                  )}
                </div>

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {order.escrowStatus === 'held_in_escrow'
                        ? 'Fonds sous séquestre sécurisé'
                        : 'Fonds débloqués au vendeur'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleOpenLabel(order, e)}
                      className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Bordereau PDF</span>
                    </button>

                    <button
                      onClick={() => handleOpenTracking(order)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1 transition-all group-hover:scale-105"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Suivre en direct</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
