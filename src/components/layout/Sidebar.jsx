import React from 'react';
import { 
  LayoutGrid, 
  ListOrdered, 
  Lightbulb, 
  ShieldCheck, 
  Eye 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'transactions', label: 'Transactions', icon: ListOrdered },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export function Sidebar({ view, setView, role, setRole, isOpen, setIsOpen }) {
  const isAdmin = role === 'admin';

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside className={cn(
        "fixed top-0 left-0 bottom-0 z-50 w-[220px] bg-dashboard-bg-secondary border-r border-dashboard-border flex flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-dashboard-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-dashboard-accent rounded-lg flex items-center justify-center font-mono font-medium text-black">
              F
            </div>
            <div>
              <div className="text-[17px] font-semibold tracking-tight text-dashboard-text leading-tight">Finio</div>
              <div className="text-[10px] text-dashboard-text-dim tracking-[1.5px] uppercase mt-0.5">Finance OS</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] tracking-[1.2px] uppercase text-dashboard-text-dim px-2 py-4">
            Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group",
                  active 
                    ? "bg-dashboard-accent-soft text-dashboard-accent font-medium" 
                    : "text-dashboard-text-muted hover:bg-dashboard-bg-tertiary hover:text-dashboard-text"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-opacity", active ? "opacity-100" : "opacity-70 group-hover:opacity-100")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dashboard-border">
          <div className="bg-dashboard-bg-tertiary rounded-lg p-3">
            <div className="text-[10px] text-dashboard-text-dim tracking-wider uppercase mb-2 flex items-center gap-1.5">
              {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              Role
            </div>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-dashboard-bg-secondary border border-dashboard-border-strong text-dashboard-text text-sm p-1.5 rounded-md cursor-pointer outline-none focus:border-dashboard-accent/50 transition-colors"
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <div className="mt-2 text-[11px] text-dashboard-text-dim">
              {isAdmin ? '✦ Full access' : '◎ View-only mode'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
