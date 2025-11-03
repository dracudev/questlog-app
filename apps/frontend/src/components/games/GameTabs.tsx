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
      <Tabs.List className="flex gap-4 border-b border-border mb-6 overflow-x-auto">
        <Tabs.Trigger
          value="about"
          className="px-4 py-3 text-secondary-foreground font-medium border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary hover:text-foreground transition-colors whitespace-nowrap cursor-pointer"
        >
          About
        </Tabs.Trigger>
        <Tabs.Trigger
          value="reviews"
          className="px-4 py-3 text-secondary-foreground font-medium border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary hover:text-foreground transition-colors whitespace-nowrap cursor-pointer"
        >
          Reviews
        </Tabs.Trigger>
        <Tabs.Trigger
          value="details"
          className="px-4 py-3 text-secondary-foreground font-medium border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary hover:text-foreground transition-colors whitespace-nowrap cursor-pointer"
        >
          Details
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="about" className="focus:outline-none">
        <div className="prose prose-invert max-w-none">
          <p className="text-secondary-foreground text-lg leading-relaxed whitespace-pre-wrap">
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
              <h3 className="text-xl font-semibold text-foreground mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <a
                    key={genre.id}
                    href={`/games?genreIds=${genre.id}`}
                    className="px-4 py-2 bg-secondary text-primary rounded-md hover:bg-muted transition-colors"
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
              <h3 className="text-xl font-semibold text-foreground mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((platform) => (
                  <span
                    key={platform.id}
                    className="px-4 py-2 bg-secondary text-foreground rounded-md"
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
              <h3 className="text-xl font-semibold text-foreground mb-3">Release Date</h3>
              <p className="text-secondary-foreground text-lg">
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
      <div className="flex gap-4 border-b border-border mb-6">
        <div className="h-10 w-24 bg-secondary rounded" />
        <div className="h-10 w-24 bg-secondary rounded" />
        <div className="h-10 w-24 bg-secondary rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-5/6" />
        <div className="h-4 bg-secondary rounded w-4/6" />
      </div>
    </div>
  );
}
