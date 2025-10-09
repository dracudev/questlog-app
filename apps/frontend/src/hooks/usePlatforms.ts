import { useCallback, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import type {
  PlatformResponse,
  PlatformsQuery,
  CreatePlatformRequest,
  UpdatePlatformRequest,
} from '@questlog/shared-types';

import { platformsService, type PaginatedPlatformsResponse } from '@/services/platforms';
import {
  $platformsData,
  $platformsLoading,
  $platformsError,
  $platformDetail,
  $platformDetailLoading,
  $platformDetailError,
  $platformFormLoading,
  $platformFormError,
  setPlatformsLoading,
  setPlatformsError,
  setPlatformsData,
  setPlatformDetailLoading,
  setPlatformDetailError,
  setPlatformDetail,
  setPlatformFormLoading,
  setPlatformFormError,
  clearPlatformsState,
  clearPlatformDetailState,
  clearPlatformFormState,
} from '@/stores/platforms';

// ============================================================================
// Types
// ============================================================================

interface UsePlatformsReturn {
  // State
  data: PaginatedPlatformsResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPlatforms: (query?: PlatformsQuery) => Promise<PaginatedPlatformsResponse>;
  searchPlatforms: (
    searchTerm: string,
    options?: Omit<PlatformsQuery, 'search'>,
  ) => Promise<PaginatedPlatformsResponse>;
  getPopularPlatforms: (options?: PlatformsQuery) => Promise<PaginatedPlatformsResponse>;
  getPlatformsAlphabetically: (options?: PlatformsQuery) => Promise<PaginatedPlatformsResponse>;
  getConsolePlatforms: (options?: PlatformsQuery) => Promise<PaginatedPlatformsResponse>;
  getPCPlatforms: (options?: PlatformsQuery) => Promise<PaginatedPlatformsResponse>;
  getMobilePlatforms: (options?: PlatformsQuery) => Promise<PaginatedPlatformsResponse>;
  getCurrentGenPlatforms: (options?: PlatformsQuery) => Promise<PaginatedPlatformsResponse>;
  clearError: () => void;
  clearData: () => void;

  // Utils
  refetch: () => Promise<void>;
}

interface UsePlatformDetailReturn {
  // State
  platform: PlatformResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPlatformDetail: (id: string) => Promise<PlatformResponse>;
  fetchPlatformBySlug: (slug: string) => Promise<PlatformResponse>;
  clearError: () => void;
  clearData: () => void;

  // Utils
  refetch: (id?: string) => Promise<void>;
}

interface UsePlatformManagementReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  createPlatform: (platformData: CreatePlatformRequest) => Promise<PlatformResponse>;
  updatePlatform: (id: string, platformData: UpdatePlatformRequest) => Promise<PlatformResponse>;
  deletePlatform: (id: string) => Promise<void>;
  clearError: () => void;

  // Utils
  clearState: () => void;
}

// ============================================================================
// Platforms List Hook
// ============================================================================

/**
 * Hook for managing platforms list with filtering, searching, and pagination
 *
 * @example
 * ```tsx
 * function PlatformsList() {
 *   const {
 *     data,
 *     isLoading,
 *     error,
 *     fetchPlatforms,
 *     searchPlatforms,
 *     clearError
 *   } = usePlatforms();
 *
 *   useEffect(() => {
 *     fetchPlatforms({ page: 1, limit: 20 });
 *   }, []);
 *
 *   const handleSearch = (searchTerm: string) => {
 *     searchPlatforms(searchTerm, { limit: 20 });
 *   };
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {data?.data.map(platform => (
 *         <PlatformCard key={platform.id} platform={platform} />
 *       ))}
 *       <Pagination
 *         currentPage={data?.page || 1}
 *         totalPages={data?.totalPages || 1}
 *         hasNext={data?.hasNextPage}
 *         hasPrevious={data?.hasPreviousPage}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function usePlatforms(): UsePlatformsReturn {
  // Subscribe to global platforms stores
  const data = useStore($platformsData);
  const isLoading = useStore($platformsLoading);
  const error = useStore($platformsError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchPlatforms = useCallback(
    async (query: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> => {
      setPlatformsLoading(true);
      setPlatformsError(null);

      try {
        const response = await platformsService.getAllPlatforms(query);
        setPlatformsData(response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch platforms';
        setPlatformsError(errorMessage);
        throw error;
      } finally {
        setPlatformsLoading(false);
      }
    },
    [],
  );

  const searchPlatforms = useCallback(
    async (
      searchTerm: string,
      options: Omit<PlatformsQuery, 'search'> = {},
    ): Promise<PaginatedPlatformsResponse> => {
      setPlatformsLoading(true);
      setPlatformsError(null);

      try {
        const response = await platformsService.searchPlatforms(searchTerm, options);
        setPlatformsData(response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to search platforms';
        setPlatformsError(errorMessage);
        throw error;
      } finally {
        setPlatformsLoading(false);
      }
    },
    [],
  );

  const getPopularPlatforms = useCallback(
    async (options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> => {
      setPlatformsLoading(true);
      setPlatformsError(null);

      try {
        const response = await platformsService.getPopularPlatforms(options);
        setPlatformsData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch popular platforms';
        setPlatformsError(errorMessage);
        throw error;
      } finally {
        setPlatformsLoading(false);
      }
    },
    [],
  );

  const getPlatformsAlphabetically = useCallback(
    async (options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> => {
      setPlatformsLoading(true);
      setPlatformsError(null);

      try {
        const response = await platformsService.getPlatformsAlphabetically(options);
        setPlatformsData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch platforms alphabetically';
        setPlatformsError(errorMessage);
        throw error;
      } finally {
        setPlatformsLoading(false);
      }
    },
    [],
  );

  const getConsolePlatforms = useCallback(
    async (options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> => {
      setPlatformsLoading(true);
      setPlatformsError(null);

      try {
        const response = await platformsService.getConsolePlatforms(options);
        setPlatformsData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch console platforms';
        setPlatformsError(errorMessage);
        throw error;
      } finally {
        setPlatformsLoading(false);
      }
    },
    [],
  );

  const getPCPlatforms = useCallback(
    async (options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> => {
      setPlatformsLoading(true);
      setPlatformsError(null);

      try {
        const response = await platformsService.getPCPlatforms(options);
        setPlatformsData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch PC platforms';
        setPlatformsError(errorMessage);
        throw error;
      } finally {
        setPlatformsLoading(false);
      }
    },
    [],
  );

  const getMobilePlatforms = useCallback(
    async (options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> => {
      setPlatformsLoading(true);
      setPlatformsError(null);

      try {
        const response = await platformsService.getMobilePlatforms(options);
        setPlatformsData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch mobile platforms';
        setPlatformsError(errorMessage);
        throw error;
      } finally {
        setPlatformsLoading(false);
      }
    },
    [],
  );

  const getCurrentGenPlatforms = useCallback(
    async (options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> => {
      setPlatformsLoading(true);
      setPlatformsError(null);

      try {
        const response = await platformsService.getCurrentGenPlatforms(options);
        setPlatformsData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch current generation platforms';
        setPlatformsError(errorMessage);
        throw error;
      } finally {
        setPlatformsLoading(false);
      }
    },
    [],
  );

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setPlatformsError(null);
  }, []);

  const clearData = useCallback(() => {
    clearPlatformsState();
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    // If we have existing data, refetch with basic query
    await fetchPlatforms();
  }, [fetchPlatforms]);

  return {
    // State
    data,
    isLoading,
    error,

    // Actions
    fetchPlatforms,
    searchPlatforms,
    getPopularPlatforms,
    getPlatformsAlphabetically,
    getConsolePlatforms,
    getPCPlatforms,
    getMobilePlatforms,
    getCurrentGenPlatforms,
    clearError,
    clearData,

    // Utils
    refetch,
  };
}

// ============================================================================
// Platform Detail Hook
// ============================================================================

/**
 * Hook for managing individual platform details
 *
 * @example
 * ```tsx
 * function PlatformDetailPage({ id }: { id: string }) {
 *   const {
 *     platform,
 *     isLoading,
 *     error,
 *     fetchPlatformDetail,
 *     clearError
 *   } = usePlatformDetail();
 *
 *   useEffect(() => {
 *     fetchPlatformDetail(id);
 *   }, [id]);
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *   if (!platform) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <PlatformHeader platform={platform} />
 *       <PlatformGames platformId={platform.id} />
 *     </div>
 *   );
 * }
 * ```
 */
export function usePlatformDetail(): UsePlatformDetailReturn {
  // Subscribe to global platform detail stores
  const platform = useStore($platformDetail);
  const isLoading = useStore($platformDetailLoading);
  const error = useStore($platformDetailError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchPlatformDetail = useCallback(async (id: string): Promise<PlatformResponse> => {
    setPlatformDetailLoading(true);
    setPlatformDetailError(null);

    try {
      const response = await platformsService.getPlatformById(id);
      setPlatformDetail(response, id);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch platform details';
      setPlatformDetailError(errorMessage);
      throw error;
    } finally {
      setPlatformDetailLoading(false);
    }
  }, []);

  const fetchPlatformBySlug = useCallback(async (slug: string): Promise<PlatformResponse> => {
    setPlatformDetailLoading(true);
    setPlatformDetailError(null);

    try {
      const response = await platformsService.getPlatformBySlug(slug);
      setPlatformDetail(response, response.id);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch platform by slug';
      setPlatformDetailError(errorMessage);
      throw error;
    } finally {
      setPlatformDetailLoading(false);
    }
  }, []);

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setPlatformDetailError(null);
  }, []);

  const clearData = useCallback(() => {
    clearPlatformDetailState();
  }, []);

  const refetch = useCallback(
    async (id?: string): Promise<void> => {
      // If id is provided, use it; otherwise try to refetch current platform
      if (id) {
        await fetchPlatformDetail(id);
      } else if (platform) {
        await fetchPlatformDetail(platform.id);
      }
    },
    [platform, fetchPlatformDetail],
  );

  return {
    // State
    platform,
    isLoading,
    error,

    // Actions
    fetchPlatformDetail,
    fetchPlatformBySlug,
    clearError,
    clearData,

    // Utils
    refetch,
  };
}

// ============================================================================
// Platform Management Hook (Admin/Moderator)
// ============================================================================

/**
 * Hook for managing platform CRUD operations (Admin/Moderator only)
 *
 * @example
 * ```tsx
 * function PlatformManagement() {
 *   const {
 *     isLoading,
 *     error,
 *     createPlatform,
 *     updatePlatform,
 *     deletePlatform,
 *     clearError
 *   } = usePlatformManagement();
 *
 *   const handleCreatePlatform = async (data: CreatePlatformRequest) => {
 *     try {
 *       const newPlatform = await createPlatform(data);
 *       // Handle success (e.g., show toast, redirect)
 *     } catch (error) {
 *       // Error is already handled by the hook
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <PlatformForm onSubmit={handleCreatePlatform} isLoading={isLoading} />
 *       {error && <ErrorMessage message={error} onClose={clearError} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePlatformManagement(): UsePlatformManagementReturn {
  // Subscribe to global platform form stores
  const isLoading = useStore($platformFormLoading);
  const error = useStore($platformFormError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const createPlatform = useCallback(
    async (platformData: CreatePlatformRequest): Promise<PlatformResponse> => {
      setPlatformFormLoading(true);
      setPlatformFormError(null);

      try {
        const response = await platformsService.createPlatform(platformData);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create platform';
        setPlatformFormError(errorMessage);
        throw error;
      } finally {
        setPlatformFormLoading(false);
      }
    },
    [],
  );

  const updatePlatform = useCallback(
    async (id: string, platformData: UpdatePlatformRequest): Promise<PlatformResponse> => {
      setPlatformFormLoading(true);
      setPlatformFormError(null);

      try {
        const response = await platformsService.updatePlatform(id, platformData);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update platform';
        setPlatformFormError(errorMessage);
        throw error;
      } finally {
        setPlatformFormLoading(false);
      }
    },
    [],
  );

  const deletePlatform = useCallback(async (id: string): Promise<void> => {
    setPlatformFormLoading(true);
    setPlatformFormError(null);

    try {
      await platformsService.deletePlatform(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete platform';
      setPlatformFormError(errorMessage);
      throw error;
    } finally {
      setPlatformFormLoading(false);
    }
  }, []);

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setPlatformFormError(null);
  }, []);

  const clearState = useCallback(() => {
    clearPlatformFormState();
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    createPlatform,
    updatePlatform,
    deletePlatform,
    clearError,

    // Utils
    clearState,
  };
}

// ============================================================================
// Specialized Platforms Hooks
// ============================================================================

/**
 * Hook for fetching and managing all platforms (for dropdowns, filters, etc.)
 */
export function useAllPlatforms() {
  const { data, isLoading, error, fetchPlatforms, clearError } = usePlatforms();

  const fetchAllPlatforms = useCallback(async () => {
    return fetchPlatforms({
      limit: 100, // Get a large number to cover most use cases
    });
  }, [fetchPlatforms]);

  useEffect(() => {
    fetchAllPlatforms();
  }, [fetchAllPlatforms]);

  return {
    platforms: data?.data || [],
    isLoading,
    error,
    refetch: fetchAllPlatforms,
    clearError,
  };
}

/**
 * Hook for fetching and managing popular platforms
 */
export function usePopularPlatforms(limit: number = 20) {
  const { data, isLoading, error, getPopularPlatforms, clearError } = usePlatforms();

  const fetchPopularPlatforms = useCallback(async () => {
    return getPopularPlatforms({
      limit,
    });
  }, [getPopularPlatforms, limit]);

  useEffect(() => {
    fetchPopularPlatforms();
  }, [fetchPopularPlatforms]);

  return {
    platforms: data?.data || [],
    isLoading,
    error,
    refetch: fetchPopularPlatforms,
    clearError,
  };
}

/**
 * Hook for fetching console platforms
 */
export function useConsolePlatforms(limit: number = 20) {
  const { data, isLoading, error, getConsolePlatforms, clearError } = usePlatforms();

  const fetchConsolePlatforms = useCallback(async () => {
    return getConsolePlatforms({
      limit,
    });
  }, [getConsolePlatforms, limit]);

  useEffect(() => {
    fetchConsolePlatforms();
  }, [fetchConsolePlatforms]);

  return {
    platforms: data?.data || [],
    isLoading,
    error,
    refetch: fetchConsolePlatforms,
    clearError,
  };
}

/**
 * Hook for fetching PC platforms
 */
export function usePCPlatforms(limit: number = 10) {
  const { data, isLoading, error, getPCPlatforms, clearError } = usePlatforms();

  const fetchPCPlatforms = useCallback(async () => {
    return getPCPlatforms({
      limit,
    });
  }, [getPCPlatforms, limit]);

  useEffect(() => {
    fetchPCPlatforms();
  }, [fetchPCPlatforms]);

  return {
    platforms: data?.data || [],
    isLoading,
    error,
    refetch: fetchPCPlatforms,
    clearError,
  };
}

/**
 * Hook for fetching mobile platforms
 */
export function useMobilePlatforms(limit: number = 5) {
  const { data, isLoading, error, getMobilePlatforms, clearError } = usePlatforms();

  const fetchMobilePlatforms = useCallback(async () => {
    return getMobilePlatforms({
      limit,
    });
  }, [getMobilePlatforms, limit]);

  useEffect(() => {
    fetchMobilePlatforms();
  }, [fetchMobilePlatforms]);

  return {
    platforms: data?.data || [],
    isLoading,
    error,
    refetch: fetchMobilePlatforms,
    clearError,
  };
}
