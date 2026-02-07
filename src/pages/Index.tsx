import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { CashFlowChart } from '@/components/CashFlowChart';
import { SpendingDonut } from '@/components/SpendingDonut';
import { AIAdvisor } from '@/components/AIAdvisor';
import { ReportsSection } from '@/components/ReportsSection';
import { useTheme } from '@/hooks/useTheme';
import { useFinancialData } from '@/hooks/useFinancialData';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const {
    transactions,
    isLoading,
    balance,
    monthlyIncome,
    monthlyExpense,
    spendingByCategory,
    cashFlowData,
    healthScore,
    aiTips,
    addTransaction,
    deleteTransaction,
  } = useFinancialData();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 p-4 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600">
            <span className="text-lg font-bold text-primary-foreground">M</span>
          </div>
          <h1 className="text-lg font-bold">Money Manager</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 hover:bg-secondary"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-6">
              {['dashboard', 'transactions', 'analytics', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-2xl font-medium capitalize transition-colors ${
                    activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'transactions' ? 'Transaksi' : tab === 'analytics' ? 'Analisis' : tab === 'reports' ? 'Laporan' : 'Dashboard'}
                </button>
              ))}
              <button
                onClick={toggleTheme}
                className="mt-4 text-lg text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pb-8 lg:ml-20">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold lg:text-3xl">
              Selamat Datang di{' '}
              <span className="text-gradient-orange">Money Manager</span>
            </h1>
            <p className="mt-1 text-muted-foreground">
              Kelola keuangan dengan cerdas dan mudah
            </p>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Balance & Transactions */}
            <div className="space-y-6 lg:col-span-2">
              <BalanceCard
                balance={balance}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <TransactionForm onAddTransaction={addTransaction} />
                <TransactionList
                  transactions={transactions}
                  onDelete={deleteTransaction}
                />
              </div>

              <CashFlowChart data={cashFlowData} />
            </div>

            {/* Right Column - Analytics & Reports */}
            <div className="space-y-6">
              <SpendingDonut data={spendingByCategory} />
              <AIAdvisor tips={aiTips} />
              <ReportsSection
                transactions={transactions}
                healthScore={healthScore}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
