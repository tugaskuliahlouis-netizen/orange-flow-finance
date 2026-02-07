import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { Transaction, formatRupiah } from '@/lib/store';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const recentTransactions = transactions.slice(0, 8);

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      Makanan: '🍜',
      Transportasi: '🚗',
      Hiburan: '🎬',
      Belanja: '🛒',
      Tagihan: '📄',
      Gaji: '💼',
      Freelance: '💻',
      Investasi: '📈',
      Lainnya: '📦',
    };
    return emojis[category] || '📦';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="premium-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaksi Terbaru</h3>
        <span className="text-sm text-muted-foreground">{transactions.length} total</span>
      </div>

      <div className="space-y-3">
        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Belum ada transaksi</p>
            <p className="text-sm">Mulai tambah transaksi pertama kamu!</p>
          </div>
        ) : (
          recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-secondary/50"
            >
              {/* Category Icon */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                  transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                }`}
              >
                {getCategoryEmoji(transaction.category)}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {new Date(transaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </p>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="text-sm sm:text-base">{formatRupiah(transaction.amount)}</span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
