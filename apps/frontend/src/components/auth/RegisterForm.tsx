import { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import type { RegisterRequest } from '@questlog/shared-types';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';

interface RegisterFormProps {
  redirectTo?: string;
  className?: string;
}

export default function RegisterForm({ redirectTo = '/', className = '' }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearError();

    const formData = new FormData(event.currentTarget);
    const data: RegisterRequest = {
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    try {
      await register(data);
      window.location.href = redirectTo;
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Card className={`p-6 sm:p-8 ${className}`}>
      <Form.Root onSubmit={handleSubmit} className="space-y-6">
        {/* Global auth error from $authError store */}
        {error && (
          <Form.Message className="rounded-md p-4 border bg-state-error/10 border-state-error/20">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-state-error">Registration Error</h3>
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
          </Form.Message>
        )}

        {/* Email field */}
        <Form.Field name="email" className="space-y-2">
          <Form.Label className="block text-sm font-medium text-primary">Email address</Form.Label>

          <Form.Control asChild>
            <input
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-tertiary bg-primary rounded-md shadow-sm text-sm transition-all text-primary placeholder:text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </Form.Control>

          <Form.Message match="valueMissing" className="text-sm text-state-error">
            Email is required
          </Form.Message>

          <Form.Message match="typeMismatch" className="text-sm text-state-error">
            Please provide a valid email address
          </Form.Message>
        </Form.Field>

        {/* Username field */}
        <Form.Field name="username" className="space-y-2">
          <Form.Label className="block text-sm font-medium text-primary">Username</Form.Label>

          <Form.Control asChild>
            <input
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={30}
              pattern="^[a-zA-Z0-9_-]+$"
              className="appearance-none block w-full px-3 py-2 border border-tertiary bg-primary rounded-md shadow-sm text-sm transition-all text-primary placeholder:text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Choose a username"
            />
          </Form.Control>

          <Form.Message match="valueMissing" className="text-sm text-state-error">
            Username is required
          </Form.Message>

          <Form.Message match="tooShort" className="text-sm text-state-error">
            Username must be at least 3 characters
          </Form.Message>

          <Form.Message match="tooLong" className="text-sm text-state-error">
            Username must not exceed 30 characters
          </Form.Message>

          <Form.Message match="patternMismatch" className="text-sm text-state-error">
            Username can only contain letters, numbers, underscores, and hyphens
          </Form.Message>

          <p className="text-xs text-muted">
            3-30 characters. Letters, numbers, underscores, and hyphens only.
          </p>
        </Form.Field>

        {/* Password field */}
        <Form.Field name="password" className="space-y-2">
          <Form.Label className="block text-sm font-medium text-primary">Password</Form.Label>

          <div className="relative">
            <Form.Control asChild>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                className="appearance-none block w-full px-3 py-2 pr-10 border border-tertiary bg-primary rounded-md shadow-sm text-sm transition-all text-primary placeholder:text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Create a strong password"
              />
            </Form.Control>

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

          <Form.Message match="valueMissing" className="text-sm text-state-error">
            Password is required
          </Form.Message>

          <Form.Message match="tooShort" className="text-sm text-state-error">
            Password must be at least 8 characters
          </Form.Message>

          <Form.Message match="patternMismatch" className="text-sm text-state-error">
            Password must contain uppercase, lowercase, number, and special character
          </Form.Message>

          <div className="text-xs text-muted space-y-1">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>
        </Form.Field>

        {/* Terms and Privacy Policy */}
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded text-brand-primary border-tertiary bg-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="terms" className="text-secondary">
              I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-primary hover:text-brand-accent transition-colors"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-primary hover:text-brand-accent transition-colors"
              >
                Privacy Policy
              </a>
            </label>
          </div>
        </div>

        {/* Submit button */}
        <Form.Submit asChild>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md transition-colors bg-brand-primary text-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-primary"
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </Form.Submit>
      </Form.Root>
    </Card>
  );
}
