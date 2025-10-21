import type { PropsWithChildren } from 'react';

interface CardProps {
  className?: string;
}

/**
 * Card component with bg-secondary styling
 * Used for elevated content sections in the design system
 */
export default function Card({ children, className = '' }: PropsWithChildren<CardProps>) {
  return (
    <div className={`bg-secondary rounded-lg shadow-md border border-tertiary/50 ${className}`}>
      {children}
    </div>
  );
}
