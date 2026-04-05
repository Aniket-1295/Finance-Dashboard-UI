import React from 'react';
import { 
  PremiumIncome, 
  PremiumSavings, 
  PremiumInvestment, 
  PremiumTrophy, 
  PremiumTarget, 
  PremiumScale,
  PremiumSalary
} from '../ui/PremiumIcons';
import { 
  BarChart3, 
  PieChart,
  Briefcase
} from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { fmtAbs } from '../../utils/formatters';
import { cn } from '../../lib/utils';
import { getLastNMonthsData } from '../../utils/dataUtils';
import { useAppContext } from '../../context/AppContext';

export function InsightCard({ icon: Icon, title, value, sub, color, delay = "0s", bgGradient }) {
  return (
    <div 
      className={cn(
        "relative rounded-[22px] p-6 transition-all duration-300 ease-out overflow-hidden group animate-in fade-in slide-in-from-bottom-4 fill-both border border-dashboard-border shadow-sm hover:shadow-md",
        bgGradient ? `${bgGradient} text-white border-transparent` : "bg-dashboard-bg-secondary text-dashboard-text"
      )}
      style={{ animationDelay: delay }}
    >
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        bgGradient ? "bg-white/5" : "bg-dashboard-accent/5"
      )} />
      
      <div className="relative z-10">
        <div className={cn(
          "w-11 h-11 rounded-[14px] flex items-center justify-center mb-6 transition-transform group-hover:scale-105 shadow-sm",
          bgGradient ? "bg-white/20 backdrop-blur-sm" : "bg-dashboard-bg-tertiary"
        )}>
          <Icon className={cn("w-5 h-5", bgGradient ? "text-white" : "text-dashboard-accent")} strokeWidth={2.5} />
        </div>
        
        <div className={cn(
          "text-[11px] font-bold tracking-wider uppercase mb-1.5",
          bgGradient ? "text-white/80" : "text-dashboard-text-dim"
        )}>
          {title}
        </div>
        <div className={cn(
          "text-2xl font-sora font-extrabold tracking-tight mb-1",
          bgGradient ? "text-white" : ""
        )} style={(!bgGradient && color) ? { color } : {}}>
          {value}
        </div>
        <div className={cn(
          "text-[12px] font-medium",
          bgGradient ? "text-white/70" : "text-dashboard-text-muted"
        )}>
          {sub}
        </div>
      </div>
    </div>
  );
}

export function InsightsGrid() {
  const { transactions, metrics } = useAppContext();
  const { spendByCategory, income, expense, savings } = metrics;
  const topCategory = spendByCategory[0];
  const monthlyData = React.useMemo(() => getLastNMonthsData(transactions, 6), [transactions]);
  const maxV = React.useMemo(() => {
    const vals = monthlyData.flatMap(m => [m.income, m.expense]);
    return Math.max(...vals, 1000);
  }, [monthlyData]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 bg-dashboard-bg-secondary border border-dashboard-border border-dashed rounded-[32px] animate-in fade-in zoom-in duration-500 shadow-sm">
        <div className="w-20 h-20 bg-dashboard-bg-tertiary rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">🕳️</div>
        <h3 className="text-xl font-bold text-dashboard-text mb-2">No data to analyze</h3>
        <p className="text-sm text-dashboard-text-muted text-center max-w-sm leading-relaxed">
          The Insights engine needs transaction data to calculate spending patterns and savings goals.
        </p>
      </div>
    );
  }

  const avgTx = transactions.length 
    ? (transactions.reduce((s, t) => s + Math.abs(t.amount), 0) / transactions.length).toFixed(0) 
    : '0';
  
  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  
  const maxCatVal = spendByCategory[0]?.[1] || 1;

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightCard 
          icon={PremiumTrophy}
          title="Top Spending Category"
          value={topCategory?.[0] || '—'}
          sub={topCategory ? `₹${fmtAbs(topCategory[1]).replace('₹', '')} total spent` : 'No expenses yet'}
          color={topCategory ? CATEGORIES[topCategory[0]]?.color : undefined}
          delay="0s"
        />
        <InsightCard 
          icon={PremiumSavings}
          title="Savings Performance"
          value={`${savings}%`}
          sub={savings >= 20 ? '✦ Healthy savings rate' : '⚠ Below benchmark (20%)'}
          bgGradient={savings >= 20 ? "bg-gradient-to-br from-[#d0a7fc] to-[#b385fb]" : undefined}
          delay="0.05s"
        />
        <InsightCard 
          icon={BarChart3}
          title="Avg. Transaction"
          value={`₹${avgTx}`}
          sub={`${transactions.length} transactions analyzed`}
          delay="0.1s"
        />
        <InsightCard 
          icon={PremiumIncome}
          title="Revenue Streams"
          value={incomeCount}
          sub={`${incomeCount} income sources found`}
          bgGradient="bg-gradient-to-br from-[#45dfd7] to-[#2bd1d0]"
          delay="0.15s"
        />
        <InsightCard 
          icon={PremiumScale}
          title="Net Cash Flow"
          value={(income >= expense ? '+' : '-') + '₹' + fmtAbs(income - expense).replace('₹', '')}
          sub={income >= expense ? 'Monthly surplus detected' : 'Spending outpaces income'}
          color={income >= expense ? 'var(--color-dashboard-success)' : 'var(--color-dashboard-danger)'}
          delay="0.2s"
        />
        <InsightCard 
          icon={PremiumTarget}
          title="Budget Utilization"
          value={`${income > 0 ? (expense / income * 100).toFixed(0) : 0}%`}
          sub="of available monthly budget"
          delay="0.25s"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-dashboard-bg-secondary border border-dashboard-border shadow-sm rounded-[24px] p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-dashboard-accent-soft flex items-center justify-center text-dashboard-accent shadow-sm">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-dashboard-text">Category Distribution</h3>
              <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider">Spending breakdown</p>
            </div>
          </div>

          <div className="space-y-5">
            {spendByCategory.length > 0 ? (
              spendByCategory.map(([cat, val], idx) => (
                <div key={cat} className="space-y-2 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-dashboard-text font-bold">{cat}</span>
                    <span className="text-dashboard-text font-mono font-bold">₹{fmtAbs(val).replace('₹', '')}</span>
                  </div>
                  <div className="h-2 bg-dashboard-bg-tertiary rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(val / maxCatVal * 100).toFixed(1)}%`,
                        backgroundColor: CATEGORIES[cat]?.color || 'var(--color-dashboard-accent)'
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-xs text-dashboard-text-dim border-2 border-dashed border-dashboard-border rounded-xl">No category data available</div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 bg-dashboard-bg-secondary border border-dashboard-border shadow-sm rounded-[24px] p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-dashboard-bg-tertiary flex items-center justify-center text-dashboard-text-muted shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-dashboard-text">Monthly Momentum</h3>
              <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider">Performance over time</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {monthlyData.map((m, i) => (
              <div key={m.key} className="space-y-3">
                <div className="text-[11px] font-bold text-dashboard-text tracking-widest uppercase flex items-center gap-2">
                   <div className="w-1 h-4 bg-dashboard-accent-muted rounded-full" />
                   {m.label} {m.year}
                </div>
                <div className="grid grid-cols-[80px_1fr_80px] gap-4 items-center">
                  <span className="text-[10px] text-dashboard-success font-bold uppercase tracking-tighter">Income</span>
                  <div className="h-1.5 bg-dashboard-bg-tertiary rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-dashboard-success rounded-full opacity-80" style={{ width: `${(m.income/maxV*100).toFixed(1)}%` }} />
                  </div>
                  <span className="text-[11px] text-dashboard-text font-mono font-bold text-right">₹{(m.income/1000).toFixed(1)}k</span>
                </div>
                <div className="grid grid-cols-[80px_1fr_80px] gap-4 items-center">
                  <span className="text-[10px] text-dashboard-danger font-bold uppercase tracking-tighter">Expense</span>
                  <div className="h-1.5 bg-dashboard-bg-tertiary rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-dashboard-danger rounded-full opacity-80" style={{ width: `${(m.expense/maxV*100).toFixed(1)}%` }} />
                  </div>
                  <span className="text-[11px] text-dashboard-text font-mono font-bold text-right">₹{(m.expense/1000).toFixed(1)}k</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 bg-dashboard-bg-secondary border border-dashboard-border shadow-sm rounded-[24px] p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-[#0ea5e9] shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-dashboard-text">Executive Summary</h3>
              <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider">Key performance indicators</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-dashboard-bg-tertiary/40 rounded-[20px] border border-dashboard-border hover:border-dashboard-success/20 transition-colors group">
                  <div className="text-[10px] text-dashboard-text-dim font-bold uppercase mb-2 tracking-widest">Total Income</div>
                  <div className="text-[22px] font-sora font-extrabold text-dashboard-success group-hover:scale-105 transition-transform origin-left">{fmtAbs(income)}</div>
                </div>
                <div className="p-5 bg-dashboard-bg-tertiary/40 rounded-[20px] border border-dashboard-border hover:border-dashboard-danger/20 transition-colors group">
                  <div className="text-[10px] text-dashboard-text-dim font-bold uppercase mb-2 tracking-widest">Total Expenses</div>
                  <div className="text-[22px] font-sora font-extrabold text-dashboard-danger group-hover:scale-105 transition-transform origin-left">{fmtAbs(expense)}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="p-6 rounded-[22px] bg-dashboard-accent-soft/30 border border-dashboard-accent/10 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-dashboard-accent/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 text-sm text-dashboard-text leading-relaxed font-medium">
                  Analysis indicates you have preserved <span className="font-bold text-dashboard-accent text-lg">{savings}%</span> of your gross income. 
                  {savings < 20 
                    ? " This is currently below the 20% target. Optimizing discretionary spending in non-essential categories could significantly boost your long-term capital." 
                    : " Exceptional management. You are successfully maintaining a sustainable capital accumulation rate above standard benchmarks."
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
