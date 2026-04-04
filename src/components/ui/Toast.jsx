import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Toast({ toast, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] animate-in slide-in-from-right-8 duration-300">
      <div className={cn(
        "bg-dashboard-bg-secondary border border-dashboard-border-strong border-l-4 rounded-lg shadow-2xl p-4 min-w-[280px] flex items-start gap-3",
        "border-l-dashboard-accent"
      )}>
        <Info className="w-5 h-5 text-dashboard-accent shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-dashboard-text tracking-tight mb-0.5">
            {toast.title}
          </div>
          <div className="text-xs text-dashboard-text-muted leading-relaxed truncate">
            {toast.body}
          </div>
        </div>
        <button 
          onClick={onDone}
          className="p-1 hover:bg-dashboard-bg-tertiary rounded text-dashboard-text-muted hover:text-dashboard-text transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
