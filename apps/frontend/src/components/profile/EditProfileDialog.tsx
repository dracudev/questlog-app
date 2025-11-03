import * as Dialog from '@radix-ui/react-dialog';
import { useCurrentUserProfile } from '@/hooks/useUsers';
import type { UserProfile } from '@questlog/shared-types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

// ============================================================================
// Props Interface
// ============================================================================

interface EditProfileDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// EditProfileDialog Component
// ============================================================================

/**
 * Modal dialog for editing user profile
 *
 * @example
 * ```tsx
 * <EditProfileDialog
 *   profile={currentProfile}
 *   isOpen={isDialogOpen}
 *   onClose={() => setIsDialogOpen(false)}
 * />
 * ```
 */
export default function EditProfileDialog({ profile, isOpen, onClose }: EditProfileDialogProps) {
  const { updateProfile, updateLoading, updateError, clearUpdateError } = useCurrentUserProfile();

  // Form state
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [isPrivate, setIsPrivate] = useState(profile.isPrivate || false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset form when profile changes
  useEffect(() => {
    setDisplayName(profile.displayName || '');
    setBio(profile.bio || '');
    setLocation(profile.location || '');
    setWebsite(profile.website || '');
    setIsPrivate(profile.isPrivate || false);
  }, [profile]);

  // Clear messages when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSuccessMessage(null);
      clearUpdateError();
    }
  }, [isOpen, clearUpdateError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    try {
      await updateProfile({
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        website: website.trim() || undefined,
        isPrivate,
      });

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-lg shadow-xl border border-tertiary p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          aria-describedby="edit-profile-description"
        >
          <Dialog.Title className="text-2xl font-bold text-primary mb-2">Edit Profile</Dialog.Title>
          <Dialog.Description id="edit-profile-description" className="text-muted mb-6">
            Update your profile information
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-primary mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="w-full px-3 py-2 bg-tertiary border border-tertiary rounded-lg text-primary focus:outline-none focus:border-brand-primary"
                placeholder="Your display name"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-primary mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2 bg-tertiary border border-tertiary rounded-lg text-primary focus:outline-none focus:border-brand-primary resize-none"
                placeholder="Tell us about yourself"
              />
              <div className="text-xs text-muted text-right mt-1">{bio.length}/500</div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-primary mb-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2 bg-tertiary border border-tertiary rounded-lg text-primary focus:outline-none focus:border-brand-primary"
                placeholder="City, Country"
              />
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-primary mb-1">
                Website
              </label>
              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 bg-tertiary border border-tertiary rounded-lg text-primary focus:outline-none focus:border-brand-primary"
                placeholder="https://example.com"
              />
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="isPrivate" className="block text-sm font-medium text-primary">
                  Private Profile
                </label>
                <p className="text-xs text-muted">Only followers can see your activity</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isPrivate}
                onClick={() => setIsPrivate(!isPrivate)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${isPrivate ? 'bg-brand-primary' : 'bg-tertiary'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${isPrivate ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Messages */}
            {updateError && (
              <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm">
                {updateError}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-success/10 border border-success rounded-lg text-success text-sm">
                {successMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={onClose}
                disabled={updateLoading}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateLoading}
                variant="primary"
                isLoading={updateLoading}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-muted hover:text-primary transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
