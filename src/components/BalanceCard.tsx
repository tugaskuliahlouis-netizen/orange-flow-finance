import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatRupiah } from '@/lib/store';

interface BalanceCardProps {
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export const BalanceCard = ({ balance, monthlyIncome, monthlyExpense }: BalanceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="premium-card overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-orange-600/10 blur-3xl" />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
          <Wallet className="h-5 w-5" />
          <span className="text-sm font-medium">Total Saldo</span>
        </div>

        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="balance-text mb-6"
        >
          {formatRupiah(balance)}
        </motion.h1>

        <div className="grid grid-cols-2 gap-4">
          {/* Monthly Income */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg bg-success/10 p-4"
          >
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Pemasukan Bulan Ini</span>
            </div>
            <p className="text-xl font-bold text-success">{formatRupiah(monthlyIncome)}</p>
          </motion.div>

          {/* Monthly Expense */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg bg-destructive/10 p-4"
          >
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20">
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Pengeluaran Bulan Ini</span>
            </div>
            <p className="text-xl font-bold text-destructive">{formatRupiah(monthlyExpense)}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
