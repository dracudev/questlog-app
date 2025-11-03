import { useStore } from '@nanostores/react';
import * as Avatar from '@radix-ui/react-avatar';
import type { UserProfile } from '@questlog/shared-types';
import { $currentUser } from '@/stores/auth';
import { $viewedProfile } from '@/stores/users';
import FollowButton from './FollowButton';
import { useState } from 'react';
import EditProfileDialog from './EditProfileDialog';
import { Button } from '@/components/ui/Button';

// ============================================================================
// Props Interface
// ============================================================================

interface ProfileHeaderProps {
  profile: UserProfile;
}

// ============================================================================
// ProfileHeader Component
// ============================================================================

/**
 * Profile header displaying avatar, bio, stats, and action buttons
 *
 * @example
 * ```tsx
 * <ProfileHeader profile={userProfile} />
 * ```
 */
export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const currentUser = useStore($currentUser);
  const viewedProfile = useStore($viewedProfile);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Use the store version if available (for real-time updates), otherwise use the prop
  const displayProfile = viewedProfile || profile;

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUser?.id === displayProfile.id;

  // Generate avatar URL with fallback
  const avatarUrl =
    displayProfile.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayProfile.username)}&size=128`;

  return (
    <>
      <div className="bg-secondary rounded-lg shadow-lg border border-tertiary p-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Column 1: Avatar*/}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <Avatar.Root className="inline-flex h-24 w-24 lg:h-32 lg:w-32 select-none items-center justify-center overflow-hidden rounded-full border-4 border-tertiary align-middle">
                <Avatar.Image
                  className="h-full w-full object-cover"
                  src={avatarUrl}
                  alt={displayProfile.username}
                />
                <Avatar.Fallback
                  className="flex h-full w-full items-center justify-center bg-tertiary text-primary text-2xl lg:text-3xl font-semibold"
                  delayMs={600}
                >
                  {displayProfile.username.slice(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              {displayProfile.isPrivate && (
                <div
                  className="absolute bottom-0 right-0 bg-tertiary rounded-full p-2 border-2 border-secondary"
                  title="Private Profile"
                >
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Profile Info  */}
          <div className="mt-6 lg:mt-0 lg:col-span-1 text-center lg:text-left">
            {/* Username */}
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">
              {displayProfile.displayName || displayProfile.username}
            </h1>
            <p className="text-base lg:text-lg text-muted">@{displayProfile.username}</p>

            {/* Bio */}
            {displayProfile.bio && (
              <p className="mt-4 text-secondary whitespace-pre-wrap">{displayProfile.bio}</p>
            )}

            {/* Additional Info */}
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-muted">
              {displayProfile.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {displayProfile.location}
                </span>
              )}
              {displayProfile.website && (
                <a
                  href={displayProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  {new URL(displayProfile.website).hostname}
                </a>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Joined{' '}
                {new Date(displayProfile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-6 flex justify-center lg:justify-start gap-8">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">
                  {displayProfile.stats.reviewsCount}
                </div>
                <div className="text-sm text-muted">Reviews</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">
                  {displayProfile.stats.followersCount}
                </div>
                <div className="text-sm text-muted">Followers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">
                  {displayProfile.stats.followingCount}
                </div>
                <div className="text-sm text-muted">Following</div>
              </div>
            </div>
          </div>

          {/* Column 3: Action Buttons */}
          <div className="mt-6 lg:mt-0 flex flex-col items-stretch lg:items-end lg:justify-start">
            {isOwnProfile ? (
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                variant="primary"
                className="w-full lg:w-auto"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="w-full lg:w-auto">
                <FollowButton
                  userId={displayProfile.id}
                  initialIsFollowing={displayProfile.isFollowing}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {isOwnProfile && (
        <EditProfileDialog
          profile={displayProfile}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </>
  );
}
