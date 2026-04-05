import { useFinance } from '../context/FinanceContext';
import SummaryCard   from '../components/SummaryCard';
import BalanceChart  from '../components/BalanceChart';
import CategoryPieChart from '../components/CategoryPieChart';
import TransactionTable from '../components/TransactionTable';
import InsightsPanel from '../components/InsightsPanel';
import RoleSwitcher  from '../components/RoleSwitcher';

export default function Dashboard() {
  const { totalBalance, totalIncome, totalExpenses, darkMode, setDarkMode, role } = useFinance();

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-sm">F</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-extrabold leading-none" style={{ color: 'var(--text-main)' }}>FinanceOS</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Personal Dashboard</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Role badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border
              ${role === 'admin'
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-blue-500' : 'bg-gray-400'}`} />
              {role === 'admin' ? 'Admin' : 'Viewer'}
            </span>

            <RoleSwitcher />

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-input)' }}>
              <span className="text-base">{darkMode ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Page title */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-main)' }}>
            Overview
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Your financial summary for March 2026
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <SummaryCard title="Total Balance"  amount={totalBalance}  icon="💰" trend={12.5}  trendLabel="vs last month" accent="blue"    />
          <SummaryCard title="Total Income"   amount={totalIncome}   icon="↑"  trend={8.2}   trendLabel="vs last month" accent="emerald" />
          <SummaryCard title="Total Expenses" amount={totalExpenses} icon="↓"  trend={-3.1}  trendLabel="vs last month" accent="red"     />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BalanceChart />
          <CategoryPieChart />
        </div>

        {/* Insights */}
        <InsightsPanel />

        {/* Transactions */}
        <TransactionTable />

      </main>

      {/* Footer */}
      <footer className="border-t mt-8 py-5 text-center text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        FinanceOS © 2026 — Built with React + Tailwind CSS
      </footer>
    </div>
  );
}
