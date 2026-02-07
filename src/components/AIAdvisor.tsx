import { motion } from 'framer-motion';
import { Lightbulb, Sparkles } from 'lucide-react';

interface AIAdvisorProps {
  tips: string[];
}

export const AIAdvisor = ({ tips }: AIAdvisorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="premium-card overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-orange-600/10 blur-2xl" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Financial Advisor</h3>
            <p className="text-xs text-muted-foreground">Smart Tips berdasarkan perilaku keuangan</p>
          </div>
        </div>

        <div className="space-y-3">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3"
            >
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
