import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';

// Helper to merge classNames
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

const variantStyles = {
  primary: 'bg-[var(--brand-primary)] text-white hover:opacity-90 active:opacity-80',
  secondary:
    'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]',
  outline:
    'border border-[var(--brand-primary)] bg-transparent text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]',
  destructive: 'bg-[var(--state-error)] text-white hover:opacity-90',
  link: 'bg-transparent text-[var(--brand-primary)] underline-offset-4 hover:underline p-0',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Button component built with Radix UI Slot for maximum flexibility
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || isLoading;

    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200';
    const focusClasses =
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2';
    const disabledClasses = 'disabled:pointer-events-none disabled:opacity-50';
    const variantClass = variantStyles[variant];
    const sizeClass = sizeStyles[size];
    const widthClass = fullWidth ? 'w-full' : '';

    const buttonContent = (
      <>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {!isLoading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </>
    );

    return (
      <Comp
        className={`${baseClasses} ${focusClasses} ${disabledClasses} ${variantClass} ${sizeClass} ${widthClass} ${className || ''}`.trim()}
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button };
