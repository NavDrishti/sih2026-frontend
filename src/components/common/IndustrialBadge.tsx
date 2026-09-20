import React from 'react';

export type BadgeVariant = 
  | 'critical' 
  | 'amber' 
  | 'cyan' 
  | 'green' 
  | 'neutral' 
  | 'outline-red' 
  | 'outline-cyan' 
  | 'outline-amber';

interface IndustrialBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const IndustrialBadge: React.FC<IndustrialBadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  pulse = false,
  className = '',
  icon
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 tracking-wider',
    sm: 'text-xs px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider'
  };

  const variantClasses: Record<BadgeVariant, string> = {
    critical: 'bg-hazard-red-dark text-red-200 border border-hazard-red-border font-semibold shadow-hazard-red',
    amber: 'bg-hazard-amber-dark text-amber-200 border border-hazard-amber-border font-semibold shadow-hazard-amber',
    cyan: 'bg-hazard-cyan-dark text-cyan-200 border border-hazard-cyan-border font-semibold shadow-safety-cyan',
    green: 'bg-hazard-green-dark text-emerald-200 border border-hazard-green-border font-semibold',
    neutral: 'bg-industrial-800 text-industrial-300 border border-industrial-700',
    'outline-red': 'bg-transparent text-hazard-red border border-hazard-red font-medium',
    'outline-cyan': 'bg-transparent text-hazard-cyan border border-hazard-cyan font-medium',
    'outline-amber': 'bg-transparent text-hazard-amber border border-hazard-amber font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase rounded-none transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${pulse ? 'animate-critical-pulse' : ''} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
