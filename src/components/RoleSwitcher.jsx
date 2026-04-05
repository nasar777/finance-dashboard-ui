import { useFinance } from '../context/FinanceContext';

export default function RoleSwitcher() {
  const { role, setRole } = useFinance();

  return (
    <div className="flex items-center rounded-xl border p-0.5 gap-0.5"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-input)' }}>
      {['viewer', 'admin'].map(r => (
        <button key={r} onClick={() => setRole(r)}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg capitalize transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${role === r
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'hover:opacity-70'}`}
          style={role !== r ? { color: 'var(--text-muted)' } : {}}>
          {r}
        </button>
      ))}
    </div>
  );
}
