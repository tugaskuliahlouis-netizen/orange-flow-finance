import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Calendar, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction, formatRupiah, getMonthlyIncome, getMonthlyExpense } from '@/lib/store';

interface ReportsSectionProps {
  transactions: Transaction[];
  healthScore: number;
}

type Period = 'weekly' | 'monthly' | 'yearly';

export const ReportsSection = ({ transactions, healthScore }: ReportsSectionProps) => {
  const [period, setPeriod] = useState<Period>('monthly');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const handleDownloadReport = () => {
    // Simulate download
    const blob = new Blob(['Money Manager Annual Report - PDF Simulation'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'money-manager-annual-report.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const income = getMonthlyIncome(transactions);
  const expense = getMonthlyExpense(transactions);
  const savings = income - expense;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : '0';

  // Calculate stroke dashoffset for the health ring
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="premium-card"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Laporan Keuangan</h3>
        </div>

        {/* Period Tabs */}
        <div className="flex rounded-lg bg-secondary p-1">
          {(['weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`relative rounded-md px-4 py-2 text-sm font-medium transition-all ${
                period === p
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period === p && (
                <motion.div
                  layoutId="periodIndicator"
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 capitalize">
                {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Financial Health Score */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-secondary/50 p-6">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Activity className="h-4 w-4" />
            Financial Health Score
          </h4>

          {/* Animated Ring */}
          <div className="relative mb-4">
            <svg className="h-28 w-28 -rotate-90 transform">
              {/* Background circle */}
              <circle
                cx="56"
                cy="56"
                r="40"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="56"
                cy="56"
                r="40"
                fill="none"
                stroke="hsl(24, 95%, 53%)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className={`text-3xl font-bold ${getScoreColor(healthScore)}`}
              >
                {healthScore}
              </motion.span>
            </div>
          </div>

          <p className={`font-medium ${getScoreColor(healthScore)}`}>{getScoreLabel(healthScore)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Berdasarkan rasio pendapatan vs pengeluaran</p>
        </div>

        {/* Summary Stats */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={period}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="rounded-lg bg-success/10 p-4">
                <div className="flex items-center gap-2 text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Pemasukan</span>
                </div>
                <p className="mt-1 text-xl font-bold">{formatRupiah(income)}</p>
              </div>

              <div className="rounded-lg bg-destructive/10 p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <TrendingUp className="h-4 w-4 rotate-180" />
                  <span className="text-sm font-medium">Pengeluaran</span>
                </div>
                <p className="mt-1 text-xl font-bold">{formatRupiah(expense)}</p>
              </div>

              <div className="rounded-lg bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Tabungan</span>
                  <span className="text-xs text-primary">{savingsRate}% dari pendapatan</span>
                </div>
                <p className={`mt-1 text-xl font-bold ${savings >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatRupiah(savings)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Download Button */}
      <Button
        onClick={handleDownloadReport}
        className="mt-6 w-full"
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Annual Report (PDF)
      </Button>
    </motion.div>
  );
};
