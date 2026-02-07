import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Scan, Loader2, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categories, Transaction } from '@/lib/store';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

const mockReceiptData = [
  { description: 'Makan Siang Warteg', amount: 25000, category: 'Makanan' },
  { description: 'Kopi Kenangan', amount: 32000, category: 'Makanan' },
  { description: 'Grab Bike', amount: 18000, category: 'Transportasi' },
  { description: 'Belanja Indomaret', amount: 87500, category: 'Belanja' },
  { description: 'Nasi Padang', amount: 45000, category: 'Makanan' },
];

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Makanan',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  const handleScan = async () => {
    setIsScanning(true);
    setScanComplete(false);

    // Simulate AI scanning for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Pick random mock data
    const mockData = mockReceiptData[Math.floor(Math.random() * mockReceiptData.length)];

    setFormData((prev) => ({
      ...prev,
      description: mockData.description,
      amount: mockData.amount.toString(),
      category: mockData.category,
      type: 'expense',
    }));

    setIsScanning(false);
    setScanComplete(true);

    // Reset scan complete indicator after 2 seconds
    setTimeout(() => setScanComplete(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    onAddTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date,
    });

    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: 'Makanan',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="premium-card"
    >
      <h3 className="mb-4 text-lg font-semibold">Tambah Transaksi</h3>

      {/* Receipt Scanner */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleScan}
        disabled={isScanning}
        className="relative mb-6 w-full overflow-hidden rounded-xl border-2 border-dashed border-border p-6 transition-all hover:border-primary hover:bg-primary/5"
      >
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-orange-600/20" />
                <div className="scan-line absolute left-0 top-0 h-1 w-full" />
                <Loader2 className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-spin text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">AI Analyzing Receipt...</span>
            </motion.div>
          ) : scanComplete ? (
            <motion.div
              key="complete"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                <Check className="h-8 w-8 text-success" />
              </div>
              <span className="text-sm font-medium text-success">Data Extracted Successfully!</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                <Scan className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">Scan Struk</p>
                <p className="text-xs text-muted-foreground">Klik untuk simulasi AI scan receipt</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2 rounded-lg bg-secondary p-1">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type: 'expense' }))}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
              formData.type === 'expense'
                ? 'bg-destructive text-destructive-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowDownRight className="h-4 w-4" />
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type: 'income' }))}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
              formData.type === 'income'
                ? 'bg-success text-success-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowUpRight className="h-4 w-4" />
            Pemasukan
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              placeholder="Contoh: Makan siang"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah (IDR)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="50000"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
        </div>

        <Button type="submit" className="btn-gradient w-full">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Transaksi
        </Button>
      </form>
    </motion.div>
  );
};
