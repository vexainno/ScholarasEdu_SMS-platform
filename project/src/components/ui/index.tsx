import type { ReactNode } from 'react';

export function StatCard({
  label, value, icon, color = 'navy', trend,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: 'navy' | 'accent' | 'success' | 'warning' | 'error';
  trend?: string;
}) {
  const colors: Record<string, string> = {
    navy: 'bg-navy-50 text-navy-700',
    accent: 'bg-accent-50 text-accent-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    error: 'bg-error-50 text-error-700',
  };
  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-navy-500">{label}</p>
          <p className="text-2xl font-bold font-display text-navy-900 mt-1">{value}</p>
          {trend && <p className="text-xs text-navy-400 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

export function PageHeader({
  title, subtitle, action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-navy-900">{title}</h1>
        {subtitle && <p className="text-sm text-navy-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon, title, message,
}: {
  icon: ReactNode;
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-navy-50 text-navy-300 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-navy-700">{title}</h3>
      <p className="text-sm text-navy-400 mt-1 max-w-sm">{message}</p>
    </div>
  );
}

export function SectionCard({
  title, children, action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold font-display text-navy-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Avatar({ name, color, size = 'md' }: { name: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}>
      {initials}
    </div>
  );
}

export function ProgressBar({ value, max, color = 'bg-navy-600' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full bg-navy-100 rounded-full h-2 overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Modal({
  open, onClose, title, children, size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (!open) return null;
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-slide-up`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold font-display text-navy-900">{title}</h2>
          <button onClick={onClose} className="text-navy-400 hover:text-navy-700 transition-colors p-1 rounded-lg hover:bg-navy-50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
