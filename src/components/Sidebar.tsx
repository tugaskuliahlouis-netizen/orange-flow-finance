import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  PieChart,
  TrendingUp,
  Settings,
  HelpCircle,
  Wallet,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: CreditCard, label: 'Transaksi' },
  { id: 'analytics', icon: PieChart, label: 'Analisis' },
  { id: 'reports', icon: TrendingUp, label: 'Laporan' },
];

const bottomItems = [
  { id: 'settings', icon: Settings, label: 'Pengaturan' },
  { id: 'help', icon: HelpCircle, label: 'Bantuan' },
];

export const Sidebar = ({ activeTab, onTabChange, theme, onToggleTheme }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 top-0 z-50 flex h-full w-[72px] flex-col items-center border-r border-sidebar-border bg-sidebar py-6 lg:w-20"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600"
      >
        <Wallet className="h-6 w-6 text-primary-foreground" />
      </motion.div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-sidebar-accent"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn('relative z-10 h-5 w-5', isActive && 'text-primary')} />

              {/* Tooltip */}
              <span className="absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg group-hover:block">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col items-center gap-2">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleTheme}
          className="flex h-12 w-12 items-center justify-center rounded-xl text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.button>

        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(item.id)}
              className="group relative flex h-12 w-12 items-center justify-center rounded-xl text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
              <Icon className="h-5 w-5" />
              <span className="absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg group-hover:block">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.aside>
  );
};
