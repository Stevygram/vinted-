import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-900/95 dark:bg-stone-800/95 text-stone-100 shadow-xl border border-stone-700/60 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      {icons[toast.type]}
      <p className="text-sm font-medium pr-2">{toast.message}</p>
    </div>
  );
};
