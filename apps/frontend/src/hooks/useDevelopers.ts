import { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import type {
  DeveloperResponse,
  CreateDeveloperRequest,
  UpdateDeveloperRequest,
  DevelopersQuery,
  PaginatedResponse,
} from '@questlog/shared-types';

import { developersService } from '@/services/developers';
import {
  $developersList,
  $developersLoading,
  $developersError,
  $developersQuery,
  $developerActionLoading,
  $developerActionError,
  $slugAvailability,
  $selectedDeveloper,
  setDeveloper,
  setDevelopersList,
  appendDevelopersList,
  setDevelopersLoading,
  setDevelopersError,
  setDevelopersQuery,
  setDeveloperActionLoading,
  setDeveloperActionError,
  setSlugAvailability,
  setSelectedDeveloper,
  updateDeveloper,
  removeDeveloper,
  addDeveloper,
  clearDevelopersState,
  clearDevelopersListState,
  getDeveloper,
  getDeveloperBySlug,
  getSlugAvailability,
  isDeveloperCached,
} from '@/stores/developers';

// ============================================================================
// Types
// ============================================================================

interface UseDevelopersReturn {
  // State
  developers: PaginatedResponse<DeveloperResponse> | null;
  isLoading: boolean;
  error: string | null;
  query: {
    search?: string;
    country?: string;
    page: number;
    limit: number;
    includeGames?: boolean;
  };

  // Actions
  fetchDevelopers: (query?: DevelopersQuery) => Promise<PaginatedResponse<DeveloperResponse>>;
  searchDevelopers: (
    searchQuery: string,
    options?: Omit<DevelopersQuery, 'search'>,
  ) => Promise<PaginatedResponse<DeveloperResponse>>;
  getDevelopersByCountry: (
    country: string,
    options?: Omit<DevelopersQuery, 'country'>,
  ) => Promise<PaginatedResponse<DeveloperResponse>>;
  loadMoreDevelopers: () => Promise<void>;
  refreshDevelopers: () => Promise<void>;
  clearDevelopers: () => void;
}

interface UseDeveloperReturn {
  // State
  developer: DeveloperResponse | null;
  isLoading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;

  // Actions
  fetchDeveloper: (developerId: string) => Promise<DeveloperResponse>;
  fetchDeveloperBySlug: (slug: string) => Promise<DeveloperResponse>;
  refreshDeveloper: (developerId: string) => Promise<void>;
  selectDeveloper: (developer: DeveloperResponse | null) => void;
}

interface UseDeveloperActionsReturn {
  // State
  actionLoading: Record<string, boolean>;
  actionError: string | null;
  slugAvailability: Record<string, boolean>;

  // Actions
  createDeveloper: (developerData: CreateDeveloperRequest) => Promise<DeveloperResponse>;
  updateDeveloper: (
    developerId: string,
    updates: UpdateDeveloperRequest,
  ) => Promise<DeveloperResponse>;
  deleteDeveloper: (developerId: string) => Promise<void>;
  checkSlugAvailability: (slug: string) => Promise<boolean>;
  getCachedSlugAvailability: (slug: string) => boolean | null;
  clearActionError: () => void;
}

// ============================================================================
// Developers List Hook
// ============================================================================

/**
 * Hook for managing developers list with pagination and search
 *
 * @example
 * ```typescript
 * const { developers, fetchDevelopers, searchDevelopers, loadMoreDevelopers } = useDevelopers();
 *
 * // Fetch initial developers
 * useEffect(() => {
 *   fetchDevelopers();
 * }, []);
 * ```
 */
export function useDevelopers(): UseDevelopersReturn {
  const developers = useStore($developersList);
  const isLoading = useStore($developersLoading);
  const error = useStore($developersError);
  const query = useStore($developersQuery);

  const fetchDevelopers = useCallback(
    async (queryParams: DevelopersQuery = {}): Promise<PaginatedResponse<DeveloperResponse>> => {
      try {
        setDevelopersLoading(true);
        const result = await developersService.getDevelopers(queryParams);
        setDevelopersList(result);
        setDevelopersQuery({
          search: queryParams.search,
          country: queryParams.country,
          page: queryParams.page || 1,
          limit: queryParams.limit || 20,
          includeGames: queryParams.includeGames,
        });

        // Cache individual developers
        result.items.forEach((developer) => {
          setDeveloper(developer.id, developer);
        });

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch developers';
        setDevelopersError(errorMessage);
        throw err;
      }
    },
    [],
  );

  const searchDevelopers = useCallback(
    async (
      searchQuery: string,
      options: Omit<DevelopersQuery, 'search'> = {},
    ): Promise<PaginatedResponse<DeveloperResponse>> => {
      try {
        setDevelopersLoading(true);
        const result = await developersService.searchDevelopers(searchQuery, options);
        setDevelopersList(result);
        setDevelopersQuery({
          search: searchQuery,
          country: options.country,
          page: options.page || 1,
          limit: options.limit || 20,
          includeGames: options.includeGames,
        });

        // Cache individual developers
        result.items.forEach((developer) => {
          setDeveloper(developer.id, developer);
        });

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search developers';
        setDevelopersError(errorMessage);
        throw err;
      }
    },
    [],
  );

  const getDevelopersByCountry = useCallback(
    async (
      country: string,
      options: Omit<DevelopersQuery, 'country'> = {},
    ): Promise<PaginatedResponse<DeveloperResponse>> => {
      try {
        setDevelopersLoading(true);
        const result = await developersService.getDevelopersByCountry(country, options);
        setDevelopersList(result);
        setDevelopersQuery({
          search: options.search,
          country: country,
          page: options.page || 1,
          limit: options.limit || 20,
          includeGames: options.includeGames,
        });

        // Cache individual developers
        result.items.forEach((developer) => {
          setDeveloper(developer.id, developer);
        });

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch developers by country';
        setDevelopersError(errorMessage);
        throw err;
      }
    },
    [],
  );

  const loadMoreDevelopers = useCallback(async (): Promise<void> => {
    const currentDevelopers = developers;
    if (
      !currentDevelopers ||
      !currentDevelopers.meta.totalPages ||
      currentDevelopers.meta.page >= currentDevelopers.meta.totalPages ||
      isLoading
    ) {
      return;
    }

    try {
      setDevelopersLoading(true);
      const nextPage = currentDevelopers.meta.page + 1;
      const moreDevelopers = await developersService.getDevelopers({
        ...query,
        page: nextPage,
      });

      appendDevelopersList(moreDevelopers);
      setDevelopersQuery({ ...query, page: nextPage });

      // Cache individual developers
      moreDevelopers.items.forEach((developer) => {
        setDeveloper(developer.id, developer);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more developers';
      setDevelopersError(errorMessage);
    }
  }, [developers, query, isLoading]);

  const refreshDevelopers = useCallback(async (): Promise<void> => {
    await fetchDevelopers({ ...query, page: 1 });
  }, [fetchDevelopers, query]);

  const clearDevelopers = useCallback((): void => {
    clearDevelopersListState();
  }, []);

  return {
    developers,
    isLoading,
    error,
    query,
    fetchDevelopers,
    searchDevelopers,
    getDevelopersByCountry,
    loadMoreDevelopers,
    refreshDevelopers,
    clearDevelopers,
  };
}

// ============================================================================
// Individual Developer Hook
// ============================================================================

/**
 * Hook for managing individual developer data
 *
 * @example
 * ```typescript
 * const { developer, fetchDeveloper, selectDeveloper } = useDeveloper();
 *
 * // Fetch developer by ID
 * const handleFetchDeveloper = async () => {
 *   await fetchDeveloper('developer-id');
 * };
 * ```
 */
export function useDeveloper(): UseDeveloperReturn {
  const developer = useStore($selectedDeveloper);
  const isLoading = useStore($developersLoading);
  const error = useStore($developersError);
  const actionLoading = useStore($developerActionLoading);
  const actionError = useStore($developerActionError);

  const fetchDeveloper = useCallback(async (developerId: string): Promise<DeveloperResponse> => {
    if (isDeveloperCached(developerId)) {
      const cachedDeveloper = getDeveloper(developerId)!;
      setSelectedDeveloper(cachedDeveloper);
      return cachedDeveloper;
    }

    try {
      setDevelopersLoading(true);
      const developerData = await developersService.getDeveloperById(developerId);
      setDeveloper(developerId, developerData);
      setSelectedDeveloper(developerData);
      setDevelopersLoading(false);
      return developerData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch developer';
      setDevelopersError(errorMessage);
      throw err;
    }
  }, []);

  const fetchDeveloperBySlug = useCallback(async (slug: string): Promise<DeveloperResponse> => {
    // Check cache first
    const cachedDeveloper = getDeveloperBySlug(slug);
    if (cachedDeveloper) {
      setSelectedDeveloper(cachedDeveloper);
      return cachedDeveloper;
    }

    try {
      setDevelopersLoading(true);
      const developerData = await developersService.getDeveloperBySlug(slug);
      setDeveloper(developerData.id, developerData);
      setSelectedDeveloper(developerData);
      setDevelopersLoading(false);
      return developerData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch developer';
      setDevelopersError(errorMessage);
      throw err;
    }
  }, []);

  const refreshDeveloper = useCallback(
    async (developerId: string): Promise<void> => {
      await fetchDeveloper(developerId);
    },
    [fetchDeveloper],
  );

  const selectDeveloper = useCallback((dev: DeveloperResponse | null): void => {
    setSelectedDeveloper(dev);
  }, []);

  return {
    developer,
    isLoading,
    error,
    actionLoading: Object.values(actionLoading).some(Boolean),
    actionError,
    fetchDeveloper,
    fetchDeveloperBySlug,
    refreshDeveloper,
    selectDeveloper,
  };
}

// ============================================================================
// Developer Actions Hook
// ============================================================================

/**
 * Hook for managing developer CRUD operations
 *
 * @example
 * ```typescript
 * const { createDeveloper, updateDeveloper, checkSlugAvailability } = useDeveloperActions();
 *
 * // Create new developer
 * const handleCreateDeveloper = async () => {
 *   await createDeveloper({ name: 'New Studio', country: 'USA' });
 * };
 * ```
 */
export function useDeveloperActions(): UseDeveloperActionsReturn {
  const actionLoading = useStore($developerActionLoading);
  const actionError = useStore($developerActionError);
  const slugAvailability = useStore($slugAvailability);

  const createDeveloper = useCallback(
    async (developerData: CreateDeveloperRequest): Promise<DeveloperResponse> => {
      const loadingKey = 'create';
      try {
        setDeveloperActionLoading(loadingKey, true);
        const newDeveloper = await developersService.createDeveloper(developerData);
        addDeveloper(newDeveloper);
        setDeveloperActionLoading(loadingKey, false);
        return newDeveloper;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create developer';
        setDeveloperActionError(errorMessage);
        setDeveloperActionLoading(loadingKey, false);
        throw err;
      }
    },
    [],
  );

  const updateDeveloperAction = useCallback(
    async (developerId: string, updates: UpdateDeveloperRequest): Promise<DeveloperResponse> => {
      try {
        setDeveloperActionLoading(developerId, true);
        const updatedDeveloper = await developersService.updateDeveloper(developerId, updates);
        updateDeveloper(developerId, updatedDeveloper);
        setDeveloperActionLoading(developerId, false);
        return updatedDeveloper;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update developer';
        setDeveloperActionError(errorMessage);
        setDeveloperActionLoading(developerId, false);
        throw err;
      }
    },
    [],
  );

  const deleteDeveloper = useCallback(async (developerId: string): Promise<void> => {
    try {
      setDeveloperActionLoading(developerId, true);
      await developersService.deleteDeveloper(developerId);
      removeDeveloper(developerId);
      setDeveloperActionLoading(developerId, false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete developer';
      setDeveloperActionError(errorMessage);
      setDeveloperActionLoading(developerId, false);
      throw err;
    }
  }, []);

  const checkSlugAvailability = useCallback(async (slug: string): Promise<boolean> => {
    const cached = getSlugAvailability(slug);
    if (cached !== null) {
      return cached;
    }

    try {
      const isAvailable = await developersService.isSlugAvailable(slug);
      setSlugAvailability(slug, isAvailable);
      return isAvailable;
    } catch (err) {
      // On error, don't cache the result
      throw err;
    }
  }, []);

  const getCachedSlugAvailability = useCallback((slug: string): boolean | null => {
    return getSlugAvailability(slug);
  }, []);

  const clearActionError = useCallback((): void => {
    setDeveloperActionError(null);
  }, []);

  return {
    actionLoading,
    actionError,
    slugAvailability,
    createDeveloper,
    updateDeveloper: updateDeveloperAction,
    deleteDeveloper,
    checkSlugAvailability,
    getCachedSlugAvailability,
    clearActionError,
  };
}

// ============================================================================
// Combined Developers Hook
// ============================================================================

/**
 * Combined hook that provides access to all developers functionality
 *
 * @example
 * ```typescript
 * const developers = useDevelopersModule();
 *
 * // Access all developers features
 * const { list, developer, actions } = developers;
 * ```
 */
export function useDevelopersModule() {
  const list = useDevelopers();
  const developer = useDeveloper();
  const actions = useDeveloperActions();

  // Clear all developers state
  const clearAll = useCallback((): void => {
    clearDevelopersState();
  }, []);

  return {
    list,
    developer,
    actions,
    clearAll,
  };
}
