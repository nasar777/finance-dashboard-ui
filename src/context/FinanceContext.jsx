import { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import { mockTransactions } from '../data/mockTransactions';

const FinanceContext = createContext(null);

const STORAGE_KEY      = 'finance_transactions';
const DARK_MODE_KEY    = 'finance_dark_mode';

// ── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':    return [...state, { ...action.payload, id: Date.now() }];
    case 'EDIT':   return state.map(t => t.id === action.payload.id ? action.payload : t);
    case 'DELETE': return state.filter(t => t.id !== action.payload);
    case 'RESET':  return mockTransactions;
    default:       return state;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockTransactions;
  } catch {
    return mockTransactions;
  }
}

function loadDarkMode() {
  try {
    return localStorage.getItem(DARK_MODE_KEY) === 'true';
  } catch {
    return false;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function FinanceProvider({ children }) {
  const [transactions, dispatch] = useReducer(reducer, null, loadTransactions);
  const [role,       setRole]       = useState('viewer');
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy,     setSortBy]     = useState('date-desc');
  const [darkMode,   setDarkMode]   = useState(loadDarkMode);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Persist + apply dark mode
  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Derived: filtered + sorted list
  const filtered = useMemo(() => (
    transactions
      .filter(t => {
        const q = search.toLowerCase();
        const matchSearch = t.description.toLowerCase().includes(q) ||
                            t.category.toLowerCase().includes(q);
        const matchType = filterType === 'all' || t.type === filterType;
        return matchSearch && matchType;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc')    return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc')     return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc')  return b.amount - a.amount;
        if (sortBy === 'amount-asc')   return a.amount - b.amount;
        return 0;
      })
  ), [transactions, search, filterType, sortBy]);

  // Derived: totals
  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { totalIncome: inc, totalExpenses: exp, totalBalance: inc - exp };
  }, [transactions]);

  const value = useMemo(() => ({
    transactions, dispatch,
    filtered,
    role, setRole,
    search, setSearch,
    filterType, setFilterType,
    sortBy, setSortBy,
    darkMode, setDarkMode,
    totalIncome, totalExpenses, totalBalance,
  }), [transactions, filtered, role, search, filterType, sortBy, darkMode,
       totalIncome, totalExpenses, totalBalance]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

// ── Hook with guard ───────────────────────────────────────────────────────────
export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used inside <FinanceProvider>');
  return ctx;
}
