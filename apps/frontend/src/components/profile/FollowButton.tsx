import { useFollowActions } from '@/hooks/useSocial';
import { useState } from 'react';

// ============================================================================
// Props Interface
// ============================================================================

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
}

// ============================================================================
// FollowButton Component
// ============================================================================

/**
 * Follow/Unfollow button with optimistic updates
 *
 * @example
 * ```tsx
 * <FollowButton userId="user-123" initialIsFollowing={false} />
 * ```
 */
export default function FollowButton({ userId, initialIsFollowing = false }: FollowButtonProps) {
  const { followUser, unfollowUser, followingStatus, loadingActions } = useFollowActions();
  const [error, setError] = useState<string | null>(null);

  // Determine current following status
  const isFollowing = followingStatus[userId] ?? initialIsFollowing;
  const isLoading = loadingActions[userId] ?? false;

  const handleToggle = async () => {
    setError(null);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          w-full px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isFollowing
              ? 'bg-tertiary text-primary border-2 border-tertiary hover:border-error hover:text-error'
              : 'bg-brand-primary text-white hover:bg-brand-accent'
          }
        `}
        aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
        aria-pressed={isFollowing}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
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
            Loading...
          </span>
        ) : isFollowing ? (
          'Following'
        ) : (
          'Follow'
        )}
      </button>
      {error && <span className="text-sm text-error text-center">{error}</span>}
    </div>
  );
}
