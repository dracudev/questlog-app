import { atom } from 'nanostores';
import type { GenreResponse } from '@questlog/shared-types';
import type { PaginatedGenresResponse } from '@/services/genres';

// ============================================================================
// Genres List State
// ============================================================================

/**
 * Current genres list data with pagination
 */
export const $genresData = atom<PaginatedGenresResponse | null>(null);

/**
 * Genres list loading state
 */
export const $genresLoading = atom<boolean>(false);

/**
 * Genres list error state
 */
export const $genresError = atom<string | null>(null);

// ============================================================================
// Genre Detail State
// ============================================================================

/**
 * Current genre detail data
 */
export const $genreDetail = atom<GenreResponse | null>(null);

/**
 * Currently loaded genre slug/ID (for refetch purposes)
 */
export const $currentGenreId = atom<string | null>(null);

/**
 * Genre detail loading state
 */
export const $genreDetailLoading = atom<boolean>(false);

/**
 * Genre detail error state
 */
export const $genreDetailError = atom<string | null>(null);

// ============================================================================
// Create/Update Genre State
// ============================================================================

/**
 * Genre form submission loading state
 */
export const $genreFormLoading = atom<boolean>(false);

/**
 * Genre form submission error state
 */
export const $genreFormError = atom<string | null>(null);

// ============================================================================
// Genres List Actions
// ============================================================================

/**
 * Set genres list data
 */
export function setGenresData(data: PaginatedGenresResponse) {
  $genresData.set(data);
}

/**
 * Set genres loading state
 */
export function setGenresLoading(loading: boolean) {
  $genresLoading.set(loading);
}

/**
 * Set genres error state
 */
export function setGenresError(error: string | null) {
  $genresError.set(error);
}

/**
 * Clear genres list state
 */
export function clearGenresState() {
  $genresData.set(null);
  $genresLoading.set(false);
  $genresError.set(null);
}

/**
 * Append genres to existing list (for pagination/infinite scroll)
 */
export function appendGenresData(newData: PaginatedGenresResponse) {
  const currentData = $genresData.get();

  if (!currentData) {
    setGenresData(newData);
    return;
  }

  // Merge the new genres with existing ones
  const mergedData: PaginatedGenresResponse = {
    ...newData,
    data: [...currentData.data, ...newData.data],
  };

  $genresData.set(mergedData);
}

// ============================================================================
// Genre Detail Actions
// ============================================================================

/**
 * Set genre detail data
 */
export function setGenreDetail(genre: GenreResponse, id: string) {
  $genreDetail.set(genre);
  $currentGenreId.set(id);
}

/**
 * Set genre detail loading state
 */
export function setGenreDetailLoading(loading: boolean) {
  $genreDetailLoading.set(loading);
}

/**
 * Set genre detail error state
 */
export function setGenreDetailError(error: string | null) {
  $genreDetailError.set(error);
}

/**
 * Clear genre detail state
 */
export function clearGenreDetailState() {
  $genreDetail.set(null);
  $currentGenreId.set(null);
  $genreDetailLoading.set(false);
  $genreDetailError.set(null);
}

/**
 * Update genre detail data (for optimistic updates)
 */
export function updateGenreDetail(updates: Partial<GenreResponse>) {
  const currentGenre = $genreDetail.get();
  if (currentGenre) {
    const updatedGenre = { ...currentGenre, ...updates };
    $genreDetail.set(updatedGenre);
  }
}

// ============================================================================
// Genre Form Actions
// ============================================================================

/**
 * Set genre form loading state
 */
export function setGenreFormLoading(loading: boolean) {
  $genreFormLoading.set(loading);
}

/**
 * Set genre form error state
 */
export function setGenreFormError(error: string | null) {
  $genreFormError.set(error);
}

/**
 * Clear genre form state
 */
export function clearGenreFormState() {
  $genreFormLoading.set(false);
  $genreFormError.set(null);
}

// ============================================================================
// Global Actions
// ============================================================================

/**
 * Clear all genres-related state
 */
export function clearAllGenresState() {
  clearGenresState();
  clearGenreDetailState();
  clearGenreFormState();
}

// ============================================================================
// Cache Management (Optional Enhancement)
// ============================================================================

/**
 * Cache for genre details by ID to avoid refetching
 */
const genreDetailCache = new Map<string, { genre: GenreResponse; timestamp: number }>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached genre detail if available and not expired
 */
export function getCachedGenreDetail(id: string): GenreResponse | null {
  const cached = genreDetailCache.get(id);

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    genreDetailCache.delete(id);
    return null;
  }

  return cached.genre;
}

/**
 * Cache genre detail data
 */
export function cacheGenreDetail(id: string, genre: GenreResponse) {
  genreDetailCache.set(id, {
    genre,
    timestamp: Date.now(),
  });
}

/**
 * Clear genre detail cache
 */
export function clearGenreDetailCache() {
  genreDetailCache.clear();
}

/**
 * Enhanced set genre detail with caching
 */
export function setGenreDetailWithCache(genre: GenreResponse, id: string) {
  setGenreDetail(genre, id);
  cacheGenreDetail(id, genre);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a specific genre is in the current genres list
 */
export function isGenreInList(genreId: string): boolean {
  const genresData = $genresData.get();
  return genresData?.data.some((genre) => genre.id === genreId) || false;
}

/**
 * Get genre from current list by ID
 */
export function getGenreFromList(genreId: string): GenreResponse | null {
  const genresData = $genresData.get();
  return genresData?.data.find((genre) => genre.id === genreId) || null;
}

/**
 * Get genre from current list by slug
 */
export function getGenreFromListBySlug(slug: string): GenreResponse | null {
  const genresData = $genresData.get();
  return genresData?.data.find((genre) => genre.slug === slug) || null;
}

/**
 * Get current pagination info
 */
export function getCurrentPaginationInfo() {
  const genresData = $genresData.get();

  if (!genresData) {
    return {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  return {
    page: genresData.page,
    limit: genresData.limit,
    total: genresData.total,
    totalPages: genresData.totalPages,
    hasNextPage: genresData.hasNextPage,
    hasPreviousPage: genresData.hasPreviousPage,
  };
}

/**
 * Get loading state summary
 */
export function getLoadingState() {
  return {
    genres: $genresLoading.get(),
    genreDetail: $genreDetailLoading.get(),
    genreForm: $genreFormLoading.get(),
    isAnyLoading: $genresLoading.get() || $genreDetailLoading.get() || $genreFormLoading.get(),
  };
}

/**
 * Get error state summary
 */
export function getErrorState() {
  return {
    genres: $genresError.get(),
    genreDetail: $genreDetailError.get(),
    genreForm: $genreFormError.get(),
    hasAnyError: Boolean($genresError.get() || $genreDetailError.get() || $genreFormError.get()),
  };
}

/**
 * Sort genres alphabetically
 */
export function sortGenresAlphabetically(genres: GenreResponse[]): GenreResponse[] {
  return [...genres].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sort genres by game count (descending)
 */
export function sortGenresByGameCount(genres: GenreResponse[]): GenreResponse[] {
  return [...genres].sort((a, b) => (b.gamesCount || 0) - (a.gamesCount || 0));
}

/**
 * Filter genres by search term
 */
export function filterGenresBySearch(genres: GenreResponse[], searchTerm: string): GenreResponse[] {
  if (!searchTerm.trim()) return genres;

  const term = searchTerm.toLowerCase();
  return genres.filter(
    (genre) =>
      genre.name.toLowerCase().includes(term) || genre.description?.toLowerCase().includes(term),
  );
}
