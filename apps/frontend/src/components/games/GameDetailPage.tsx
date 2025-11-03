import { useEffect } from 'react';
import type { GameDetail, PaginatedReviewsResponse, GameResponse } from '@questlog/shared-types';
import { setGameDetailWithCache, setSimilarGames } from '@/stores/games';
import { setGameReviews } from '@/stores/reviews';
import GameHeader from './GameHeader';
import GameTabs from './GameTabs';
import SimilarGamesSection from './SimilarGamesSection';

interface GameDetailPageProps {
  initialGame: GameDetail;
  initialReviews: PaginatedReviewsResponse;
  initialSimilarGames: GameResponse[];
}

export default function GameDetailPage({
  initialGame,
  initialReviews,
  initialSimilarGames,
}: GameDetailPageProps) {
  // Hydrate stores on mount with server-fetched data
  useEffect(() => {
    setGameDetailWithCache(initialGame, initialGame.game.slug);
    setGameReviews(initialReviews, initialGame.game.id);
    setSimilarGames(initialSimilarGames);
  }, [initialGame, initialReviews, initialSimilarGames]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <GameHeader />
        <GameTabs />
        <SimilarGamesSection />
      </div>
    </div>
  );
}
