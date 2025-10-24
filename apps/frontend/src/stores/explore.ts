// Explore Page Filter State Store with URL Sync
import { atom, computed } from 'nanostores';
import type {
  GenreResponse,
  PlatformResponse,
  DeveloperResponse,
  PublisherResponse,
  GamesQuery,
} from '@questlog/shared-types';
import { getAllGenres } from '../services/genres';
import { getAllPlatforms } from '../services/platforms';
import { getDevelopers } from '../services/developers';
import { getAllPublishers } from '../services/publishers';

// 1. Filter Options State (Sidebar Data)
export const $filterOptions = atom<{
  genres: GenreResponse[];
  platforms: PlatformResponse[];
  developers: DeveloperResponse[];
  publishers: PublisherResponse[];
} | null>(null);

export const $filterOptionsLoading = atom<boolean>(false);
export const $filterOptionsError = atom<string | null>(null);

export const loadFilterOptions = async () => {
  if ($filterOptions.get()) return;
  $filterOptionsLoading.set(true);
  $filterOptionsError.set(null);
  try {
    const [genresRes, platformsRes, developersRes, publishersRes] = await Promise.all([
      getAllGenres(),
      getAllPlatforms(),
      getDevelopers(),
      getAllPublishers(),
    ]);

    $filterOptions.set({
      genres: genresRes.data,
      platforms: platformsRes.data,
      developers: developersRes.items,
      publishers: publishersRes.data,
    });
  } catch (error: any) {
    $filterOptionsError.set(error.message || 'Failed to load filter options');
    console.error('Filter options error:', error);
  } finally {
    $filterOptionsLoading.set(false);
  }
};

// 2. Selected Filters State (User Query)
export const $selectedFilters = atom<GamesQuery>({
  page: 1,
  limit: 20,
  sortBy: 'averageRating',
  sortOrder: 'desc',
  genreIds: [],
  platformIds: [],
  developerId: undefined,
  publisherId: undefined,
  search: '',
  status: undefined,
});

export const $filterUrlParams = computed($selectedFilters, (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (!Array.isArray(value)) {
        params.set(key, String(value));
      }
    }
  });
  return params.toString();
});

// 3. Filter Actions with Debouncing
let debounceTimer: ReturnType<typeof setTimeout>;

export const setFilter = (key: keyof GamesQuery, value: any) => {
  const current = $selectedFilters.get();
  const updates = key === 'page' ? { [key]: value } : { [key]: value, page: 1 };
  $selectedFilters.set({ ...current, ...updates });
  if (key === 'search') {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => updateUrl(), 300);
  } else {
    updateUrl();
  }
};

export const toggleArrayFilter = (key: 'genreIds' | 'platformIds', id: string) => {
  const current = $selectedFilters.get();
  const array: string[] = (current[key] as string[]) || [];
  const newArray = array.includes(id)
    ? array.filter((item: string) => item !== id)
    : [...array, id];
  setFilter(key, newArray);
};

export const clearFilters = () => {
  $selectedFilters.set({
    page: 1,
    limit: 20,
    sortBy: 'averageRating',
    sortOrder: 'desc',
    genreIds: [],
    platformIds: [],
    developerId: undefined,
    publisherId: undefined,
    search: '',
    status: undefined,
  });
  updateUrl();
};

export const setPage = (page: number) => {
  setFilter('page', page);
};

const updateUrl = () => {
  const params = $filterUrlParams.get();
  const newUrl = params ? `/games?${params}` : '/games';
  window.history.replaceState({}, '', newUrl);
};

export const initializeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const filters: Partial<GamesQuery> = {};
  params.forEach((value, key) => {
    if (key === 'genreIds' || key === 'platformIds') {
      filters[key] = value.split(',');
    } else if (key === 'page' || key === 'limit') {
      filters[key] = parseInt(value, 10);
    } else if (key === 'developerId' || key === 'publisherId') {
      filters[key] = value !== '' ? value : undefined;
    }
  });
  $selectedFilters.set({ ...$selectedFilters.get(), ...filters });
};
