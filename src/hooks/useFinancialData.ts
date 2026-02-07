import { useState, useEffect, useCallback } from 'react';
import {
  Transaction,
  getStoredData,
  saveData,
  calculateBalance,
  getMonthlyIncome,
  getMonthlyExpense,
  getSpendingByCategory,
  getCashFlowData,
  getFinancialHealthScore,
  generateAITips,
} from '@/lib/store';

export const useFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getStoredData();
    setTransactions(data.transactions);
    setIsLoading(false);
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => {
      const updated = [newTransaction, ...prev];
      saveData({ transactions: updated, balance: calculateBalance(updated) });
      return updated;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveData({ transactions: updated, balance: calculateBalance(updated) });
      return updated;
    });
  }, []);

  const balance = calculateBalance(transactions);
  const monthlyIncome = getMonthlyIncome(transactions);
  const monthlyExpense = getMonthlyExpense(transactions);
  const spendingByCategory = getSpendingByCategory(transactions);
  const cashFlowData = getCashFlowData(transactions);
  const healthScore = getFinancialHealthScore(transactions);
  const aiTips = generateAITips(transactions);

  return {
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
  };
};
