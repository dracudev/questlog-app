import { useState } from 'react';
import { Calendar, Users, Building2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useGameDetail } from '@/hooks/useGames';
import ReviewFormDialog from './ReviewFormDialog';

export default function GameHeader() {
  const { game, isLoading } = useGameDetail();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  if (isLoading || !game) {
    return <GameHeaderSkeleton />;
  }

  const releaseDate = game.game.releaseDate
    ? new Date(game.game.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'TBA';

  // Fallback placeholder for missing cover images
  const coverSrc = game.game.coverImage || '/images/game-placeholder.svg';

  return (
    <header className="mb-8">
      {/* Mobile Layout: Vertical */}
      <div className="flex flex-col gap-6 lg:hidden">
        {/* Cover Image */}
        <img
          src={coverSrc}
          alt={game.game.title}
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />

        {/* Title and Meta */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{game.game.title}</h1>

          {game.developer && (
            <a
              href={`/developers/${game.developer.slug}`}
              className="text-brand-primary hover:underline flex items-center gap-2 mb-1"
            >
              <Users size={16} />
              {game.developer.name}
            </a>
          )}

          {game.publisher && (
            <a
              href={`/publishers/${game.publisher.slug}`}
              className="text-text-secondary hover:text-brand-primary flex items-center gap-2"
            >
              <Building2 size={16} />
              {game.publisher.name}
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <ActionButtons onWriteReview={() => setIsReviewDialogOpen(true)} />
      </div>

      {/* Desktop Layout: Horizontal */}
      <div className="hidden lg:flex gap-8">
        {/* Cover Image (show placeholder if missing) */}
        <img
          src={coverSrc}
          alt={game.game.title}
          className="w-64 h-96 object-cover rounded-lg shadow-lg flex-shrink-0"
        />

        {/* Info and Actions */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-bold text-text-primary mb-4">{game.game.title}</h1>

            <div className="space-y-2 text-text-secondary mb-6">
              {game.developer && (
                <a
                  href={`/developers/${game.developer.slug}`}
                  className="text-brand-primary hover:underline flex items-center gap-2"
                >
                  <Users size={18} />
                  <span className="text-lg">{game.developer.name}</span>
                </a>
              )}

              {game.publisher && (
                <a
                  href={`/publishers/${game.publisher.slug}`}
                  className="hover:text-brand-primary flex items-center gap-2"
                >
                  <Building2 size={18} />
                  <span className="text-lg">{game.publisher.name}</span>
                </a>
              )}

              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span className="text-lg">{releaseDate}</span>
              </div>
            </div>

            {/* Platforms */}
            {game.platforms && game.platforms.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {game.platforms.map((platform) => (
                  <span
                    key={platform.id}
                    className="px-3 py-1 bg-bg-secondary text-text-primary text-sm rounded-md"
                  >
                    {platform.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <ActionButtons onWriteReview={() => setIsReviewDialogOpen(true)} />
        </div>
      </div>

      {/* Review Dialog */}
      <ReviewFormDialog
        gameId={game.game.id}
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
      />
    </header>
  );
}

function ActionButtons({ onWriteReview }: { onWriteReview: () => void }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onWriteReview}
        className="flex-1 lg:flex-initial px-6 py-3 bg-brand-primary text-text-primary font-semibold rounded-md hover:bg-opacity-90 transition-colors"
      >
        Write Review
      </button>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex-1 lg:flex-initial px-6 py-3 bg-bg-secondary text-text-primary font-semibold rounded-md hover:bg-bg-tertiary transition-colors">
            Add to List
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] bg-bg-secondary rounded-md p-2 shadow-lg"
            sideOffset={5}
          >
            <DropdownMenu.Item className="px-3 py-2 text-text-primary rounded hover:bg-bg-tertiary cursor-pointer outline-none">
              Favorites
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-2 text-text-primary rounded hover:bg-bg-tertiary cursor-pointer outline-none">
              Playing
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-2 text-text-primary rounded hover:bg-bg-tertiary cursor-pointer outline-none">
              Completed
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-2 text-text-primary rounded hover:bg-bg-tertiary cursor-pointer outline-none">
              Want to Play
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

function GameHeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="flex flex-col gap-6 lg:hidden">
        <div className="w-full h-64 bg-bg-secondary rounded-lg" />
        <div className="h-8 bg-bg-secondary rounded w-3/4" />
        <div className="h-4 bg-bg-secondary rounded w-1/2" />
      </div>
    </div>
  );
}
