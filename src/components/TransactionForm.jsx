import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';

const CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Income'];
const EMPTY = { date: '', description: '', category: 'Food', amount: '', type: 'expense' };

export default function TransactionForm({ editing, onClose }) {
  const { dispatch } = useFinance();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(editing ? { ...editing, amount: String(editing.amount) } : EMPTY);
  }, [editing]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: editing ? 'EDIT' : 'ADD', payload: { ...form, amount: parseFloat(form.amount) } });
    onClose();
  };

  const fieldCls = [
    'w-full border rounded-xl px-3 py-2.5 text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400',
  ].join(' ');

  const fieldStyle = {
    backgroundColor: 'var(--bg-input)',
    borderColor:     'var(--border)',
    color:           'var(--text-main)',
  };

  const labelCls = 'block text-xs font-bold uppercase tracking-wide mb-1.5';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rounded-2xl shadow-2xl w-full max-w-md border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              {editing ? 'Edit' : 'New'} Transaction
            </p>
            <h2 className="text-lg font-extrabold mt-0.5" style={{ color: 'var(--text-main)' }}>
              {editing ? 'Update details' : 'Add a transaction'}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-colors hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)' }}
            aria-label="Close">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Date</label>
              <input type="date" required value={form.date} onChange={e => set('date', e.target.value)}
                className={fieldCls} style={fieldStyle} />
            </div>
            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Amount ($)</label>
              <input type="number" required min="0.01" step="0.01" value={form.amount}
                onChange={e => set('amount', e.target.value)} placeholder="0.00"
                className={fieldCls} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Description</label>
            <input type="text" required value={form.description}
              onChange={e => set('description', e.target.value)} placeholder="e.g. Grocery Store"
              className={fieldCls} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className={fieldCls} style={fieldStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className={fieldCls} style={fieldStyle}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border rounded-xl py-2.5 text-sm font-bold transition-all hover:opacity-80 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)' }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl py-2.5 text-sm font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {editing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
