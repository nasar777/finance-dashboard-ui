import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { lastMonthSpending } from '../data/mockTransactions';

const STYLES = {
  trophy: { card: 'bg-amber-50  dark:bg-amber-950/60  border-amber-200  dark:border-amber-800',  text: 'text-amber-900  dark:text-amber-100'  },
  up:     { card: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-900 dark:text-emerald-100' },
  down:   { card: 'bg-red-50    dark:bg-red-950/60    border-red-200    dark:border-red-800',    text: 'text-red-900    dark:text-red-100'    },
  warn:   { card: 'bg-yellow-50 dark:bg-yellow-950/60 border-yellow-200 dark:border-yellow-800', text: 'text-yellow-900 dark:text-yellow-100' },
  info:   { card: 'bg-blue-50   dark:bg-blue-950/60   border-blue-200   dark:border-blue-800',   text: 'text-blue-900   dark:text-blue-100'   },
};

// Safe inline bold — no dangerouslySetInnerHTML
function Insight({ icon, style, parts }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border transition-transform duration-200 hover:scale-[1.01] ${style.card}`}>
      <span className="text-xl shrink-0 mt-0.5" role="img">{icon}</span>
      <p className={`text-sm font-medium leading-relaxed ${style.text}`}>
        {parts.map((p, i) =>
          p.bold
            ? <strong key={i} className="font-extrabold">{p.text}</strong>
            : <span key={i}>{p.text}</span>
        )}
      </p>
    </div>
  );
}

// Helper: build parts array from template segments
function bold(text) { return { text, bold: true }; }
function plain(text) { return { text, bold: false }; }

export default function InsightsPanel() {
  const { transactions, totalIncome, totalExpenses } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const catTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const sorted      = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
    const topCat      = sorted[0];
    const savingsRate = totalIncome > 0
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : 0;
    const rate = Number(savingsRate);
    const result = [];

    // 1. Top spending category
    if (topCat) {
      const pct = totalExpenses > 0 ? ((topCat[1] / totalExpenses) * 100).toFixed(0) : 0;
      result.push({
        icon: '🏆', style: STYLES.trophy,
        parts: [plain('Your top spending category is '), bold(topCat[0]),
                plain(` at `), bold(`$${topCat[1].toFixed(2)}`),
                plain(` — ${pct}% of total expenses.`)],
      });
    }

    // 2. Savings rate
    result.push({
      icon: rate >= 20 ? '✅' : rate >= 0 ? '⚠️' : '🚨',
      style: rate >= 20 ? STYLES.up : rate >= 0 ? STYLES.warn : STYLES.down,
      parts: [plain('Income '), bold(`$${totalIncome.toFixed(2)}`),
              plain(' vs Expenses '), bold(`$${totalExpenses.toFixed(2)}`),
              plain(` — savings rate `), bold(`${savingsRate}%`),
              plain(rate >= 20 ? ' 🎉 Great job!' : rate < 0 ? ' — spending exceeds income!' : ' — aim for 20%+')],
    });

    // 3. Month-over-month per category
    Object.entries(catTotals).forEach(([cat, current]) => {
      const prev = lastMonthSpending[cat];
      if (!prev) return;
      const change = (((current - prev) / prev) * 100).toFixed(0);
      if (Math.abs(change) < 10) return;
      const dir = change > 0 ? 'increased' : 'decreased';
      result.push({
        icon: change > 0 ? '📈' : '📉',
        style: change > 0 ? STYLES.warn : STYLES.info,
        parts: [bold(cat), plain(` spending ${dir} by `), bold(`${Math.abs(change)}%`),
                plain(` vs last month (`), bold(`$${prev}`), plain(` → `), bold(`$${current.toFixed(2)}`), plain(')')],
      });
    });

    // 4. Largest single expense
    const largest = [...expenses].sort((a, b) => b.amount - a.amount)[0];
    if (largest) {
      result.push({
        icon: '💸', style: STYLES.info,
        parts: [plain('Largest expense: '), bold(largest.description),
                plain(' at '), bold(`$${largest.amount.toFixed(2)}`),
                plain(` on ${largest.date}.`)],
      });
    }

    // 5. Transaction summary
    result.push({
      icon: '📊', style: STYLES.up,
      parts: [bold(`${transactions.length} transactions`),
              plain(' recorded — '), bold(`${expenses.length} expenses`),
              plain(' and '), bold(`${transactions.length - expenses.length} income`),
              plain(' entries.')],
    });

    return result;
  }, [transactions, totalIncome, totalExpenses]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Smart Insights
          </h3>
          <p className="text-xl font-extrabold mt-0.5" style={{ color: 'var(--text-main)' }}>
            Financial Analysis
          </p>
        </div>
        <span className="text-2xl" role="img" aria-label="insights">💡</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((ins, i) => <Insight key={i} {...ins} />)}
      </div>
    </div>
  );
}
