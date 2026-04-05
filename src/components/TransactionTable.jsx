import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from './TransactionForm';

// Category badge styles
const CAT = {
  Food:          'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
  Shopping:      'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  Transport:     'bg-sky-100    text-sky-800    dark:bg-sky-900/50    dark:text-sky-200',
  Bills:         'bg-red-100    text-red-800    dark:bg-red-900/50    dark:text-red-200',
  Entertainment: 'bg-pink-100   text-pink-800   dark:bg-pink-900/50   dark:text-pink-200',
  Income:        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
};

function exportCSV(rows) {
  const header = 'Date,Description,Category,Amount,Type';
  const lines  = rows.map(t => `${t.date},"${t.description}",${t.category},${t.amount},${t.type}`);
  const blob   = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob), download: 'transactions.csv',
  });
  a.click();
}

export default function TransactionTable() {
  const { transactions, filtered, dispatch, role, search, setSearch, filterType, setFilterType, sortBy, setSortBy } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);

  const openAdd  = ()  => { setEditing(null); setShowForm(true); };
  const openEdit = (t) => { setEditing(t);    setShowForm(true); };
  const close    = ()  => { setEditing(null); setShowForm(false); };

  const inputBase = [
    'border rounded-xl px-3 py-2 text-sm transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400',
  ].join(' ');

  const inputStyle = {
    backgroundColor: 'var(--bg-input)',
    borderColor:     'var(--border)',
    color:           'var(--text-main)',
  };

  return (
    <div className="card">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Transactions</h3>
          <p className="text-xl font-extrabold mt-0.5" style={{ color: 'var(--text-main)' }}>
            {filtered.length} {filtered.length === 1 ? 'Record' : 'Records'}
          </p>
        </div>
        {role === 'admin' && (
          <div className="flex gap-2 shrink-0">
            <button onClick={openAdd}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span className="text-base leading-none">+</span> Add Transaction
            </button>
            <button onClick={() => exportCSV(filtered)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all duration-150 hover:opacity-80 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)' }}>
              ↓ Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>🔍</span>
          <input type="text" placeholder="Search by name or category…"
            value={search} onChange={e => setSearch(e.target.value)}
            className={`w-full pl-9 ${inputBase}`} style={inputStyle} />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className={inputBase} style={inputStyle}>
          <option value="all">All Types</option>
          <option value="income">Income only</option>
          <option value="expense">Expenses only</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className={inputBase} style={inputStyle}>
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>
      </div>

      {/* Empty state — no transactions at all */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            style={{ backgroundColor: 'var(--bg-input)' }}>💳</div>
          <div className="text-center">
            <p className="text-lg font-extrabold" style={{ color: 'var(--text-main)' }}>No transactions yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Add your first transaction to start tracking your finances.
            </p>
          </div>
          {role === 'admin' && (
            <button onClick={openAdd}
              className="mt-1 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span className="text-base leading-none">+</span> Add First Transaction
            </button>
          )}
        </div>

      /* Empty state — filters returned nothing */
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-5xl">🔍</span>
          <p className="text-base font-bold" style={{ color: 'var(--text-main)' }}>No transactions found</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          {(search || filterType !== 'all') && (
            <button onClick={() => { setSearch(''); setFilterType('all'); }}
              className="mt-2 text-xs font-bold text-indigo-500 hover:text-indigo-400 underline underline-offset-2">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b-2" style={{ borderColor: 'var(--border)' }}>
                {['Date', 'Description', 'Category', 'Amount', 'Type', ...(role === 'admin' ? [''] : [])].map((h, i) => (
                  <th key={i} className="text-left text-xs font-extrabold uppercase tracking-widest pb-3 pr-4"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}
                  className="border-b group transition-colors duration-150"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>

                  <td className="py-4 pr-4 whitespace-nowrap text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {t.date}
                  </td>
                  <td className="py-4 pr-4 font-bold" style={{ color: 'var(--text-main)' }}>
                    {t.description}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CAT[t.category] || 'bg-gray-100 text-gray-700'}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className={`py-4 pr-4 font-extrabold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '−'}${t.amount.toFixed(2)}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                      ${t.type === 'income'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                      {t.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>

                  {role === 'admin' && (
                    <td className="py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button onClick={() => openEdit(t)}
                          className="text-xs font-bold text-indigo-500 hover:text-indigo-400 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          Edit
                        </button>
                        <button onClick={() => dispatch({ type: 'DELETE', payload: t.id })}
                          className="text-xs font-bold text-red-500 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <TransactionForm editing={editing} onClose={close} />}
    </div>
  );
}
