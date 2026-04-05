import React, { useState } from 'react';
import { CATEGORIES } from '../../utils/constants';

export function TxForm({ tx, onSave, onClose }) {
  const isEdit = !!tx?.id;
  const [form, setForm] = useState(tx || {
    date: new Date().toISOString().slice(0, 10),
    merchant: '',
    category: 'Food & Dining',
    type: 'expense',
    amount: '',
  });

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.merchant || !form.amount) return;
    const amt = parseFloat(form.amount);
    if (isNaN(amt)) return;
    
    onSave({
      ...form,
      id: form.id || 't' + Date.now(),
      amount: form.type === 'expense' ? -Math.abs(amt) : Math.abs(amt),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[11px] font-medium text-dashboard-text-dim uppercase tracking-wider mb-1.5 block">
          Merchant / Description
        </label>
        <input 
          className="w-full bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg px-3 py-2.5 text-sm text-dashboard-text placeholder:text-dashboard-text-dim outline-none focus:border-dashboard-accent/40 transition-colors"
          value={form.merchant} 
          onChange={e => up('merchant', e.target.value)} 
          placeholder="e.g. Whole Foods" 
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-medium text-dashboard-text-dim uppercase tracking-wider mb-1.5 block">
            Amount (₹)
          </label>
          <input 
            className="w-full bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg px-3 py-2.5 text-sm font-mono text-dashboard-text placeholder:text-dashboard-text-dim outline-none focus:border-dashboard-accent/40 transition-colors"
            type="number" 
            step="0.01" 
            value={form.amount === '' ? '' : Math.abs(form.amount)} 
            onChange={e => up('amount', e.target.value)} 
            placeholder="0.00" 
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-dashboard-text-dim uppercase tracking-wider mb-1.5 block">
            Date
          </label>
          <input 
            className="w-full bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg px-3 py-2.5 text-sm font-mono text-dashboard-text outline-none focus:border-dashboard-accent/40 transition-colors"
            type="date" 
            value={form.date} 
            onChange={e => up('date', e.target.value)} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-medium text-dashboard-text-dim uppercase tracking-wider mb-1.5 block">
            Category
          </label>
          <select 
            className="w-full bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg px-3 py-2.5 text-sm text-dashboard-text outline-none cursor-pointer focus:border-dashboard-accent/40 transition-colors"
            value={form.category} 
            onChange={e => up('category', e.target.value)}
          >
            {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-medium text-dashboard-text-dim uppercase tracking-wider mb-1.5 block">
            Type
          </label>
          <select 
            className="w-full bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg px-3 py-2.5 text-sm text-dashboard-text outline-none cursor-pointer focus:border-dashboard-accent/40 transition-colors"
            value={form.type} 
            onChange={e => up('type', e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-8">
        <button 
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium text-dashboard-text-muted hover:text-dashboard-text transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-6 py-2.5 bg-dashboard-accent text-black text-sm font-semibold rounded-lg hover:bg-dashboard-accent-muted transition-colors shadow-lg shadow-dashboard-accent/20"
        >
          {isEdit ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
