import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  elevation?: number;
  interactive?: boolean;
  variant?: 'default' | 'liquid';
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  elevation = 1,
  interactive = true,
  variant = 'default',
  style = {},
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        glass-card
        ${variant === 'liquid' ? 'liquid-glass' : ''}
        ${interactive ? 'liquid-interactive liquid-shimmer cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
