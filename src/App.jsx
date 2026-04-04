import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { SummaryGrid } from './components/dashboard/StatCards';
import { TrendChart, SpendingDonut } from './components/dashboard/Charts';
import { TransactionTable } from './components/transactions/TransactionTable';
import { InsightsGrid } from './components/insights/InsightsGrid';
import { Modal } from './components/ui/Modal';
import { Toast } from './components/ui/Toast';
import { TxForm } from './components/transactions/TxForm';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SEED_TRANSACTIONS, CATEGORIES } from './utils/constants';
import { fmtAbs } from './utils/formatters';
import { cn } from './lib/utils';
import { getLastNMonthsData } from './utils/dataUtils';
import { 
  ShoppingBag, 
  Utensils, 
  Car, 
  Home, 
  Film, 
  Activity, 
  Zap, 
  Briefcase, 
  Laptop, 
  TrendingUp 
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Food & Dining': Utensils,
  'Transport': Car,
  'Shopping': ShoppingBag,
  'Housing': Home,
  'Entertainment': Film,
  'Healthcare': Activity,
  'Utilities': Zap,
  'Salary': Briefcase,
  'Freelance': Laptop,
  'Investments': TrendingUp,
};

function App() {
  const [theme, setTheme] = useLocalStorage('finio-theme', 'dark');
  const [role, setRole] = useLocalStorage('finio-role', 'admin');
  const [transactions, setTransactions] = useLocalStorage('finio-txns', SEED_TRANSACTIONS);
  const [view, setView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Table state
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // Modal & Toast state
  const [modalType, setModalType] = useState(null); // 'add' | 'edit'
  const [editingTx, setEditingTx] = useState(null);
  const [toast, setToast] = useState(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const isAdmin = role === 'admin';

  // Metrics
  const metrics = useMemo(() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    const bal = inc - exp;
    const sav = inc > 0 ? (((inc - exp) / inc) * 100).toFixed(1) : '0.0';
    
    const byCat = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount);
    });
    const sortedCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    
    return { income: inc, expense: exp, balance: bal, savings: sav, spendByCategory: sortedCats };
  }, [transactions]);

  // Filtering & Sorting
  const filteredTransactions = useMemo(() => {
    let arr = [...transactions];
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter(t => t.merchant.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    }
    if (filterCat !== 'all') {
      arr = arr.filter(t => t.category === filterCat);
    }
    if (filterType !== 'all') {
      arr = arr.filter(t => t.type === filterType);
    }

    arr.sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === 'amount') { av = Math.abs(a.amount); bv = Math.abs(b.amount); }
      if (sortDir === 'asc') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
    return arr;
  }, [transactions, search, filterCat, filterType, sortField, sortDir]);

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

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PER_PAGE));
  const paginatedTransactions = filteredTransactions.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Handlers
  const handleSaveTx = (tx) => {
    setTransactions(prev => {
      const idx = prev.findIndex(t => t.id === tx.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = tx;
        return next;
      }
      return [tx, ...prev];
    });
    setModalType(null);
    setEditingTx(null);
    setToast({ 
      title: editingTx ? 'Transaction updated' : 'Transaction added', 
      body: `${tx.merchant} · ${fmtAbs(tx.amount)}` 
    });
  };

  const handleDeleteTx = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setToast({ title: 'Transaction deleted', body: 'The record has been removed.' });
  };

  const handleExport = (format) => {
    const data = format === 'csv' 
      ? "Date,Merchant,Category,Type,Amount\n" + filteredTransactions.map(t => `${t.date},${t.merchant},${t.category},${t.type},${t.amount}`).join("\n")
      : JSON.stringify(filteredTransactions, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finio-export.${format}`;
    a.click();
    setToast({ title: 'Export successful', body: `${filteredTransactions.length} items exported as ${format.toUpperCase()}.` });
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const sortIcon = (f) => {
    if (sortField !== f) return <span className="opacity-20 text-[10px]">↕</span>;
    return <span className="text-dashboard-accent text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text font-sora selection:bg-dashboard-accent/30 selection:text-dashboard-accent">
      <Sidebar 
        view={view} 
        setView={setView} 
        role={role} 
        setRole={setRole} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <div className="lg:ml-[220px] min-h-screen flex flex-col">
        <Topbar 
          view={view} 
          theme={theme} 
          setTheme={setTheme} 
          onAdd={() => setModalType('add')} 
          onExport={handleExport}
          isAdmin={isAdmin}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          {view === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-700">
              <SummaryGrid 
                balance={fmtAbs(metrics.balance)} 
                income={fmtAbs(metrics.income)} 
                expense={fmtAbs(metrics.expense)} 
                savings={metrics.savings} 
                isAllEmpty={transactions.length === 0}
                onAdd={() => setModalType('add')}
              />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-dashboard-bg-secondary border border-dashboard-border rounded-dashboard p-6 transition-all hover:border-dashboard-border-strong">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-sm font-semibold text-dashboard-text">Income vs Expenses</h3>
                      <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider mt-1">6-month trend · {chartRange}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase font-medium tracking-widest text-dashboard-text-dim">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-dashboard-success shadow-[0_0_8px_rgba(76,175,133,0.4)]" /> Income</div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-dashboard-danger shadow-[0_0_8px_rgba(224,92,106,0.4)]" /> Expenses</div>
                    </div>
                  </div>
                  <div className="h-[240px]">
                    <TrendChart theme={theme} transactions={transactions} />
                  </div>
                </div>

                <div className="bg-dashboard-bg-secondary border border-dashboard-border rounded-dashboard p-6 transition-all hover:border-dashboard-border-strong">
                  <h3 className="text-sm font-semibold text-dashboard-text mb-1">Spending Breakdown</h3>
                  <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider mb-8">By category · current period</p>
                  <SpendingDonut transactions={transactions} theme={theme} />
                </div>
              </div>

              <div className="bg-dashboard-bg-secondary border border-dashboard-border rounded-dashboard p-6 transition-all hover:border-dashboard-border-strong">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-dashboard-text">Recent Transactions</h3>
                    <p className="text-[11px] text-dashboard-text-dim uppercase tracking-wider mt-1">
                      {transactions.length === 0 ? "No active records" : "Last 5 activities"}
                    </p>
                  </div>
                  {transactions.length > 0 && (
                    <button 
                      onClick={() => setView('transactions')}
                      className="text-xs font-semibold text-dashboard-accent hover:text-dashboard-accent-muted transition-colors px-3 py-1.5 rounded-full bg-dashboard-accent-soft hover:bg-dashboard-accent/20"
                    >
                      View all →
                    </button>
                  )}
                </div>
                
                <div className="grid gap-1">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 5).map((t, idx) => {
                      const Icon = CATEGORY_ICONS[t.category] || Utensils;
                      return (
                        <div key={t.id} className="flex items-center justify-between py-3.5 border-b border-dashboard-border last:border-0 hover:bg-dashboard-text-[0.02] transition-all px-3 rounded-xl group animate-in fade-in slide-in-from-left-4 fill-both" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                              style={{ backgroundColor: CATEGORIES[t.category]?.light, color: CATEGORIES[t.category]?.color }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-dashboard-text tracking-tight">{t.merchant}</div>
                              <div className="text-[11px] text-dashboard-text-dim font-medium">{t.category} · {t.date}</div>
                            </div>
                          </div>
                          <div className={cn(
                            "font-mono text-sm font-semibold tracking-tight",
                            t.type === 'income' ? "text-dashboard-success" : "text-dashboard-danger"
                          )}>
                            {t.type === 'income' ? '+' : '-'}{fmtAbs(t.amount)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-dashboard-bg-tertiary rounded-full flex items-center justify-center mb-4 text-xl opacity-50">💸</div>
                      <h4 className="text-sm font-semibold text-dashboard-text mb-1">Your ledger is empty</h4>
                      <p className="text-xs text-dashboard-text-dim max-w-[200px]">Add your first transaction to see the history here.</p>
                      <button 
                        onClick={() => setModalType('add')}
                        className="mt-4 text-[10px] font-bold uppercase tracking-widest text-dashboard-accent border border-dashboard-accent/30 px-4 py-2 rounded-lg hover:bg-dashboard-accent/10 transition-all"
                      >
                        + Create Transaction
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === 'transactions' && (
            <TransactionTable 
              paginated={paginatedTransactions}
              filtered={filteredTransactions}
              search={search}
              setSearch={setSearch}
              filterCat={filterCat}
              setFilterCat={setFilterCat}
              filterType={filterType}
              setFilterType={setFilterType}
              sortField={sortField}
              toggleSort={toggleSort}
              sortIcon={sortIcon}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              isAdmin={isAdmin}
              onEdit={(tx) => { setEditingTx(tx); setModalType('edit'); }}
              onDelete={handleDeleteTx}
            />
          )}

          {view === 'insights' && (
            <InsightsGrid 
              transactions={transactions}
              spendByCategory={metrics.spendByCategory}
              topCategory={metrics.spendByCategory[0]}
              income={metrics.income}
              expense={metrics.expense}
              savings={metrics.savings}
            />
          )}
        </main>
      </div>

      <Modal 
        isOpen={!!modalType} 
        onClose={() => { setModalType(null); setEditingTx(null); }}
        title={modalType === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TxForm 
          tx={editingTx} 
          onSave={handleSaveTx} 
          onClose={() => { setModalType(null); setEditingTx(null); }} 
        />
      </Modal>

      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}

export default App;