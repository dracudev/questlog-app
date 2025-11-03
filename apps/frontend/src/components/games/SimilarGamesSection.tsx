import { useSimilarGames } from '@/hooks/useGames';
import GameCard from './GameCard';

export default function SimilarGamesSection() {
  const { games: similarGames, isLoading } = useSimilarGames();

  if (isLoading) {
    return <SimilarGamesSkeleton />;
  }

  if (!similarGames || similarGames.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Similar Games</h2>

      {/* Mobile: Horizontal Scroll */}
      <div className="lg:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {similarGames.map((game) => (
          <div key={game.game.id} className="snap-start shrink-0 w-48">
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:grid grid-cols-3 xl:grid-cols-6 gap-6">
        {similarGames.map((game) => (
          <GameCard key={game.game.id} game={game} />
        ))}
      </div>
    </section>
  );
}

function SimilarGamesSkeleton() {
  return (
    <section className="mb-12 animate-pulse">
      <div className="h-8 bg-secondary rounded w-48 mb-6" />
      <div className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="shrink-0 w-48 lg:w-auto">
            <div className="aspect-[3/4] bg-secondary rounded-lg mb-2" />
            <div className="h-4 bg-secondary rounded w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}
