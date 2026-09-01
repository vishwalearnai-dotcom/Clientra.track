import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-600 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-xl text-slate-800 text-xs font-semibold">
        {icons[toast.type]}
        <span>{toast.text}</span>
        <button onClick={clearToast} className="text-slate-400 hover:text-slate-600 p-1">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
