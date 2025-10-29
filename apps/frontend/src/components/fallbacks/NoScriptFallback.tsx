interface NoScriptFallbackProps {
  /** The feature that requires JavaScript */
  feature: string;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Custom message override */
  message?: string;
}

/**
 * NoScript fallback component that displays a warning message to users
 * who have JavaScript disabled, informing them about required functionality.
 *
 * @example
 * ```tsx
 * <NoScriptFallback feature="login form" />
 * <NoScriptFallback feature="registration form" />
 * <NoScriptFallback
 *   feature="interactive dashboard"
 *   message="Custom message here"
 * />
 * ```
 */
export default function NoScriptFallback({
  feature,
  className = '',
  message,
}: NoScriptFallbackProps) {
  const defaultMessage = `JavaScript is required for the interactive ${feature}. Please enable JavaScript or contact support for assistance.`;

  return (
    <noscript>
      <div
        className={`mt-4 p-4 rounded-md border bg-state-warning/10 border-state-warning/20 ${className}`}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-state-warning"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-state-warning">JavaScript Required</h3>
            <div className="mt-2 text-sm text-state-warning">{message || defaultMessage}</div>
            <div className="mt-3">
              <div className="flex space-x-4 text-xs">
                <a
                  href="/support"
                  className="font-medium text-state-warning hover:text-state-warning/80 transition-colors underline"
                >
                  Contact Support
                </a>
                <span className="text-state-warning/60">•</span>
                <a
                  href="/help/javascript"
                  className="font-medium text-state-warning hover:text-state-warning/80 transition-colors underline"
                >
                  Enable JavaScript
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </noscript>
  );
}
