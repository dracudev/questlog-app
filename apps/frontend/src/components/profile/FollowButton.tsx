import { useFollowActions } from '@/hooks/useSocial';
import { useEffect, useState } from 'react';
import { setFollowingStatus } from '@/stores/social';
import { $currentUser } from '@/stores/auth';
import { useStore } from '@nanostores/react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

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
  const { followUser, unfollowUser, followingStatus, loadingActions } =
    useFollowActions();
  const currentUser = useStore($currentUser);
  const [error, setError] = useState<string | null>(null);

  // Seed the store with the SSR initial value on mount
  useEffect(() => {
    setFollowingStatus(userId, initialIsFollowing);
  }, [userId, initialIsFollowing]);

  // Determine current following status
  const isFollowing = followingStatus[userId] ?? initialIsFollowing;
  const isLoading = loadingActions[userId] ?? false;

  const handleToggle = async () => {
    if (!currentUser) {
      toast('Log in to follow users', { description: <a href="/auth/login" style={{ color: '#2cb67d', textDecoration: 'underline' }}>Go to login</a> });
      return;
    }
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
      <Button
        onClick={handleToggle}
        disabled={isLoading}
        variant={isFollowing ? 'outline' : 'primary'}
        isLoading={isLoading}
        fullWidth
        className={
          isFollowing ? 'hover:border-[var(--accent-error)] hover:text-[var(--accent-error)]' : ''
        }
        aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
        aria-pressed={isFollowing}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
      {error && <span className="text-sm text-error text-center">{error}</span>}
    </div>
  );
}
