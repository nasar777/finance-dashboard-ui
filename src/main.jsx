import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Clear stale localStorage so updated mock data loads fresh
try {
  const saved = localStorage.getItem('finance_transactions');
  if (!saved) throw new Error();
  const parsed = JSON.parse(saved);
  // Reset if data is from old dates (pre-2026)
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed[0]?.date?.startsWith('2025')) {
    localStorage.removeItem('finance_transactions');
  }
} catch { localStorage.removeItem('finance_transactions'); }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
