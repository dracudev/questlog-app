import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $isAuthenticated, $authLoading, initializeAuthState } from '@/stores/auth';

/**
 * Client-only component (island) that redirects an authenticated user to /feed
 * once the client-side auth state has finished initializing.
 *
 * Use with: <ClientAuthRedirect client:load /> in an .astro page.
 */
export default function ClientAuthRedirect(): null {
  // Trigger initialization once on mount
  useEffect(() => {
    try {
      initializeAuthState();
    } catch (err) {
      console.warn('initializeAuthState failed', err);
    }
  }, []);

  // Subscribe to store values through the React hook which is bundler-friendly
  const isLoading = useStore($authLoading);
  const isAuthenticated = useStore($isAuthenticated);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = '/feed';
    }
  }, [isLoading, isAuthenticated]);

  return null;
}
