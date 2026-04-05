import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}
