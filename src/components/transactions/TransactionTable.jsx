import React from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { fmtAbs, fmtDate } from '../../utils/formatters';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

export function TransactionTable() {
  const { 
    paginatedTransactions: paginated, 
    filteredTransactions: filtered, 
    search, 
    setSearch, 
    filterCat, 
    setFilterCat, 
    filterType, 
    setFilterType, 
    sortField, 
    toggleSort, 
    sortIcon, 
    page, 
    setPage, 
    totalPages, 
    isAdmin,
    setSelectedTx,
    setModalType,
    deleteTransaction
  } = useAppContext();

  const onEdit = (tx) => {
    setSelectedTx(tx);
    setModalType('edit');
  };

  const onDelete = (id) => {
    deleteTransaction(id);
  };
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dashboard-text-dim" />
          <input
            className="w-full bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg pl-9 pr-4 py-2 text-sm text-dashboard-text placeholder:text-dashboard-text-dim outline-none focus:border-dashboard-accent/40 transition-colors"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select 
          className="bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg px-3 py-2 text-sm text-dashboard-text outline-none cursor-pointer focus:border-dashboard-accent/40"
          value={filterCat} 
          onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
        >
          <option value="all">All Categories</option>
          {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          className="bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg px-3 py-2 text-sm text-dashboard-text outline-none cursor-pointer focus:border-dashboard-accent/40"
          value={filterType} 
          onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="text-[11px] text-dashboard-text-dim uppercase tracking-wider mb-2.5 px-1">
        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
      </div>

      <div className="bg-dashboard-bg-secondary border border-dashboard-border rounded-dashboard overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-dashboard-bg-tertiary/50 border-b border-dashboard-border">
              <th className="px-5 py-3 font-medium text-dashboard-text-dim uppercase tracking-wider text-[10px] cursor-pointer hover:text-dashboard-text transition-colors" onClick={() => toggleSort('merchant')}>
                <div className="flex items-center gap-1.5">
                  Merchant {sortIcon('merchant')}
                </div>
              </th>
              <th className="px-5 py-3 font-medium text-dashboard-text-dim uppercase tracking-wider text-[10px] cursor-pointer hover:text-dashboard-text transition-colors" onClick={() => toggleSort('category')}>
                <div className="flex items-center gap-1.5">
                  Category {sortIcon('category')}
                </div>
              </th>
              <th className="px-5 py-3 font-medium text-dashboard-text-dim uppercase tracking-wider text-[10px] cursor-pointer hover:text-dashboard-text transition-colors" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-1.5">
                  Date {sortIcon('date')}
                </div>
              </th>
              <th className="px-5 py-3 font-medium text-dashboard-text-dim uppercase tracking-wider text-[10px] text-right cursor-pointer hover:text-dashboard-text transition-colors" onClick={() => toggleSort('amount')}>
                <div className="flex items-center justify-end gap-1.5">
                  Amount {sortIcon('amount')}
                </div>
              </th>
              {isAdmin && <th className="px-5 py-3 font-medium text-dashboard-text-dim uppercase tracking-wider text-[10px] w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="px-5 py-24 text-center">
                  <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-dashboard-bg-tertiary rounded-full flex items-center justify-center mb-6 text-2xl opacity-40">
                      {(search !== '' || filterCat !== 'all' || filterType !== 'all') ? '🔍' : '📝'}
                    </div>
                    <h3 className="text-base font-semibold text-dashboard-text mb-2">
                      {(search !== '' || filterCat !== 'all' || filterType !== 'all') ? 'No matching results found' : 'No transactions recorded yet'}
                    </h3>
                    <p className="text-xs text-dashboard-text-dim max-w-[240px] mx-auto leading-relaxed">
                      {(search !== '' || filterCat !== 'all' || filterType !== 'all')
                        ? "Try adjusting your search terms or filters to find what you're looking for." 
                        : "It looks like you haven't added any transactions yet. Start tracking your finances today!"}
                    </p>
                    {(search !== '' || filterCat !== 'all' || filterType !== 'all') ? (
                      <button 
                        onClick={() => { setSearch(''); setFilterCat('all'); setFilterType('all'); }}
                        className="mt-6 text-[10px] font-bold uppercase tracking-widest text-dashboard-accent hover:underline"
                      >
                        Clear all filters
                      </button>
                    ) : isAdmin && (
                      <button 
                        onClick={() => document.getElementById('add-txn-trigger')?.click()}
                        className="mt-6 bg-dashboard-accent text-dashboard-bg text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-dashboard-accent-muted transition-all shadow-lg shadow-dashboard-accent/20"
                      >
                        + Add First Record
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((t) => (
                <tr key={t.id} className="hover:bg-dashboard-text/[0.02] transition-colors group">
                  <td className="px-5 py-3 text-dashboard-text font-medium">
                    {t.merchant}
                  </td>
                  <td className="px-5 py-3">
                    <span 
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                      style={{ backgroundColor: CATEGORIES[t.category]?.light, color: CATEGORIES[t.category]?.color }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-dashboard-text-muted font-mono text-[13px]">
                    {fmtDate(t.date)}
                  </td>
                  <td className={cn(
                    "px-5 py-3 text-right font-mono font-medium",
                    t.type === 'income' ? "text-dashboard-success" : "text-dashboard-danger"
                  )}>
                    {t.type === 'income' ? '+' : '-'}{fmtAbs(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(t)}
                          className="p-1.5 rounded-md hover:bg-dashboard-bg-tertiary text-dashboard-text-muted hover:text-dashboard-accent transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="p-1.5 rounded-md hover:bg-dashboard-danger/10 text-dashboard-text-muted hover:text-dashboard-danger transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 animate-in fade-in slide-in-from-top-2 duration-700">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-dashboard-bg-tertiary border border-dashboard-border text-dashboard-text-muted hover:text-dashboard-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all",
                  page === p 
                    ? "bg-dashboard-accent text-black border-dashboard-accent" 
                    : "bg-transparent border border-dashboard-border text-dashboard-text-muted hover:bg-dashboard-bg-tertiary hover:text-dashboard-text"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-dashboard-bg-tertiary border border-dashboard-border text-dashboard-text-muted hover:text-dashboard-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
