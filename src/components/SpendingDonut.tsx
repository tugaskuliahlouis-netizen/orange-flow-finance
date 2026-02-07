import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatRupiah } from '@/lib/store';

interface SpendingDonutProps {
  data: { name: string; value: number; color: string }[];
}

export const SpendingDonut = ({ data }: SpendingDonutProps) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="font-medium" style={{ color: item.payload.color }}>
            {item.name}
          </p>
          <p className="text-sm text-foreground">{formatRupiah(item.value)}</p>
          <p className="text-xs text-muted-foreground">{percentage}% dari total</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {data.slice(0, 6).map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="truncate text-xs text-muted-foreground">{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="premium-card"
    >
      <h3 className="mb-4 text-lg font-semibold">Spending by Category</h3>
      <p className="mb-2 text-sm text-muted-foreground">Distribusi pengeluaran bulan ini</p>

      {data.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
          <p className="text-sm">Belum ada data pengeluaran</p>
        </div>
      ) : (
        <>
          <div className="relative h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-bold">{formatRupiah(total)}</p>
            </div>
          </div>

          {renderLegend()}
        </>
      )}
    </motion.div>
  );
};
