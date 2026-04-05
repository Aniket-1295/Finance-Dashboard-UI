import React, { useMemo, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { SummaryGrid } from './components/dashboard/StatCards';
import { TrendChart, SpendingDonut } from './components/dashboard/Charts';
import { TransactionTable } from './components/transactions/TransactionTable';
import { InsightsGrid } from './components/insights/InsightsGrid';
import { Modal } from './components/ui/Modal';
import { Toast } from './components/ui/Toast';
import { TxForm } from './components/transactions/TxForm';
import { useAppContext } from './context/AppContext';
import { fmtAbs } from './utils/formatters';
import { cn } from './lib/utils';
import { getLastNMonthsData } from './utils/dataUtils';
import { 
  Plus,
  MoreHorizontal,
  Utensils
} from 'lucide-react';
import { 
  PremiumFood,
  PremiumTransport,
  PremiumShopping,
  PremiumHome,
  PremiumEntertainment,
  PremiumHealthcare,
  PremiumUtilities,
  PremiumSalary,
  PremiumFreelance,
  PremiumInvestment
} from './components/ui/PremiumIcons';

const CATEGORY_ICONS = {
  'Food & Dining': PremiumFood,
  'Transport': PremiumTransport,
  'Shopping': PremiumShopping,
  'Housing': PremiumHome,
  'Entertainment': PremiumEntertainment,
  'Healthcare': PremiumHealthcare,
  'Utilities': PremiumUtilities,
  'Salary': PremiumSalary,
  'Freelance': PremiumFreelance,
  'Investments': PremiumInvestment,
};

const PREM_GRADIENTS = [
  "bg-gradient-to-br from-[#45dfd7] to-[#2bd1d0]",
  "bg-gradient-to-br from-[#8db1fb] to-[#6c8cf4]",
  "bg-gradient-to-br from-[#fca3bf] to-[#f66a98]",
  "bg-gradient-to-br from-[#d0a7fc] to-[#b385fb]",
  "bg-gradient-to-br from-[#ffb067] to-[#ff9838]"
];

function App() {
  const {
    view, 
    setView,
    theme, 
    transactions, 
    modalType, 
    setModalType,
    selectedTx,
    setSelectedTx,
    toast,
    setToast,
    metrics,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isAdmin,
    sidebarOpen,
    setSidebarOpen,
    handleExport
  } = useAppContext();

  // Apply theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Range text for chart decoration
  const chartRange = useMemo(() => {
    const months = getLastNMonthsData(transactions, 6);
    if (months.length === 0) return 'No data';
    const start = months[0];
    const end = months[months.length - 1];
    if (start.year === end.year) {
      return `${start.label} – ${end.label} ${start.year}`;
    }
    return `${start.label} ${start.year} – ${end.label} ${end.year}`;
  }, [transactions]);

  // Handlers
  const handleDeleteTx = (id) => {
    deleteTransaction(id);
  };

  return (
    <div className={cn(
      "min-h-screen font-inter transition-all duration-500 ease-in-out selection:bg-dashboard-accent/30 selection:text-dashboard-accent bg-dashboard-bg",
      theme === 'dark' ? "dark" : ""
    )}>
      <Sidebar />

      <div className="lg:ml-[240px] min-h-screen flex flex-col">
        <Topbar />

        <main className="flex-1 p-6 lg:p-12 w-full bg-dashboard-island lg:rounded-tl-[40px] shadow-[inset_0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-300">
          {view === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
              <div className="xl:col-span-4 mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-dashboard-text tracking-tight mb-1">Financial Overview</h2>
                  <div className="flex items-center gap-2 text-sm text-dashboard-text-muted font-medium">
                    <span className="text-dashboard-text">Home</span>
                    <span className="opacity-50 text-[10px]">›</span>
                    <span>Overview</span>
                  </div>
                </div>
              </div>

              <SummaryGrid />
              
              <div className="xl:col-span-4 grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-3 bg-dashboard-bg-secondary border border-dashboard-border shadow-sm rounded-dashboard p-6 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-dashboard-text">Income vs Expenses</h3>
                      <p className="text-xs text-dashboard-text-dim uppercase tracking-wider mt-1">6-month trend · {chartRange}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs uppercase font-bold tracking-widest text-dashboard-text-dim">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-dashboard-success shadow-[0_0_8px_rgba(76,175,133,0.4)]" /> Income</div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-dashboard-danger shadow-[0_0_8px_rgba(224,92,106,0.4)]" /> Expenses</div>
                    </div>
                  </div>
                  <div className="h-[260px]">
                    <TrendChart />
                  </div>
                </div>

                <div className="xl:col-span-2 bg-dashboard-bg-secondary border border-dashboard-border shadow-sm rounded-dashboard p-6 transition-all hover:shadow-md flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-dashboard-text mb-1">Spending</h3>
                      <p className="text-xs text-dashboard-text-dim uppercase tracking-wider">By category</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <SpendingDonut />
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4 bg-dashboard-bg-secondary border border-dashboard-border shadow-sm rounded-dashboard p-6 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-dashboard-text">Activity manager</h3>
                    <p className="text-xs text-dashboard-text-dim uppercase tracking-wider mt-1">
                      {transactions.length === 0 ? "No active records" : "Recent transactions"}
                    </p>
                  </div>
                  {transactions.length > 0 && (
                    <button 
                      onClick={() => setView('transactions')}
                      className="text-xs font-semibold text-dashboard-text hover:text-dashboard-accent transition-colors px-4 py-2 rounded-full border border-dashboard-border hover:bg-dashboard-bg-tertiary"
                    >
                      View all activities
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 5).map((t, idx) => {
                      const Icon = CATEGORY_ICONS[t.category] || Utensils;
                      const bgGradient = PREM_GRADIENTS[idx % 5];
                      return (
                        <div key={t.id} className={cn("relative flex flex-col p-5 rounded-[24px] overflow-hidden group transition-all duration-300 ease-out hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-in fade-in slide-in-from-bottom-4 fill-both text-white", bgGradient)} style={{ animationDelay: `${idx * 0.05}s` }}>
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-center justify-between mb-5">
                              <div className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-sm bg-white/20 backdrop-blur-sm">
                                <Icon className="w-5 h-5 text-white opacity-90" strokeWidth={2.5} />
                              </div>
                              <div 
                                onClick={() => { setSelectedTx(t); setModalType('edit'); }}
                                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/90 cursor-pointer transition-colors shadow-sm bg-white/10 backdrop-blur-sm"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </div>
                            </div>
                            <div>
                              <div className="font-sora text-[22px] tracking-tight font-extrabold mb-1.5 text-white">
                                {t.type === 'income' ? '+' : '-'}₹{fmtAbs(t.amount).replace('₹', '')}
                              </div>
                              <div className="text-[13px] font-bold text-white/90 tracking-wide truncate">{t.merchant}</div>
                              <div className="flex items-center gap-1.5 mt-2">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-white/95 px-2 py-0.5 bg-white/25 rounded-md backdrop-blur-sm shadow-sm">
                                  {t.category}
                                </div>
                                <span className="text-white/60 text-[10px]">•</span>
                                <div className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
                                  {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-dashboard-bg-tertiary rounded-full flex items-center justify-center mb-4 text-2xl opacity-50 shadow-sm">💸</div>
                      <h4 className="text-lg font-bold text-dashboard-text mb-2">Your ledger is empty</h4>
                      <p className="text-sm text-dashboard-text-dim max-w-[250px] mb-6">Add your first transaction to populate activity.</p>
                      <button 
                        onClick={() => setModalType('add')}
                        className="text-sm font-bold bg-dashboard-accent text-white px-6 py-3 rounded-full hover:bg-dashboard-accent-muted transition-all shadow-md shadow-dashboard-accent/30"
                      >
                        Create Transaction
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === 'transactions' && (
            <div className="animate-in slide-in-from-right-4 duration-500">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                 <div>
                   <h2 className="text-3xl font-bold text-dashboard-text tracking-tight mb-1">Transaction Ledger</h2>
                   <p className="text-sm text-dashboard-text-muted font-medium">Complete record of every inflow & outflow</p>
                 </div>
                 {isAdmin && (
                    <button 
                      onClick={() => setModalType('add')}
                      className="bg-dashboard-accent hover:bg-dashboard-accent-muted text-white px-6 py-3 rounded-2xl text-[13px] font-bold transition-all shadow-xl shadow-dashboard-accent/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                      ADD TRANSACTION
                    </button>
                  )}
               </div>
               <div className="bg-dashboard-bg-secondary border border-dashboard-border shadow-sm rounded-[32px] p-8">
                 <TransactionTable />
               </div>
            </div>
          )}

          {view === 'insights' && (
            <div className="animate-in slide-in-from-right-4 duration-500">
               <div className="mb-10">
                 <h2 className="text-3xl font-bold text-dashboard-text tracking-tight mb-1">Advanced Insights</h2>
                 <p className="text-sm text-dashboard-text-muted font-medium">Deep analysis of your capital momentum</p>
               </div>
               <InsightsGrid />
            </div>
          )}
        </main>
      </div>

      <Modal 
        isOpen={!!modalType} 
        onClose={() => { setModalType(null); setSelectedTx(null); }}
        title={modalType === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TxForm />
      </Modal>

      {toast && (
        <Toast toast={toast} onDone={() => setToast(null)} />
      )}
    </div>
  );
}

export default App;