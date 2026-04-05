import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { balanceTrend } from '../data/mockTransactions';
import { useFinance } from '../context/FinanceContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 shadow-2xl text-sm border"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}>
      <p className="font-bold text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-blue-500 font-extrabold text-base">${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function BalanceChart() {
  const { darkMode } = useFinance();
  const gridColor = darkMode ? '#1e3358' : '#e2e8f0';
  const tickColor = darkMode ? '#7c93b8' : '#64748b';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Balance Trend</h3>
          <p className="text-xl font-extrabold mt-0.5" style={{ color: 'var(--text-main)' }}>6-Month Overview</p>
        </div>
        <span className="text-2xl">📈</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={balanceTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor, fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2.5}
            fill="url(#balanceGrad)"
            dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: 'var(--bg-card)' }}
            activeDot={{ r: 6, fill: '#6366f1', stroke: 'var(--bg-card)', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
