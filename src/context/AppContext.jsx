import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SEED_TRANSACTIONS } from '../utils/constants';
import { getLastNMonthsData } from '../utils/dataUtils';

const AppContext = createContext();

const PER_PAGE = 8;

export function AppProvider({ children }) {
  // Global States
  const [theme, setTheme] = useLocalStorage('finio-theme', 'light');
  const [role, setRole] = useLocalStorage('finio-role', 'admin');
  const [transactions, setTransactions] = useLocalStorage('finio-txns', SEED_TRANSACTIONS);
  const [view, setView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // UI States (Modals, Toasts, etc.)
  const [modalType, setModalType] = useState(null); 
  const [selectedTx, setSelectedTx] = useState(null);
  const [toast, setToast] = useState(null);

  // Table Filters & Sorting
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  // Computed Metrics (Memoized for Performance)
  const metrics = useMemo(() => {
    // Current Total Metrics
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const balance = income - expense;
    const savings = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
    
    // Spend by category logic
    const byCat = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount);
      });
    const spendByCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

    // MoM Calculation Logic
    const last2Months = getLastNMonthsData(transactions, 2);
    const deltas = { income: 0, expense: 0, balance: 0, savings: 0 };
    
    if (last2Months.length === 2) {
      const prev = last2Months[0]; // May
      const curr = last2Months[1]; // June
      
      const calcPct = (c, p) => p === 0 ? (c > 0 ? 100 : 0) : Math.round(((c - p) / Math.abs(p)) * 100);
      
      deltas.income = calcPct(curr.income, prev.income);
      deltas.expense = calcPct(curr.expense, prev.expense);
      deltas.balance = calcPct(curr.income - curr.expense, prev.income - prev.expense);
      
      const prevSav = prev.income > 0 ? Math.round(((prev.income - prev.expense) / prev.income) * 100) : 0;
      const currSav = curr.income > 0 ? Math.round(((curr.income - curr.expense) / curr.income) * 100) : 0;
      deltas.savings = currSav - prevSav; // Change in savings % point
    }

    return { balance, income, expense, savings, spendByCategory, deltas };
  }, [transactions]);

  // Derived Filtering & Pagination
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.merchant.toLowerCase().includes(search.toLowerCase()) || 
                           t.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = filterCat === 'all' || t.category === filterCat;
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesCat && matchesType;
    });
  }, [transactions, search, filterCat, filterType]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortField === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      } else {
        valA = Math.abs(valA);
        valB = Math.abs(valB);
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortField, sortDir]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return sortedTransactions.slice(start, start + PER_PAGE);
  }, [sortedTransactions, page]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PER_PAGE));

  // Handlers
  const addTransaction = (txn) => {
    const newTx = { ...txn, id: Date.now().toString() };
    setTransactions([newTx, ...transactions]);
    setToast({ title: 'Success', body: 'Transaction recorded successfully!' });
  };

  const updateTransaction = (id, updated) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updated } : t));
    setToast({ title: 'Success', body: 'Transaction updated!' });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setToast({ title: 'Deleted', body: 'Transaction record removed.' });
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const sortIcon = (f) => {
    if (sortField !== f) return <span className="opacity-20 text-[10px]">↕</span>;
    return <span className="text-dashboard-accent text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>;
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

  const value = {
    // State
    theme, setTheme,
    role, setRole,
    transactions, setTransactions,
    view, setView,
    sidebarOpen, setSidebarOpen,
    modalType, setModalType,
    selectedTx, setSelectedTx,
    toast, setToast,
    
    // Table States
    search, setSearch,
    filterCat, setFilterCat,
    filterType, setFilterType,
    sortField, setSortField,
    sortDir, setSortDir,
    page, setPage,
    PER_PAGE,
    totalPages,
    filteredTransactions,
    sortedTransactions,
    paginatedTransactions,

    // Metrics
    metrics,

    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toggleSort,
    sortIcon,
    handleExport,
    isAdmin: role === 'admin'
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
