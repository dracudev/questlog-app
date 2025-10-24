import { Star, Calendar } from 'lucide-react';
import type { GameResponse } from '@questlog/shared-types';

interface GameCardProps {
  game: GameResponse;
}

export default function GameCard({ game }: GameCardProps) {
  const basic = game.game;
  const releaseYear = basic.releaseDate ? new Date(basic.releaseDate).getFullYear() : null;

  return (
    <a
      href={`/games/${basic.slug}`}
      className="group block rounded-lg transition-transform hover:scale-[1.02]"
      aria-label={`View details for ${basic.title}`}
    >
      {/* Game Cover */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        {basic.coverImage ? (
          <img
            src={basic.coverImage}
            alt={`${basic.title} cover`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-2xl font-bold text-muted-foreground opacity-20">
              {basic.title?.charAt(0) ?? ''}
            </span>
          </div>
        )}

        {/* Average Rating Badge */}
        {basic.averageRating !== undefined && basic.averageRating !== null && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm"
            aria-label={`Average rating: ${basic.averageRating.toFixed(1)} out of 10`}
          >
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span>{basic.averageRating.toFixed(1)}</span>
          </div>
        )}

        {/* Review Count Badge */}
        {basic.reviewCount > 0 && (
          <div className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {basic.reviewCount} {basic.reviewCount === 1 ? 'review' : 'reviews'}
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {basic.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {releaseYear && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <span>{releaseYear}</span>
            </div>
          )}

          {game.developer && (
            <>
              <span aria-hidden="true">•</span>
              <span className="line-clamp-1">{game.developer.name}</span>
            </>
          )}
        </div>

        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {game.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {genre.name}
              </span>
            ))}
            {game.genres.length > 3 && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                +{game.genres.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
