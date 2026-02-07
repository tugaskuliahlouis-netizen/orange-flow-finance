// Money Manager Store - localStorage persistence

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
}

export interface FinancialData {
  transactions: Transaction[];
  balance: number;
}

const STORAGE_KEY = 'money-manager-data';

// Mock initial data for demo
const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Gaji Bulanan',
    amount: 8500000,
    category: 'Gaji',
    type: 'income',
    date: '2024-02-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    description: 'Freelance Project',
    amount: 2500000,
    category: 'Freelance',
    type: 'income',
    date: '2024-02-05',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    description: 'Makan Siang Warteg',
    amount: 25000,
    category: 'Makanan',
    type: 'expense',
    date: '2024-02-06',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    description: 'Kopi Starbucks',
    amount: 65000,
    category: 'Makanan',
    type: 'expense',
    date: '2024-02-06',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    description: 'Grab ke Kantor',
    amount: 35000,
    category: 'Transportasi',
    type: 'expense',
    date: '2024-02-07',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    description: 'Listrik Bulanan',
    amount: 450000,
    category: 'Tagihan',
    type: 'expense',
    date: '2024-02-03',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    description: 'Internet Indihome',
    amount: 350000,
    category: 'Tagihan',
    type: 'expense',
    date: '2024-02-03',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    description: 'Belanja Groceries',
    amount: 750000,
    category: 'Belanja',
    type: 'expense',
    date: '2024-02-04',
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    description: 'Netflix Subscription',
    amount: 186000,
    category: 'Hiburan',
    type: 'expense',
    date: '2024-02-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    description: 'Bensin Motor',
    amount: 50000,
    category: 'Transportasi',
    type: 'expense',
    date: '2024-02-05',
    createdAt: new Date().toISOString(),
  },
];

export const getStoredData = (): FinancialData => {
  if (typeof window === 'undefined') {
    return { transactions: mockTransactions, balance: calculateBalance(mockTransactions) };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { transactions: mockTransactions, balance: calculateBalance(mockTransactions) };
    }
  }

  const initialData = { transactions: mockTransactions, balance: calculateBalance(mockTransactions) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

export const saveData = (data: FinancialData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);
};

export const getMonthlyIncome = (transactions: Transaction[]): number => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((acc, t) => acc + t.amount, 0);
};

export const getMonthlyExpense = (transactions: Transaction[]): number => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((acc, t) => acc + t.amount, 0);
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getSpendingByCategory = (transactions: Transaction[]): { name: string; value: number; color: string }[] => {
  const categoryColors: Record<string, string> = {
    Makanan: 'hsl(180, 100%, 55%)',
    Transportasi: 'hsl(280, 100%, 65%)',
    Hiburan: 'hsl(320, 90%, 60%)',
    Belanja: 'hsl(45, 100%, 60%)',
    Tagihan: 'hsl(200, 100%, 55%)',
    Lainnya: 'hsl(150, 100%, 50%)',
  };

  const expenses = transactions.filter((t) => t.type === 'expense');
  const grouped = expenses.reduce((acc, t) => {
    const cat = t.category || 'Lainnya';
    acc[cat] = (acc[cat] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || categoryColors['Lainnya'],
    }))
    .sort((a, b) => b.value - a.value);
};

export const getCashFlowData = (transactions: Transaction[]): { date: string; income: number; expense: number }[] => {
  const last7Days: { date: string; income: number; expense: number }[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });

    const dayTransactions = transactions.filter((t) => t.date === dateStr);
    const income = dayTransactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = dayTransactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    last7Days.push({ date: dayName, income, expense });
  }

  return last7Days;
};

export const categories = [
  'Makanan',
  'Transportasi',
  'Hiburan',
  'Belanja',
  'Tagihan',
  'Gaji',
  'Freelance',
  'Investasi',
  'Lainnya',
];

export const getFinancialHealthScore = (transactions: Transaction[]): number => {
  const income = getMonthlyIncome(transactions);
  const expense = getMonthlyExpense(transactions);

  if (income === 0) return 50;

  const savingsRate = (income - expense) / income;

  if (savingsRate >= 0.3) return 95;
  if (savingsRate >= 0.2) return 85;
  if (savingsRate >= 0.1) return 70;
  if (savingsRate >= 0) return 55;
  return Math.max(20, 50 + savingsRate * 100);
};

export const generateAITips = (transactions: Transaction[]): string[] => {
  const tips: string[] = [];
  const expenses = transactions.filter((t) => t.type === 'expense');
  const income = getMonthlyIncome(transactions);
  const expense = getMonthlyExpense(transactions);

  // Check spending by category
  const foodExpense = expenses.filter((t) => t.category === 'Makanan').reduce((acc, t) => acc + t.amount, 0);
  const entertainmentExpense = expenses.filter((t) => t.category === 'Hiburan').reduce((acc, t) => acc + t.amount, 0);

  if (foodExpense > income * 0.3) {
    tips.push(`💡 Pengeluaran makanan kamu mencapai ${formatRupiah(foodExpense)}, lebih dari 30% pendapatan. Coba meal prep di rumah!`);
  }

  if (entertainmentExpense > income * 0.1) {
    tips.push(`🎬 Budget hiburan sudah ${formatRupiah(entertainmentExpense)}. Pertimbangkan alternatif gratis seperti hiking atau picnic.`);
  }

  const surplus = income - expense;
  if (surplus > 1000000) {
    tips.push(`🎉 Hebat! Kamu punya surplus ${formatRupiah(surplus)} bulan ini. Pindahkan ke rekening tabungan atau investasi!`);
  }

  if (surplus < 0) {
    tips.push(`⚠️ Pengeluaran melebihi pemasukan sebesar ${formatRupiah(Math.abs(surplus))}. Review pengeluaran yang tidak urgent.`);
  }

  // Check for coffee expenses (mock detection)
  const coffeeExpenses = expenses.filter((t) => t.description.toLowerCase().includes('kopi') || t.description.toLowerCase().includes('starbucks'));
  if (coffeeExpenses.length >= 3) {
    const coffeeTotal = coffeeExpenses.reduce((acc, t) => acc + t.amount, 0);
    tips.push(`☕ Pengeluaran kopi bulan ini: ${formatRupiah(coffeeTotal)}. Bawa tumbler dari rumah untuk hemat!`);
  }

  if (tips.length === 0) {
    tips.push('✨ Keuangan kamu terlihat sehat! Terus pertahankan kebiasaan baik ini.');
    tips.push('📈 Tips: Alokasikan 20% pendapatan untuk tabungan darurat dan investasi.');
  }

  return tips.slice(0, 3);
};
