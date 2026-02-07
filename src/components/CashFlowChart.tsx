import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatRupiah } from '@/lib/store';

interface CashFlowChartProps {
  data: { date: string; income: number; expense: number }[];
}

export const CashFlowChart = ({ data }: CashFlowChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="mb-2 font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'income' ? 'Pemasukan' : 'Pengeluaran'}: {formatRupiah(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="premium-card"
    >
      <h3 className="mb-4 text-lg font-semibold">Cash Flow Trend</h3>
      <p className="mb-6 text-sm text-muted-foreground">Pergerakan uang 7 hari terakhir</p>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (value === 'income' ? 'Pemasukan' : 'Pengeluaran')}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={3}
              dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="hsl(24, 95%, 53%)"
              strokeWidth={3}
              dot={{ fill: 'hsl(24, 95%, 53%)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
