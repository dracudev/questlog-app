import * as Tabs from '@radix-ui/react-tabs';
import { useGameDetail } from '@/hooks/useGames';
import GameReviewList from './GameReviewList';

export default function GameTabs() {
  const { game, isLoading } = useGameDetail();

  if (isLoading || !game) {
    return <GameTabsSkeleton />;
  }

  return (
    <Tabs.Root defaultValue="about" className="mb-12">
      <Tabs.List className="flex gap-4 border-b border-bg-tertiary mb-6 overflow-x-auto">
        <Tabs.Trigger
          value="about"
          className="px-4 py-3 text-text-secondary font-medium border-b-2 border-transparent data-[state=active]:text-brand-primary data-[state=active]:border-brand-primary hover:text-text-primary transition-colors whitespace-nowrap"
        >
          About
        </Tabs.Trigger>
        <Tabs.Trigger
          value="reviews"
          className="px-4 py-3 text-text-secondary font-medium border-b-2 border-transparent data-[state=active]:text-brand-primary data-[state=active]:border-brand-primary hover:text-text-primary transition-colors whitespace-nowrap"
        >
          Reviews
        </Tabs.Trigger>
        <Tabs.Trigger
          value="details"
          className="px-4 py-3 text-text-secondary font-medium border-b-2 border-transparent data-[state=active]:text-brand-primary data-[state=active]:border-brand-primary hover:text-text-primary transition-colors whitespace-nowrap"
        >
          Details
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="about" className="focus:outline-none">
        <div className="prose prose-invert max-w-none">
          <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap">
            {game.description || 'No description available.'}
          </p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="reviews" className="focus:outline-none">
        <GameReviewList gameId={game.game.id} />
      </Tabs.Content>

      <Tabs.Content value="details" className="focus:outline-none">
        <div className="space-y-6">
          {/* Genres */}
          {game.genres && game.genres.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <a
                    key={genre.id}
                    href={`/games?genreIds=${genre.id}`}
                    className="px-4 py-2 bg-bg-secondary text-brand-primary rounded-md hover:bg-bg-tertiary transition-colors"
                  >
                    {genre.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          {game.platforms && game.platforms.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((platform) => (
                  <span
                    key={platform.id}
                    className="px-4 py-2 bg-bg-secondary text-text-primary rounded-md"
                  >
                    {platform.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Release Date */}
          {game.game.releaseDate && (
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Release Date</h3>
              <p className="text-text-secondary text-lg">
                {new Date(game.game.releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function GameTabsSkeleton() {
  return (
    <div className="mb-12 animate-pulse">
      <div className="flex gap-4 border-b border-bg-tertiary mb-6">
        <div className="h-10 w-24 bg-bg-secondary rounded" />
        <div className="h-10 w-24 bg-bg-secondary rounded" />
        <div className="h-10 w-24 bg-bg-secondary rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-bg-secondary rounded w-full" />
        <div className="h-4 bg-bg-secondary rounded w-5/6" />
        <div className="h-4 bg-bg-secondary rounded w-4/6" />
      </div>
    </div>
  );
}
