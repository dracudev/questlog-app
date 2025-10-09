import { atom } from 'nanostores';
import type { DeveloperResponse, PaginatedResponse } from '@questlog/shared-types';

// ============================================================================
// Developers State
// ============================================================================

/**
 * Cache of developers by developer ID
 */
export const $developers = atom<Record<string, DeveloperResponse>>({});

/**
 * Paginated developers list (for directory/search)
 */
export const $developersList = atom<PaginatedResponse<DeveloperResponse> | null>(null);

/**
 * Developers loading state
 */
export const $developersLoading = atom<boolean>(false);

/**
 * Developers error state
 */
export const $developersError = atom<string | null>(null);

/**
 * Current developers query/filter state
 */
export const $developersQuery = atom<{
  search?: string;
  country?: string;
  page: number;
  limit: number;
  includeGames?: boolean;
}>({
  page: 1,
  limit: 20,
});

/**
 * Developer creation/update loading state
 */
export const $developerActionLoading = atom<Record<string, boolean>>({});

/**
 * Developer action error state
 */
export const $developerActionError = atom<string | null>(null);

/**
 * Slug availability cache
 */
export const $slugAvailability = atom<Record<string, boolean>>({});

/**
 * Currently selected developer (for detail views)
 */
export const $selectedDeveloper = atom<DeveloperResponse | null>(null);

// ============================================================================
// Developers State Actions
// ============================================================================

/**
 * Set developer in cache
 */
export function setDeveloper(developerId: string, developer: DeveloperResponse): void {
  const current = $developers.get();
  $developers.set({
    ...current,
    [developerId]: developer,
  });
}

/**
 * Set developers list with pagination
 */
export function setDevelopersList(
  developersList: PaginatedResponse<DeveloperResponse> | null,
): void {
  $developersList.set(developersList);
  $developersError.set(null);
}

/**
 * Append developers to current list (for pagination)
 */
export function appendDevelopersList(newDevelopers: PaginatedResponse<DeveloperResponse>): void {
  const currentList = $developersList.get();

  if (!currentList) {
    setDevelopersList(newDevelopers);
    return;
  }

  const updatedList: PaginatedResponse<DeveloperResponse> = {
    ...newDevelopers,
    items: [...currentList.items, ...newDevelopers.items],
  };

  setDevelopersList(updatedList);
}

/**
 * Set developers loading state
 */
export function setDevelopersLoading(loading: boolean): void {
  $developersLoading.set(loading);
  if (loading) {
    $developersError.set(null);
  }
}

/**
 * Set developers error
 */
export function setDevelopersError(error: string | null): void {
  $developersError.set(error);
  $developersLoading.set(false);
}

/**
 * Set developers query/filter state
 */
export function setDevelopersQuery(query: {
  search?: string;
  country?: string;
  page: number;
  limit: number;
  includeGames?: boolean;
}): void {
  $developersQuery.set(query);
}

/**
 * Set developer action loading state
 */
export function setDeveloperActionLoading(developerId: string, loading: boolean): void {
  const current = $developerActionLoading.get();
  $developerActionLoading.set({
    ...current,
    [developerId]: loading,
  });

  if (loading) {
    $developerActionError.set(null);
  }
}

/**
 * Set developer action error
 */
export function setDeveloperActionError(error: string | null): void {
  $developerActionError.set(error);
}

/**
 * Set slug availability
 */
export function setSlugAvailability(slug: string, isAvailable: boolean): void {
  const current = $slugAvailability.get();
  $slugAvailability.set({
    ...current,
    [slug.toLowerCase()]: isAvailable,
  });
}

/**
 * Set selected developer
 */
export function setSelectedDeveloper(developer: DeveloperResponse | null): void {
  $selectedDeveloper.set(developer);
}

/**
 * Update developer in cache
 */
export function updateDeveloper(developerId: string, updates: Partial<DeveloperResponse>): void {
  const current = $developers.get();
  const existingDeveloper = current[developerId];

  if (existingDeveloper) {
    const updatedDeveloper = { ...existingDeveloper, ...updates };
    setDeveloper(developerId, updatedDeveloper);

    // Update selected developer if it's the same one
    const selected = $selectedDeveloper.get();
    if (selected && selected.id === developerId) {
      setSelectedDeveloper(updatedDeveloper);
    }

    // Update in list if present
    const list = $developersList.get();
    if (list) {
      const updatedItems = list.items.map((dev) =>
        dev.id === developerId ? updatedDeveloper : dev,
      );
      setDevelopersList({
        ...list,
        items: updatedItems,
      });
    }
  }
}

/**
 * Remove developer from cache
 */
export function removeDeveloper(developerId: string): void {
  const current = $developers.get();
  const { [developerId]: removed, ...remaining } = current;
  $developers.set(remaining);

  // Clear selected developer if it's the removed one
  const selected = $selectedDeveloper.get();
  if (selected && selected.id === developerId) {
    setSelectedDeveloper(null);
  }

  // Remove from list if present
  const list = $developersList.get();
  if (list) {
    const filteredItems = list.items.filter((dev) => dev.id !== developerId);
    setDevelopersList({
      ...list,
      items: filteredItems,
      meta: {
        ...list.meta,
        total: list.meta.total - 1,
      },
    });
  }
}

/**
 * Add new developer to cache and list
 */
export function addDeveloper(developer: DeveloperResponse): void {
  setDeveloper(developer.id, developer);

  // Add to beginning of list if present
  const list = $developersList.get();
  if (list) {
    const updatedItems = [developer, ...list.items];
    setDevelopersList({
      ...list,
      items: updatedItems,
      meta: {
        ...list.meta,
        total: list.meta.total + 1,
      },
    });
  }
}

/**
 * Clear all developers state
 */
export function clearDevelopersState(): void {
  $developers.set({});
  $developersList.set(null);
  $developersLoading.set(false);
  $developersError.set(null);
  $developersQuery.set({ page: 1, limit: 20 });
  $developerActionLoading.set({});
  $developerActionError.set(null);
  $slugAvailability.set({});
  $selectedDeveloper.set(null);
}

/**
 * Clear developers list state only
 */
export function clearDevelopersListState(): void {
  $developersList.set(null);
  $developersError.set(null);
  $developersQuery.set({ page: 1, limit: 20 });
}

/**
 * Clear developer action state only
 */
export function clearDeveloperActionState(): void {
  $developerActionLoading.set({});
  $developerActionError.set(null);
}

// ============================================================================
// Developers State Helpers
// ============================================================================

/**
 * Get developer from cache by ID
 */
export function getDeveloper(developerId: string): DeveloperResponse | null {
  return $developers.get()[developerId] || null;
}

/**
 * Get developer from cache by slug
 */
export function getDeveloperBySlug(slug: string): DeveloperResponse | null {
  const developers = Object.values($developers.get());
  return developers.find((dev) => dev.slug === slug) || null;
}

/**
 * Check if slug availability is cached
 */
export function getSlugAvailability(slug: string): boolean | null {
  const availability = $slugAvailability.get()[slug.toLowerCase()];
  return availability !== undefined ? availability : null;
}

/**
 * Check if developer is cached
 */
export function isDeveloperCached(developerId: string): boolean {
  return developerId in $developers.get();
}

/**
 * Check if developer action is loading
 */
export function isDeveloperActionLoading(developerId: string): boolean {
  return $developerActionLoading.get()[developerId] || false;
}

/**
 * Get all cached developers as array
 */
export function getAllCachedDevelopers(): DeveloperResponse[] {
  return Object.values($developers.get());
}

/**
 * Get developers by country from cache
 */
export function getDevelopersByCountryFromCache(country: string): DeveloperResponse[] {
  const developers = Object.values($developers.get());
  return developers.filter(
    (dev) => dev.country && dev.country.toLowerCase() === country.toLowerCase(),
  );
}

/**
 * Search developers in cache
 */
export function searchDevelopersInCache(query: string): DeveloperResponse[] {
  const developers = Object.values($developers.get());
  const searchTerm = query.toLowerCase();

  return developers.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchTerm) ||
      (dev.description && dev.description.toLowerCase().includes(searchTerm)) ||
      (dev.country && dev.country.toLowerCase().includes(searchTerm)),
  );
}

/**
 * Get developer's display name with fallback
 */
export function getDeveloperDisplayName(developerId: string): string {
  const developer = getDeveloper(developerId);
  if (!developer) return 'Unknown Developer';
  return developer.name || 'Unknown Developer';
}

/**
 * Get developer's avatar URL with fallback
 */
export function getDeveloperAvatarUrl(developerId: string, size: number = 40): string {
  const developer = getDeveloper(developerId);
  if (!developer) {
    return `https://api.dicebear.com/7.x/initials/svg?seed=Developer&size=${size}`;
  }

  if (developer.avatar) {
    return developer.avatar;
  }

  // Fallback to generated avatar based on name
  const name = developer.name || 'Developer';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&size=${size}`;
}

/**
 * Get developers count by country from cache
 */
export function getDevelopersCountByCountry(): Record<string, number> {
  const developers = Object.values($developers.get());
  const countsByCountry: Record<string, number> = {};

  developers.forEach((dev) => {
    if (dev.country) {
      countsByCountry[dev.country] = (countsByCountry[dev.country] || 0) + 1;
    }
  });

  return countsByCountry;
}
