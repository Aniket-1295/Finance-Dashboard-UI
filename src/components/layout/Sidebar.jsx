import React from 'react';
import { 
  LayoutGrid, 
  ListOrdered, 
  Lightbulb, 
  ShieldCheck, 
  Eye 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'transactions', label: 'Transactions', icon: ListOrdered },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export function Sidebar() {
  const { 
    view, 
    setView, 
    role, 
    setRole, 
    sidebarOpen: isOpen, 
    setSidebarOpen: setIsOpen,
    isAdmin 
  } = useAppContext();

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
        "fixed top-0 left-0 bottom-0 z-50 w-[240px] bg-dashboard-bg flex flex-col transition-transform duration-300 lg:translate-x-0 border-r border-transparent",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 px-6 mt-2">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#0a403a] rounded-full flex items-center justify-center shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d5f279" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-tight text-dashboard-text leading-tight">Finio Finance</div>
              <div className="text-[12px] text-dashboard-text-muted mt-0.5 font-medium">Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
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
                  "w-full flex items-center justify-between px-4 py-3 rounded-full transition-all text-sm group",
                  active 
                    ? "bg-[#111111] text-white font-medium shadow-md" 
                    : "text-dashboard-text-muted hover:bg-dashboard-bg-tertiary hover:text-dashboard-text"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 transition-opacity", active ? "opacity-100" : "opacity-70 group-hover:opacity-100")} />
                  <span className={cn(active ? "font-semibold" : "font-medium")}>{item.label}</span>
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-dashboard-accent mr-1"></div>}
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
