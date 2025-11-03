import * as Tabs from '@radix-ui/react-tabs';
import type { UserProfile } from '@questlog/shared-types';
import ReviewList from './ReviewList';
import FollowList from './FollowList';

// ============================================================================
// Props Interface
// ============================================================================

interface ProfileTabsProps {
  profile: UserProfile;
}

// ============================================================================
// ProfileTabs Component
// ============================================================================

/**
 * Tabbed navigation for profile sections (Reviews, Followers, Following)
 *
 * @example
 * ```tsx
 * <ProfileTabs profile={userProfile} />
 * ```
 */
export default function ProfileTabs({ profile }: ProfileTabsProps) {
  return (
    <Tabs.Root defaultValue="reviews" className="w-full">
      {/* Tab List */}
      <Tabs.List
        className="flex gap-1 border-b border-tertiary mb-6 overflow-x-auto scrollbar-hide"
        aria-label="Profile sections"
      >
        <Tabs.Trigger
          value="reviews"
          className="p-4 text-sm font-semibold text-muted hover:text-primary transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Reviews
          <span className="ml-2 text-xs bg-tertiary px-2 py-0.5 rounded-full">
            {profile.stats.reviewsCount}
          </span>
        </Tabs.Trigger>

        <Tabs.Trigger
          value="followers"
          className="p-4 text-sm font-semibold text-muted hover:text-primary transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Followers
          <span className="ml-2 text-xs bg-tertiary px-2 py-0.5 rounded-full">
            {profile.stats.followersCount}
          </span>
        </Tabs.Trigger>

        <Tabs.Trigger
          value="following"
          className="p-4 text-sm font-semibold text-muted hover:text-primary transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Following
          <span className="ml-2 text-xs bg-tertiary px-2 py-0.5 rounded-full">
            {profile.stats.followingCount}
          </span>
        </Tabs.Trigger>
      </Tabs.List>

      {/* Tab Content */}
      <Tabs.Content value="reviews" className="focus:outline-none">
        <ReviewList userId={profile.id} />
      </Tabs.Content>

      <Tabs.Content value="followers" className="focus:outline-none">
        <FollowList type="followers" username={profile.username} />
      </Tabs.Content>

      <Tabs.Content value="following" className="focus:outline-none">
        <FollowList type="following" username={profile.username} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
