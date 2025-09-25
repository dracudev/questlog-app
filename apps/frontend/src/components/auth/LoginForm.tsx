import React, { useState } from 'react';
import type { LoginRequest } from '@questlog/shared-types';
import { loginSchema } from '@questlog/shared-types';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  redirectTo?: string;
  className?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm({ redirectTo = '/feed', className = '' }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const result = loginSchema.safeParse(formData);

    if (result.success) {
      setFormErrors({});
      return true;
    }

    // Convert Zod errors to form errors
    const newErrors: FormErrors = {};
    result.error.errors.forEach((error) => {
      const fieldName = error.path[0] as keyof FormErrors;
      if (fieldName && !newErrors[fieldName]) {
        newErrors[fieldName] = error.message;
      }
    });

    setFormErrors(newErrors);
    return false;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    clearError();

    try {
      await login(formData);

      window.location.href = redirectTo;
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      {/* Global auth error from hook */}
      {error && (
        <div className="rounded-md p-4 border bg-state-error/10 border-state-error/20">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-state-error">Login Error</h3>
              <div className="mt-2 text-sm text-state-error/80">{error}</div>
              <button
                type="button"
                onClick={clearError}
                className="mt-2 text-sm underline transition-colors text-state-error hover:text-state-error/80"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-primary">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm transition-colors text-primary ${
              formErrors.email
                ? 'border-state-error bg-state-error/5'
                : 'border-tertiary bg-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
            }`}
            placeholder="Enter your email"
            aria-invalid={formErrors.email ? 'true' : 'false'}
            aria-describedby={formErrors.email ? 'email-error' : undefined}
          />
        </div>
        {formErrors.email && (
          <p id="email-error" className="mt-2 text-sm text-state-error">
            {formErrors.email}
          </p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-primary">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm sm:text-sm transition-colors text-primary ${
              formErrors.password
                ? 'border-state-error bg-state-error/5'
                : 'border-tertiary bg-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
            }`}
            placeholder="Enter your password"
            aria-invalid={formErrors.password ? 'true' : 'false'}
            aria-describedby={formErrors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors text-muted hover:text-secondary"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {formErrors.password && (
          <p id="password-error" className="mt-2 text-sm text-state-error">
            {formErrors.password}
          </p>
        )}
      </div>

      {/* Remember me and Forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded text-brand-primary border-tertiary bg-primary focus:ring-2 focus:ring-brand-primary/20"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="/auth/forgot-password"
            className="font-medium transition-colors text-brand-primary hover:text-brand-accent"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      {/* Submit button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md transition-colors bg-brand-primary text-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-primary"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </div>
    </form>
  );
}
