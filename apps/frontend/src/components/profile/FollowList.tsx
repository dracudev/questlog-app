import { useStore } from '@nanostores/react';
import * as Avatar from '@radix-ui/react-avatar';
import { $viewedFollowers, $viewedFollowing } from '@/stores/users';
import type { UserResponse } from '@questlog/shared-types';

// ============================================================================
// Props Interface
// ============================================================================

interface FollowListProps {
  type: 'followers' | 'following';
  username: string;
}

// ============================================================================
// FollowList Component
// ============================================================================

/**
 * Reusable component for displaying followers or following lists
 *
 * @example
 * ```tsx
 * <FollowList type="followers" username="john_doe" />
 * <FollowList type="following" username="jane_smith" />
 * ```
 */
export default function FollowList({ type, username }: FollowListProps) {
  const followers = useStore($viewedFollowers);
  const following = useStore($viewedFollowing);

  // Select the appropriate data based on type
  const data = type === 'followers' ? followers : following;
  const users = data?.items || [];

  // Loading state
  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <UserSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-muted-foreground mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-foreground font-semibold mb-1">
          No {type === 'followers' ? 'followers' : 'following'} yet
        </p>
        <p className="text-muted-foreground text-sm">
          {type === 'followers'
            ? `${username} doesn't have any followers yet`
            : `${username} isn't following anyone yet`}
        </p>
      </div>
    );
  }

  // User list
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Pagination info */}
      {data.meta && data.meta.totalPages > 1 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Page {data.meta.page} of {data.meta.totalPages}
        </div>
      )}
    </>
  );
}

// ============================================================================
// UserCard Component
// ============================================================================

interface UserCardProps {
  user: UserResponse;
}

function UserCard({ user }: UserCardProps) {
  // Generate avatar URL with fallback
  const avatarUrl =
    user.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}&size=64`;

  return (
    <a
      href={`/profile/${user.username}`}
      className="flex items-center gap-4 bg-card rounded-lg border border-border p-4 hover:border-accent transition-colors"
    >
      {/* Avatar with Radix UI */}
      <Avatar.Root className="inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
        <Avatar.Image className="h-full w-full object-cover" src={avatarUrl} alt={user.username} />
        <Avatar.Fallback
          className="flex h-full w-full items-center justify-center bg-muted text-foreground text-sm font-semibold"
          delayMs={600}
        >
          {user.username.slice(0, 2).toUpperCase()}
        </Avatar.Fallback>
      </Avatar.Root>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">
          {user.displayName || user.username}
        </h3>
        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
      </div>

      {/* Arrow icon */}
      <svg
        className="w-5 h-5 text-muted-foreground flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

// ============================================================================
// UserSkeleton Component
// ============================================================================

function UserSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-card rounded-lg border border-border p-4 animate-pulse">
      {/* Avatar skeleton */}
      <div className="w-12 h-12 bg-muted rounded-full" />

      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-muted rounded w-32" />
        <div className="h-4 bg-muted rounded w-24" />
      </div>

      {/* Arrow skeleton */}
      <div className="w-5 h-5 bg-muted rounded" />
    </div>
  );
}
