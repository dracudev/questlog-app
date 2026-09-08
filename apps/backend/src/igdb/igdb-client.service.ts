import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IgdbAuthService } from './igdb-auth.service';
import { IgdbGame } from './igdb.types';

const IGDB_FIELDS = [
  'id',
  'name',
  'slug',
  'summary',
  'storyline',
  'first_release_date',
  'cover.image_id',
  'screenshots.image_id',
  'videos.video_id',
  'videos.name',
  'genres.id',
  'genres.name',
  'genres.slug',
  'platforms.id',
  'platforms.name',
  'platforms.slug',
  'platforms.abbreviation',
  'involved_companies.company.id',
  'involved_companies.company.name',
  'involved_companies.company.slug',
  'involved_companies.developer',
  'involved_companies.publisher',
  'total_rating',
  'rating',
  'rating_count',
  'aggregated_rating',
  'status',
  'category',
].join(',');

@Injectable()
export class IgdbClientService {
  private readonly logger = new Logger(IgdbClientService.name);
  private lastRequestAt = 0;

  // ponytail: naive 250ms throttle for IGDB 4 req/s limit, per-instance lock if concurrency matters
  private async throttle() {
    const now = Date.now();
    const elapsed = now - this.lastRequestAt;
    if (elapsed < 250) {
      await new Promise((r) => setTimeout(r, 250 - elapsed));
    }
    this.lastRequestAt = Date.now();
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: IgdbAuthService,
  ) {}

  private get baseUrl(): string {
    return this.configService.get<string>('IGDB_BASE_URL') || 'https://api.igdb.com/v4';
  }

  private get clientId(): string {
    const id = this.configService.get<string>('TWITCH_CLIENT_ID');
    if (!id) throw new InternalServerErrorException('TWITCH_CLIENT_ID not configured');
    return id;
  }

  private async request<T>(endpoint: string, apicalypseQuery: string): Promise<T> {
    await this.throttle();
    const token = await this.authService.getAccessToken();

    const url = `${this.baseUrl}/${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: apicalypseQuery,
    });

    if (res.status === 401) {
      this.logger.warn('IGDB 401, clearing token cache and retrying once');
      this.authService.clearCache();
      const retryToken = await this.authService.getAccessToken();
      const retryRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          Authorization: `Bearer ${retryToken}`,
          'Content-Type': 'text/plain',
        },
        body: apicalypseQuery,
      });
      if (!retryRes.ok) {
        const text = await retryRes.text().catch(() => '');
        throw new InternalServerErrorException(`IGDB request failed: ${retryRes.status} ${text}`);
      }
      return (await retryRes.json()) as T;
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      this.logger.error(`IGDB ${endpoint} failed: ${res.status} ${text} | query: ${apicalypseQuery}`);
      throw new InternalServerErrorException(`IGDB request failed: ${res.status}`);
    }

    return (await res.json()) as T;
  }

  // ---- Public API ----

  async searchGames(options: {
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    where?: string;
  }): Promise<IgdbGame[]> {
    const limit = Math.min(options.limit ?? 12, 100);
    const offset = options.offset ?? 0;

    const sortMap: Record<string, string> = {
      title: 'name',
      releaseDate: 'first_release_date',
      averageRating: 'total_rating',
      rating: 'total_rating',
      reviewCount: 'rating_count',
      createdAt: 'first_release_date',
    };
    const igdbSort = sortMap[options.sortBy || ''] || 'total_rating';
    const order = options.sortOrder === 'asc' ? 'asc' : 'desc';

    let query = `fields ${IGDB_FIELDS};`;

    if (options.search?.trim()) {
      const term = options.search.trim().replace(/"/g, '\\"');
      query += ` search "${term}";`;
      // boost relevance but still sort
      query += ` limit ${limit}; offset ${offset};`;
      // IGDB search ignores sort, but we can attempt where + sort fallback if needed
    } else {
      // category = 0 returned empty in live test (IGDB enum changed), use broader filter
      const whereClauses: string[] = ['cover != null'];
      // When sorting by rating, require rating to exist so we return meaningful popular games
      if (igdbSort === 'total_rating' || igdbSort === 'rating') {
        whereClauses.push('total_rating != null');
      }
      if (options.where) whereClauses.push(options.where);
      query += ` where ${whereClauses.join(' & ')};`;
      query += ` sort ${igdbSort} ${order};`;
      query += ` limit ${limit}; offset ${offset};`;
    }

    this.logger.debug(`IGDB search query: ${query}`);
    return this.request<IgdbGame[]>('games', query);
  }

  async countGames(options: { search?: string; where?: string }): Promise<number> {
    let query = '';
    if (options.search?.trim()) {
      const term = options.search.trim().replace(/"/g, '\\"');
      query = `search "${term}";`;
    } else {
      const whereClauses: string[] = ['cover != null', 'total_rating != null'];
      if (options.where) whereClauses.push(options.where);
      query = `where ${whereClauses.join(' & ')};`;
    }
    try {
      // IGDB count returns { count: N } (object), not array — handle both
      const result: any = await this.request<any>('games/count', query);
      if (result && typeof result.count === 'number') return result.count;
      if (Array.isArray(result) && result[0]?.count !== undefined) return result[0].count;
      return 500;
    } catch {
      return 500;
    }
  }

  async findBySlug(slug: string): Promise<IgdbGame | null> {
    const query = `fields ${IGDB_FIELDS}; where slug = "${slug}"; limit 1;`;
    const res = await this.request<IgdbGame[]>('games', query);
    return res[0] || null;
  }

  async findById(id: number): Promise<IgdbGame | null> {
    const query = `fields ${IGDB_FIELDS}; where id = ${id}; limit 1;`;
    const res = await this.request<IgdbGame[]>('games', query);
    return res[0] || null;
  }

  async getSimilarGames(gameId: number, limit = 6): Promise<IgdbGame[]> {
    const source = await this.findById(gameId);
    if (!source || !source.genres?.length) {
      return this.searchGames({ limit, sortBy: 'total_rating', sortOrder: 'desc' });
    }
    const genreIds = source.genres.map((g) => g.id).join(',');
    const where = `genres = (${genreIds}) & id != ${gameId}`;
    return this.searchGames({ limit, sortBy: 'total_rating', sortOrder: 'desc', where });
  }

  async getPopularGames(limit = 12): Promise<IgdbGame[]> {
    return this.searchGames({ limit, sortBy: 'total_rating', sortOrder: 'desc' });
  }

  async getRecentGames(limit = 12): Promise<IgdbGame[]> {
    return this.searchGames({ limit, sortBy: 'first_release_date', sortOrder: 'desc' });
  }
}
