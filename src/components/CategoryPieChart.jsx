import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const COLORS = [
  { stroke: '#6366f1', light: '#eef2ff', dark: '#1e1b4b' },
  { stroke: '#10b981', light: '#ecfdf5', dark: '#064e3b' },
  { stroke: '#f59e0b', light: '#fffbeb', dark: '#451a03' },
  { stroke: '#ef4444', light: '#fef2f2', dark: '#450a0a' },
  { stroke: '#8b5cf6', light: '#f5f3ff', dark: '#2e1065' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 shadow-2xl text-sm border"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-main)' }}>
      <p className="font-bold">{payload[0].name}</p>
      <p className="font-extrabold mt-0.5" style={{ color: payload[0].payload.stroke }}>
        ${payload[0].value.toFixed(2)}
      </p>
    </div>
  );
};

export default function CategoryPieChart() {
  const { transactions } = useFinance();

  const data = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const ex = acc.find(i => i.name === t.category);
      if (ex) ex.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Spending Breakdown</h3>
          <p className="text-xl font-extrabold mt-0.5" style={{ color: 'var(--text-main)' }}>By Category</p>
        </div>
        <span className="text-2xl">🍩</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="shrink-0">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={80}
                paddingAngle={3} dataKey="value" strokeWidth={0}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length].stroke} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom legend */}
        <div className="flex flex-col gap-2 w-full">
          {data.map((d, i) => {
            const c = COLORS[i % COLORS.length];
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : 0;
            return (
              <div key={d.name} className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.stroke }} />
                <span className="text-xs font-semibold flex-1" style={{ color: 'var(--text-main)' }}>{d.name}</span>
                <span className="text-xs font-bold" style={{ color: c.stroke }}>{pct}%</span>
                <span className="text-xs font-semibold w-16 text-right" style={{ color: 'var(--text-muted)' }}>
                  ${d.value.toFixed(0)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
