import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  ArrowUp,
  ArrowDown,
  Star
} from 'lucide-react';
import { cn } from '../../lib/utils';

const ICON_MAP = {
  wallet: Wallet,
  up: ArrowUp,
  down: ArrowDown,
  star: Star,
};

export function StatCard({ label, value, delta, up, color, icon, bgColor, delay = "0s", empty = false, onAction }) {
  const Icon = ICON_MAP[icon] || Wallet;
  const TrendIcon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <div 
      className={cn(
        "bg-dashboard-bg-secondary border rounded-dashboard p-5 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 fill-both",
        empty ? "border-dashboard-border/50 opacity-60" : "border-dashboard-border hover:border-dashboard-border-strong"
      )}
      style={{ animationDelay: delay }}
    >
      <div 
        className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-4 transition-transform", !empty && "hover:scale-110")}
        style={{ backgroundColor: empty ? "var(--color-dashboard-bg-tertiary)" : bgColor, color: empty ? "var(--color-dashboard-text-dim)" : color }}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>
      
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-dashboard-text-dim mb-2.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: empty ? "var(--color-dashboard-text-dim)" : color }} />
        {label}
      </div>

      <div className={cn(
        "font-mono text-2xl font-medium tracking-tighter mb-2",
        empty ? "text-dashboard-text-dim" : ""
      )} style={!empty ? { color } : {}}>
        {empty ? "$0.00" : value}
      </div>

      {empty ? (
        <button 
          onClick={onAction}
          className="text-[10px] font-bold uppercase tracking-wider text-dashboard-accent hover:text-dashboard-accent-muted transition-colors flex items-center gap-1"
        >
          Add first transaction →
        </button>
      ) : (
        <div className={cn(
          "flex items-center gap-1 text-xs font-semibold",
          up ? "text-dashboard-success" : "text-dashboard-danger"
        )}>
          <TrendIcon className="w-3.5 h-3.5" />
          {delta}
        </div>
      )}
    </div>
  );
}

export function SummaryGrid({ balance, income, expense, savings, isAllEmpty = false, onAdd }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard 
        label="Total Balance" 
        value={balance} 
        delta="+4.2% this month" 
        up={true} 
        color="#d4a853" 
        icon="wallet" 
        bgColor="var(--color-dashboard-accent-soft)"
        delay="0s"
        empty={isAllEmpty}
        onAction={onAdd}
      />
      <button className="hidden" onClick={onAdd} /> {/* Accessibility/Logic anchor */}
      <StatCard 
        label="Total Income" 
        value={income} 
        delta="+12.1% vs last month" 
        up={true} 
        color="var(--color-dashboard-success)" 
        icon="up" 
        bgColor="rgba(76, 175, 133, 0.12)"
        delay="0.1s"
        empty={isAllEmpty}
        onAction={onAdd}
      />
      <StatCard 
        label="Total Expenses" 
        value={expense} 
        delta="-3.4% vs last month" 
        up={false} 
        color="var(--color-dashboard-danger)" 
        icon="down" 
        bgColor="rgba(224, 92, 106, 0.12)"
        delay="0.2s"
        empty={isAllEmpty}
        onAction={onAdd}
      />
      <StatCard 
        label="Savings Rate" 
        value={savings + '%'} 
        delta="Goal: 30%" 
        up={true} 
        color="var(--color-dashboard-info)" 
        icon="star" 
        bgColor="rgba(90, 159, 212, 0.12)"
        delay="0.3s"
        empty={isAllEmpty}
        onAction={onAdd}
      />
    </div>
  );
}
