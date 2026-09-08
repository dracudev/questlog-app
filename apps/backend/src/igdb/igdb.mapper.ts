import { IgdbGame } from './igdb.types';
import { GameResponseDto, GameBasicDto } from '@/games/dto/game-response.dto';
import { GameDetailDto } from '@/games/dto/game-detail.dto';

// IGDB image helper — ponytail: hardcoded sizes, change if design wants higher res
const IGDB_IMAGE_BASE = 'https://images.igdb.com/igdb/image/upload';

function coverUrl(imageId: string, size = 't_cover_big'): string {
  return `${IGDB_IMAGE_BASE}/${size}/${imageId}.jpg`;
}

function screenshotUrl(imageId: string, size = 't_screenshot_med'): string {
  return `${IGDB_IMAGE_BASE}/${size}/${imageId}.jpg`;
}

const STATUS_MAP: Record<number, string> = {
  0: 'RELEASED',
  2: 'ALPHA',
  3: 'BETA',
  4: 'EARLY_ACCESS',
  5: 'ALPHA',
  6: 'BETA',
  7: 'RELEASED',
  8: 'RELEASED',
};

export function mapIgdbStatus(igdbStatus?: number): string {
  if (igdbStatus === undefined || igdbStatus === null) return 'RELEASED';
  return STATUS_MAP[igdbStatus] || 'RELEASED';
}

export function toGameResponseDto(igdb: IgdbGame): GameResponseDto {
  const developerCompany = igdb.involved_companies?.find((ic) => ic.developer)?.company;
  const publisherCompany = igdb.involved_companies?.find((ic) => ic.publisher)?.company;

  const genres = (igdb.genres || []).map((g) => ({
    id: String(g.id),
    name: g.name,
    slug: g.slug,
    games: [] as string[],
  }));

  const platforms = (igdb.platforms || []).map((p) => ({
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    abbreviation: p.abbreviation,
    games: [] as string[],
  }));

  const gameBasic: GameBasicDto = {
    id: String(igdb.id),
    title: igdb.name,
    slug: igdb.slug,
    coverImage: igdb.cover?.image_id ? coverUrl(igdb.cover.image_id) : undefined,
    releaseDate: igdb.first_release_date ? new Date(igdb.first_release_date * 1000) : undefined,
    status: mapIgdbStatus(igdb.status),
    averageRating: igdb.total_rating
      ? Number((igdb.total_rating / 10).toFixed(1))
      : igdb.rating
        ? Number((igdb.rating / 10).toFixed(1))
        : undefined,
    reviewCount: igdb.rating_count || 0,
  };

  return {
    game: gameBasic,
    description: igdb.storyline || igdb.summary,
    summary: igdb.summary,
    screenshots: (igdb.screenshots || [])
      .map((s) => screenshotUrl(s.image_id))
      .slice(0, 8),
    videos: (igdb.videos || []).map((v) => `https://www.youtube.com/watch?v=${v.video_id}`),
    playCount: 0,
    developer: developerCompany
      ? {
          id: String(developerCompany.id),
          name: developerCompany.name,
          slug: developerCompany.slug,
          description: undefined,
          logo: undefined,
          country: undefined,
        }
      : undefined,
    publisher: publisherCompany
      ? {
          id: String(publisherCompany.id),
          name: publisherCompany.name,
          slug: publisherCompany.slug,
          description: undefined,
          logo: undefined,
          games: [] as string[],
        }
      : undefined,
    genres,
    platforms,
    createdAt: igdb.first_release_date ? new Date(igdb.first_release_date * 1000) : new Date(),
    updatedAt: new Date(),
    igdbId: igdb.id,
    rawgId: undefined,
    steamId: undefined,
    metacriticId: undefined,
  };
}

export function toGameDetailDto(igdb: IgdbGame): GameDetailDto {
  const base = toGameResponseDto(igdb);
  return {
    ...base,
    recentReviews: [],
  };
}
