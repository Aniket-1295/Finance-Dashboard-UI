import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={cn(
          "bg-dashboard-bg-secondary border border-dashboard-border-strong rounded-dashboard w-full max-w-[440px] shadow-2xl p-7 animate-in slide-in-from-bottom-4 duration-300 fill-both",
          "relative overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-dashboard-text tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-dashboard-bg-tertiary rounded-md text-dashboard-text-muted hover:text-dashboard-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}
