import { useCallback, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import type {
  PublisherResponse,
  PublishersQuery,
  CreatePublisherRequest,
  UpdatePublisherRequest,
} from '@questlog/shared-types';

import { publishersService, type PaginatedPublishersResponse } from '@/services/publishers';
import {
  $publishersData,
  $publishersLoading,
  $publishersError,
  $publisherDetail,
  $publisherDetailLoading,
  $publisherDetailError,
  $publisherFormLoading,
  $publisherFormError,
  setPublishersLoading,
  setPublishersError,
  setPublishersData,
  setPublisherDetailLoading,
  setPublisherDetailError,
  setPublisherDetail,
  setPublisherFormLoading,
  setPublisherFormError,
  clearPublishersState,
  clearPublisherDetailState,
  clearPublisherFormState,
} from '@/stores/publishers';

// ============================================================================
// Types
// ============================================================================

interface UsePublishersReturn {
  // State
  data: PaginatedPublishersResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPublishers: (query?: PublishersQuery) => Promise<PaginatedPublishersResponse>;
  searchPublishers: (
    searchTerm: string,
    options?: Omit<PublishersQuery, 'search'>,
  ) => Promise<PaginatedPublishersResponse>;
  getPopularPublishers: (options?: PublishersQuery) => Promise<PaginatedPublishersResponse>;
  getPublishersAlphabetically: (options?: PublishersQuery) => Promise<PaginatedPublishersResponse>;
  getPublishersByCountry: (
    country: string,
    options?: Omit<PublishersQuery, 'country'>,
  ) => Promise<PaginatedPublishersResponse>;
  getTopRatedPublishers: (options?: PublishersQuery) => Promise<PaginatedPublishersResponse>;
  clearError: () => void;
  clearData: () => void;

  // Utils
  refetch: () => Promise<void>;
}

interface UsePublisherDetailReturn {
  // State
  publisher: PublisherResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPublisherDetail: (id: string) => Promise<PublisherResponse>;
  fetchPublisherBySlug: (slug: string) => Promise<PublisherResponse>;
  clearError: () => void;
  clearData: () => void;

  // Utils
  refetch: (id?: string) => Promise<void>;
}

interface UsePublisherManagementReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  createPublisher: (publisherData: CreatePublisherRequest) => Promise<PublisherResponse>;
  updatePublisher: (
    id: string,
    publisherData: UpdatePublisherRequest,
  ) => Promise<PublisherResponse>;
  deletePublisher: (id: string) => Promise<void>;
  clearError: () => void;

  // Utils
  clearState: () => void;
}

// ============================================================================
// Publishers List Hook
// ============================================================================

/**
 * Hook for managing publishers list with filtering, searching, and pagination
 *
 * @example
 * ```tsx
 * function PublishersList() {
 *   const {
 *     data,
 *     isLoading,
 *     error,
 *     fetchPublishers,
 *     searchPublishers,
 *     clearError
 *   } = usePublishers();
 *
 *   useEffect(() => {
 *     fetchPublishers({ page: 1, limit: 20 });
 *   }, []);
 *
 *   const handleSearch = (searchTerm: string) => {
 *     searchPublishers(searchTerm, { limit: 20 });
 *   };
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {data?.data.map(publisher => (
 *         <PublisherCard key={publisher.id} publisher={publisher} />
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
export function usePublishers(): UsePublishersReturn {
  // Subscribe to global publishers stores
  const data = useStore($publishersData);
  const isLoading = useStore($publishersLoading);
  const error = useStore($publishersError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchPublishers = useCallback(
    async (query: PublishersQuery = {}): Promise<PaginatedPublishersResponse> => {
      setPublishersLoading(true);
      setPublishersError(null);

      try {
        const response = await publishersService.getAllPublishers(query);
        setPublishersData(response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch publishers';
        setPublishersError(errorMessage);
        throw error;
      } finally {
        setPublishersLoading(false);
      }
    },
    [],
  );

  const searchPublishers = useCallback(
    async (
      searchTerm: string,
      options: Omit<PublishersQuery, 'search'> = {},
    ): Promise<PaginatedPublishersResponse> => {
      setPublishersLoading(true);
      setPublishersError(null);

      try {
        const response = await publishersService.searchPublishers(searchTerm, options);
        setPublishersData(response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to search publishers';
        setPublishersError(errorMessage);
        throw error;
      } finally {
        setPublishersLoading(false);
      }
    },
    [],
  );

  const getPopularPublishers = useCallback(
    async (options: PublishersQuery = {}): Promise<PaginatedPublishersResponse> => {
      setPublishersLoading(true);
      setPublishersError(null);

      try {
        const response = await publishersService.getPopularPublishers(options);
        setPublishersData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch popular publishers';
        setPublishersError(errorMessage);
        throw error;
      } finally {
        setPublishersLoading(false);
      }
    },
    [],
  );

  const getPublishersAlphabetically = useCallback(
    async (options: PublishersQuery = {}): Promise<PaginatedPublishersResponse> => {
      setPublishersLoading(true);
      setPublishersError(null);

      try {
        const response = await publishersService.getPublishersAlphabetically(options);
        setPublishersData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch publishers alphabetically';
        setPublishersError(errorMessage);
        throw error;
      } finally {
        setPublishersLoading(false);
      }
    },
    [],
  );

  const getPublishersByCountry = useCallback(
    async (
      country: string,
      options: Omit<PublishersQuery, 'country'> = {},
    ): Promise<PaginatedPublishersResponse> => {
      setPublishersLoading(true);
      setPublishersError(null);

      try {
        const response = await publishersService.getPublishersByCountry(country, options);
        setPublishersData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch publishers by country';
        setPublishersError(errorMessage);
        throw error;
      } finally {
        setPublishersLoading(false);
      }
    },
    [],
  );

  const getTopRatedPublishers = useCallback(
    async (options: PublishersQuery = {}): Promise<PaginatedPublishersResponse> => {
      setPublishersLoading(true);
      setPublishersError(null);

      try {
        const response = await publishersService.getTopRatedPublishers(options);
        setPublishersData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch top-rated publishers';
        setPublishersError(errorMessage);
        throw error;
      } finally {
        setPublishersLoading(false);
      }
    },
    [],
  );

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setPublishersError(null);
  }, []);

  const clearData = useCallback(() => {
    clearPublishersState();
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    // If we have existing data, refetch with basic query
    await fetchPublishers();
  }, [fetchPublishers]);

  return {
    // State
    data,
    isLoading,
    error,

    // Actions
    fetchPublishers,
    searchPublishers,
    getPopularPublishers,
    getPublishersAlphabetically,
    getPublishersByCountry,
    getTopRatedPublishers,
    clearError,
    clearData,

    // Utils
    refetch,
  };
}

// ============================================================================
// Publisher Detail Hook
// ============================================================================

/**
 * Hook for managing individual publisher details
 *
 * @example
 * ```tsx
 * function PublisherDetailPage({ id }: { id: string }) {
 *   const {
 *     publisher,
 *     isLoading,
 *     error,
 *     fetchPublisherDetail,
 *     clearError
 *   } = usePublisherDetail();
 *
 *   useEffect(() => {
 *     fetchPublisherDetail(id);
 *   }, [id]);
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *   if (!publisher) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <PublisherHeader publisher={publisher} />
 *       <PublisherDescription description={publisher.description} />
 *       <PublisherGames publisherId={publisher.id} />
 *     </div>
 *   );
 * }
 * ```
 */
export function usePublisherDetail(): UsePublisherDetailReturn {
  // Subscribe to global publisher detail stores
  const publisher = useStore($publisherDetail);
  const isLoading = useStore($publisherDetailLoading);
  const error = useStore($publisherDetailError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchPublisherDetail = useCallback(async (id: string): Promise<PublisherResponse> => {
    setPublisherDetailLoading(true);
    setPublisherDetailError(null);

    try {
      const response = await publishersService.getPublisherById(id);
      setPublisherDetail(response, id);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch publisher details';
      setPublisherDetailError(errorMessage);
      throw error;
    } finally {
      setPublisherDetailLoading(false);
    }
  }, []);

  const fetchPublisherBySlug = useCallback(async (slug: string): Promise<PublisherResponse> => {
    setPublisherDetailLoading(true);
    setPublisherDetailError(null);

    try {
      const response = await publishersService.getPublisherBySlug(slug);
      setPublisherDetail(response, response.id);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch publisher by slug';
      setPublisherDetailError(errorMessage);
      throw error;
    } finally {
      setPublisherDetailLoading(false);
    }
  }, []);

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setPublisherDetailError(null);
  }, []);

  const clearData = useCallback(() => {
    clearPublisherDetailState();
  }, []);

  const refetch = useCallback(
    async (id?: string): Promise<void> => {
      // If id is provided, use it; otherwise try to refetch current publisher
      if (id) {
        await fetchPublisherDetail(id);
      } else if (publisher) {
        await fetchPublisherDetail(publisher.id);
      }
    },
    [publisher, fetchPublisherDetail],
  );

  return {
    // State
    publisher,
    isLoading,
    error,

    // Actions
    fetchPublisherDetail,
    fetchPublisherBySlug,
    clearError,
    clearData,

    // Utils
    refetch,
  };
}

// ============================================================================
// Publisher Management Hook (Admin/Moderator)
// ============================================================================

/**
 * Hook for managing publisher CRUD operations (Admin/Moderator only)
 *
 * @example
 * ```tsx
 * function PublisherManagement() {
 *   const {
 *     isLoading,
 *     error,
 *     createPublisher,
 *     updatePublisher,
 *     deletePublisher,
 *     clearError
 *   } = usePublisherManagement();
 *
 *   const handleCreatePublisher = async (data: CreatePublisherRequest) => {
 *     try {
 *       const newPublisher = await createPublisher(data);
 *       // Handle success (e.g., show toast, redirect)
 *     } catch (error) {
 *       // Error is already handled by the hook
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <PublisherForm onSubmit={handleCreatePublisher} isLoading={isLoading} />
 *       {error && <ErrorMessage message={error} onClose={clearError} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePublisherManagement(): UsePublisherManagementReturn {
  // Subscribe to global publisher form stores
  const isLoading = useStore($publisherFormLoading);
  const error = useStore($publisherFormError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const createPublisher = useCallback(
    async (publisherData: CreatePublisherRequest): Promise<PublisherResponse> => {
      setPublisherFormLoading(true);
      setPublisherFormError(null);

      try {
        const response = await publishersService.createPublisher(publisherData);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create publisher';
        setPublisherFormError(errorMessage);
        throw error;
      } finally {
        setPublisherFormLoading(false);
      }
    },
    [],
  );

  const updatePublisher = useCallback(
    async (id: string, publisherData: UpdatePublisherRequest): Promise<PublisherResponse> => {
      setPublisherFormLoading(true);
      setPublisherFormError(null);

      try {
        const response = await publishersService.updatePublisher(id, publisherData);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update publisher';
        setPublisherFormError(errorMessage);
        throw error;
      } finally {
        setPublisherFormLoading(false);
      }
    },
    [],
  );

  const deletePublisher = useCallback(async (id: string): Promise<void> => {
    setPublisherFormLoading(true);
    setPublisherFormError(null);

    try {
      await publishersService.deletePublisher(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete publisher';
      setPublisherFormError(errorMessage);
      throw error;
    } finally {
      setPublisherFormLoading(false);
    }
  }, []);

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setPublisherFormError(null);
  }, []);

  const clearState = useCallback(() => {
    clearPublisherFormState();
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    createPublisher,
    updatePublisher,
    deletePublisher,
    clearError,

    // Utils
    clearState,
  };
}

// ============================================================================
// Specialized Publishers Hooks
// ============================================================================

/**
 * Hook for fetching and managing all publishers (for dropdowns, filters, etc.)
 */
export function useAllPublishers() {
  const { data, isLoading, error, fetchPublishers, clearError } = usePublishers();

  const fetchAllPublishers = useCallback(async () => {
    return fetchPublishers({
      limit: 100, // Get a large number to cover most use cases
    });
  }, [fetchPublishers]);

  useEffect(() => {
    fetchAllPublishers();
  }, [fetchAllPublishers]);

  return {
    publishers: data?.data || [],
    isLoading,
    error,
    refetch: fetchAllPublishers,
    clearError,
  };
}

/**
 * Hook for fetching and managing popular publishers
 */
export function usePopularPublishers(limit: number = 20) {
  const { data, isLoading, error, getPopularPublishers, clearError } = usePublishers();

  const fetchPopularPublishers = useCallback(async () => {
    return getPopularPublishers({
      limit,
    });
  }, [getPopularPublishers, limit]);

  useEffect(() => {
    fetchPopularPublishers();
  }, [fetchPopularPublishers]);

  return {
    publishers: data?.data || [],
    isLoading,
    error,
    refetch: fetchPopularPublishers,
    clearError,
  };
}

/**
 * Hook for fetching publishers by country
 */
export function usePublishersByCountry(country: string, limit: number = 20) {
  const { data, isLoading, error, getPublishersByCountry, clearError } = usePublishers();

  const fetchPublishersByCountry = useCallback(async () => {
    if (!country) return;
    return getPublishersByCountry(country, {
      limit,
    });
  }, [getPublishersByCountry, country, limit]);

  useEffect(() => {
    fetchPublishersByCountry();
  }, [fetchPublishersByCountry]);

  return {
    publishers: data?.data || [],
    isLoading,
    error,
    refetch: fetchPublishersByCountry,
    clearError,
  };
}
