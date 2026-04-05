import React from 'react';
import { 
  PremiumWallet, 
  PremiumIncome, 
  PremiumExpense, 
  PremiumSavings 
} from '../ui/PremiumIcons';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Briefcase
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';
import { fmtAbs } from '../../utils/formatters';

const ICON_MAP = {
  'briefcase': PremiumWallet,
  'trending-up': PremiumIncome,
  'trending-down': PremiumExpense,
  'piggy-bank': PremiumSavings,
};

export function StatCard({ label, value, delta, up, icon, bgGradient, delay = "0s", empty = false, onAction }) {
  const Icon = ICON_MAP[icon] || Briefcase;
  const TrendIcon = up ? ArrowUpRight : ArrowDownRight;
  const deltaValue = delta.split(' ')[0];
  const deltaText = delta.substring(delta.indexOf(' ') + 1);

  return (
    <div 
      className={cn(
        "relative rounded-[22px] p-6 transition-all duration-300 ease-out text-white overflow-hidden group animate-in fade-in slide-in-from-bottom-4 fill-both",
        empty ? "opacity-60 bg-dashboard-bg-secondary" : `shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 ${bgGradient}`
      )}
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-white/20 backdrop-blur-sm shrink-0 shadow-sm transition-transform group-hover:scale-105 mb-6">
          <Icon className="w-[22px] h-[22px] text-white opacity-90" strokeWidth={2.5} />
        </div>

        <div>
           <div className="text-[13px] font-semibold tracking-wide text-white/90 mb-1.5">
             {label}
           </div>
          <div className="font-sora text-[32px] leading-tight font-bold tracking-tight mb-3">
            <span className="text-white/80 font-medium mr-1">₹</span>
            {empty ? "0.00" : value.toString().replace('₹', '')}
          </div>

          {!empty && (
            <div className="flex items-center gap-2 text-[11.5px] font-semibold mt-1">
              <div className="px-2 py-0.5 rounded-[6px] bg-white/25 flex items-center gap-1 backdrop-blur-sm shadow-sm text-white/95">
                {up ? '+' : ''}{deltaValue}
                <TrendIcon className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <span className="text-white/80 font-medium">{deltaText}</span>
            </div>
          )}

          {empty && (
            <button 
              onClick={onAction}
              className="mt-4 text-[11px] font-bold uppercase tracking-wider text-white/90 hover:text-white transition-colors flex items-center gap-1"
            >
              Add first transaction →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SummaryGrid() {
  const { metrics, transactions, setModalType } = useAppContext();
  const isAllEmpty = transactions.length === 0;

  return (
    <>
      <StatCard 
        label="Total Balance" 
        value={fmtAbs(metrics.balance)} 
        delta={`${Math.abs(metrics.deltas.balance)}% than last month`} 
        up={metrics.deltas.balance >= 0} 
        icon="briefcase" 
        bgGradient="bg-gradient-to-br from-[#45dfd7] to-[#2bd1d0]"
        delay="0s"
        empty={isAllEmpty}
        onAction={() => setModalType('add')}
      />
      <StatCard 
        label="Total Income" 
        value={fmtAbs(metrics.income)} 
        delta={`${Math.abs(metrics.deltas.income)}% than last month`} 
        up={metrics.deltas.income >= 0} 
        icon="trending-up" 
        bgGradient="bg-gradient-to-br from-[#8db1fb] to-[#6c8cf4]"
        delay="0.1s"
        empty={isAllEmpty}
        onAction={() => setModalType('add')}
      />
      <StatCard 
        label="Total Expenses" 
        value={fmtAbs(metrics.expense)} 
        delta={`${Math.abs(metrics.deltas.expense)}% than last month`} 
        up={metrics.deltas.expense >= 0} 
        icon="trending-down" 
        bgGradient="bg-gradient-to-br from-[#fca3bf] to-[#f66a98]"
        delay="0.2s"
        empty={isAllEmpty}
        onAction={() => setModalType('add')}
      />
      <StatCard 
        label="Total Savings" 
        value={metrics.savings + '%'} 
        delta={`${Math.abs(metrics.deltas.savings)}% than last month`} 
        up={metrics.deltas.savings >= 0} 
        icon="piggy-bank" 
        bgGradient="bg-gradient-to-br from-[#d0a7fc] to-[#b385fb]"
        delay="0.3s"
        empty={isAllEmpty}
        onAction={() => setModalType('add')}
      />
    </>
  );
}

