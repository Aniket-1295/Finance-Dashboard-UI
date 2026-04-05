import React from 'react';
import { 
  Trophy, 
  PiggyBank, 
  BarChart3, 
  TrendingUp, 
  Scale, 
  Target,
  Briefcase,
  PieChart
} from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { fmtAbs } from '../../utils/formatters';
import { cn } from '../../lib/utils';
import { getLastNMonthsData } from '../../utils/dataUtils';

export function InsightCard({ icon: Icon, title, value, sub, color, delay = "0s" }) {
// ... existing InsightCard code ...
  return (
    <div 
      className="bg-dashboard-bg-secondary border border-dashboard-border rounded-dashboard p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-both transition-all hover:bg-dashboard-bg-tertiary/30"
      style={{ animationDelay: delay }}
    >
      <div className="w-9 h-9 rounded-full bg-dashboard-bg-tertiary flex items-center justify-center mb-4 text-dashboard-text-muted">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="text-[11px] font-medium tracking-wider uppercase text-dashboard-text-dim mb-1">
        {title}
      </div>
      <div className="text-xl font-semibold text-dashboard-text mb-0.5" style={color ? { color } : {}}>
        {value}
      </div>
      <div className="text-xs text-dashboard-text-muted">
        {sub}
      </div>
    </div>
  );
}

export function InsightsGrid({ transactions = [], spendByCategory = [], topCategory, income, expense, savings }) {
  const monthlyData = React.useMemo(() => getLastNMonthsData(transactions, 6), [transactions]);
  const maxV = React.useMemo(() => {
    const vals = monthlyData.flatMap(m => [m.income, m.expense]);
    return Math.max(...vals, 1000); // at least 1k for scale
  }, [monthlyData]);

  if (transactions.length === 0) {
// ... existing empty state ...
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-dashboard-bg-secondary border border-dashboard-border border-dashed rounded-dashboard animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-dashboard-bg-tertiary rounded-full flex items-center justify-center mb-6 text-3xl">🕳️</div>
        <h3 className="text-lg font-semibold text-dashboard-text mb-2">No data to analyze</h3>
        <p className="text-sm text-dashboard-text-dim text-center max-w-sm leading-relaxed">
          The Insights engine needs transaction data to calculate spending patterns and savings goals.
        </p>
      </div>
    );
  }

  const avgTx = transactions.length 
    ? (transactions.reduce((s, t) => s + Math.abs(t.amount), 0) / transactions.length).toFixed(2) 
    : '0';
  
  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  
  const maxCatVal = spendByCategory[0]?.[1] || 1;

  return (
    <div className="space-y-6">
{/* ... Summary Cards ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InsightCard 
          icon={Trophy}
          title="Highest Spending Category"
          value={topCategory?.[0] || '—'}
          sub={topCategory ? `${fmtAbs(topCategory[1])} total spent` : 'No expenses yet'}
          color={topCategory ? CATEGORIES[topCategory[0]]?.color : undefined}
          delay="0s"
        />
        <InsightCard 
          icon={PiggyBank}
          title="Savings Rate"
          value={`${savings}%`}
          sub={savings >= 20 ? '✦ On track for healthy savings' : '⚠ Below 20% savings goal'}
          color="var(--color-dashboard-success)"
          delay="0.05s"
        />
        <InsightCard 
          icon={BarChart3}
          title="Avg. Transaction"
          value={`₹${avgTx}`}
          sub={`${transactions.length} total transactions`}
          delay="0.1s"
        />
        <InsightCard 
          icon={TrendingUp}
          title="Income Streams"
          value={incomeCount}
          sub={`${incomeCount} income · ${expenseCount} expenses`}
          color="var(--color-dashboard-info)"
          delay="0.15s"
        />
        <InsightCard 
          icon={Scale}
          title="Net Cash Flow"
          value={(income >= expense ? '+' : '-') + fmtAbs(income - expense)}
          sub={income >= expense ? 'Positive cash flow' : 'Spending exceeds income'}
          color={income >= expense ? 'var(--color-dashboard-success)' : 'var(--color-dashboard-danger)'}
          delay="0.2s"
        />
        <InsightCard 
          icon={Target}
          title="Monthly Budget Usage"
          value={`${income > 0 ? (expense / income * 100).toFixed(0) : 0}%`}
          sub="of income spent this period"
          color="var(--color-dashboard-accent)"
          delay="0.25s"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-dashboard-bg-secondary border border-dashboard-border rounded-dashboard p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-dashboard-accent" />
            <div>
              <h3 className="text-sm font-semibold text-dashboard-text">Spending by Category</h3>
              <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider mt-0.5">Full breakdown</p>
            </div>
          </div>

          <div className="space-y-4">
            {spendByCategory.length > 0 ? (
              spendByCategory.map(([cat, val], idx) => (
                <div key={cat} className="space-y-1.5 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-dashboard-text font-medium">{cat}</span>
                    <span className="text-dashboard-text-muted font-mono">{fmtAbs(val)}</span>
                  </div>
                  <div className="h-1.5 bg-dashboard-bg-tertiary rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(val / maxCatVal * 100).toFixed(1)}%`,
                        backgroundColor: CATEGORIES[cat]?.color
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-dashboard-text-dim">No category data available</div>
            )}
          </div>
        </div>

        <div className="bg-dashboard-bg-secondary border border-dashboard-border rounded-dashboard p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-dashboard-accent" />
            <div>
              <h3 className="text-sm font-semibold text-dashboard-text">Monthly Comparison</h3>
              <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider mt-0.5">Income vs Expenses</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {monthlyData.map((m, i) => (
              <div key={m.key} className="space-y-2">
                <div className="text-[10px] font-bold text-dashboard-text-dim uppercase">{m.label} {m.year}</div>
                <div className="grid grid-cols-[60px_1fr_60px] gap-3 items-center">
                  <span className="text-[10px] text-dashboard-success font-medium">Income</span>
                  <div className="h-1.5 bg-dashboard-bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full bg-dashboard-success rounded-full" style={{ width: `${(m.income/maxV*100).toFixed(1)}%` }} />
                  </div>
                  <span className="text-[10px] text-dashboard-text-muted font-mono text-right">₹{(m.income/1000).toFixed(1)}k</span>
                </div>
                <div className="grid grid-cols-[60px_1fr_60px] gap-3 items-center">
                  <span className="text-[10px] text-dashboard-danger font-medium">Expense</span>
                  <div className="h-1.5 bg-dashboard-bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full bg-dashboard-danger rounded-full" style={{ width: `${(m.expense/maxV*100).toFixed(1)}%` }} />
                  </div>
                  <span className="text-[10px] text-dashboard-text-muted font-mono text-right">₹{(m.expense/1000).toFixed(1)}k</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dashboard-bg-secondary border border-dashboard-border rounded-dashboard p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-dashboard-info" />
            <div>
              <h3 className="text-sm font-semibold text-dashboard-text">Detailed Statistics</h3>
              <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider mt-0.5">Budget metrics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-dashboard-bg-tertiary/30 rounded-lg border border-dashboard-border">
              <div className="text-[10px] text-dashboard-text-dim uppercase mb-1">Total Income</div>
              <div className="text-lg font-mono text-dashboard-success">{fmtAbs(income)}</div>
            </div>
            <div className="p-4 bg-dashboard-bg-tertiary/30 rounded-lg border border-dashboard-border">
              <div className="text-[10px] text-dashboard-text-dim uppercase mb-1">Total Expenses</div>
              <div className="text-lg font-mono text-dashboard-danger">{fmtAbs(expense)}</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-dashboard-accent-soft/20 border border-dashboard-accent/10">
            <div className="text-xs text-dashboard-text leading-relaxed">
              Based on your current spending, you have <span className="font-semibold text-dashboard-accent">{savings}%</span> of your income left. 
              {savings < 20 ? " You're below your 20% savings target. Consider reviewing non-essential categories like Shopping or Entertainment." : " Great job! You're meeting your savings goals for this month."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
