const ACCENTS = {
  blue: {
    bar:    'bg-gradient-to-r from-blue-500 to-indigo-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    icon:   'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    bar:    'bg-gradient-to-r from-emerald-400 to-teal-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    icon:   'text-emerald-600 dark:text-emerald-400',
  },
  red: {
    bar:    'bg-gradient-to-r from-rose-400 to-red-500',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
    icon:   'text-red-600 dark:text-red-400',
  },
};

export default function SummaryCard({ title, amount, icon, trend, trendLabel, accent }) {
  const isPositive = trend >= 0;
  const a = ACCENTS[accent] || ACCENTS.blue;

  return (
    <div className="card group hover:-translate-y-0.5 overflow-hidden relative">
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${a.bar}`} />

      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            {title}
          </p>
          <p className="text-3xl font-extrabold mt-2 tracking-tight" style={{ color: 'var(--text-main)' }}>
            ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs mt-2 font-semibold flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{Math.abs(trend)}% {trendLabel}</span>
          </p>
        </div>
        <span className={`text-xl w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${a.iconBg} ${a.icon}`}>
          {icon}
        </span>
      </div>
    </div>
  );
}
