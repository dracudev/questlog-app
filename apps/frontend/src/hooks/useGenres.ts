import { useCallback, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import type {
  GenreResponse,
  GenresQuery,
  CreateGenreRequest,
  UpdateGenreRequest,
} from '@questlog/shared-types';

import { genresService, type PaginatedGenresResponse } from '@/services/genres';
import {
  $genresData,
  $genresLoading,
  $genresError,
  $genreDetail,
  $genreDetailLoading,
  $genreDetailError,
  $genreFormLoading,
  $genreFormError,
  setGenresLoading,
  setGenresError,
  setGenresData,
  setGenreDetailLoading,
  setGenreDetailError,
  setGenreDetail,
  setGenreFormLoading,
  setGenreFormError,
  clearGenresState,
  clearGenreDetailState,
  clearGenreFormState,
} from '@/stores/genres';

// ============================================================================
// Types
// ============================================================================

interface UseGenresReturn {
  // State
  data: PaginatedGenresResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchGenres: (query?: GenresQuery) => Promise<PaginatedGenresResponse>;
  searchGenres: (
    searchTerm: string,
    options?: Omit<GenresQuery, 'search'>,
  ) => Promise<PaginatedGenresResponse>;
  getPopularGenres: (options?: GenresQuery) => Promise<PaginatedGenresResponse>;
  getGenresAlphabetically: (options?: GenresQuery) => Promise<PaginatedGenresResponse>;
  clearError: () => void;
  clearData: () => void;

  // Utils
  refetch: () => Promise<void>;
}

interface UseGenreDetailReturn {
  // State
  genre: GenreResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchGenreDetail: (id: string) => Promise<GenreResponse>;
  fetchGenreBySlug: (slug: string) => Promise<GenreResponse>;
  clearError: () => void;
  clearData: () => void;

  // Utils
  refetch: (id?: string) => Promise<void>;
}

interface UseGenreManagementReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  createGenre: (genreData: CreateGenreRequest) => Promise<GenreResponse>;
  updateGenre: (id: string, genreData: UpdateGenreRequest) => Promise<GenreResponse>;
  deleteGenre: (id: string) => Promise<void>;
  clearError: () => void;

  // Utils
  clearState: () => void;
}

// ============================================================================
// Genres List Hook
// ============================================================================

/**
 * Hook for managing genres list with filtering, searching, and pagination
 *
 * @example
 * ```tsx
 * function GenresList() {
 *   const {
 *     data,
 *     isLoading,
 *     error,
 *     fetchGenres,
 *     searchGenres,
 *     clearError
 *   } = useGenres();
 *
 *   useEffect(() => {
 *     fetchGenres({ page: 1, limit: 20 });
 *   }, []);
 *
 *   const handleSearch = (searchTerm: string) => {
 *     searchGenres(searchTerm, { limit: 20 });
 *   };
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {data?.data.map(genre => (
 *         <GenreCard key={genre.id} genre={genre} />
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
export function useGenres(): UseGenresReturn {
  // Subscribe to global genres stores
  const data = useStore($genresData);
  const isLoading = useStore($genresLoading);
  const error = useStore($genresError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchGenres = useCallback(
    async (query: GenresQuery = {}): Promise<PaginatedGenresResponse> => {
      setGenresLoading(true);
      setGenresError(null);

      try {
        const response = await genresService.getAllGenres(query);
        setGenresData(response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch genres';
        setGenresError(errorMessage);
        throw error;
      } finally {
        setGenresLoading(false);
      }
    },
    [],
  );

  const searchGenres = useCallback(
    async (
      searchTerm: string,
      options: Omit<GenresQuery, 'search'> = {},
    ): Promise<PaginatedGenresResponse> => {
      setGenresLoading(true);
      setGenresError(null);

      try {
        const response = await genresService.searchGenres(searchTerm, options);
        setGenresData(response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to search genres';
        setGenresError(errorMessage);
        throw error;
      } finally {
        setGenresLoading(false);
      }
    },
    [],
  );

  const getPopularGenres = useCallback(
    async (options: GenresQuery = {}): Promise<PaginatedGenresResponse> => {
      setGenresLoading(true);
      setGenresError(null);

      try {
        const response = await genresService.getPopularGenres(options);
        setGenresData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch popular genres';
        setGenresError(errorMessage);
        throw error;
      } finally {
        setGenresLoading(false);
      }
    },
    [],
  );

  const getGenresAlphabetically = useCallback(
    async (options: GenresQuery = {}): Promise<PaginatedGenresResponse> => {
      setGenresLoading(true);
      setGenresError(null);

      try {
        const response = await genresService.getGenresAlphabetically(options);
        setGenresData(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch genres alphabetically';
        setGenresError(errorMessage);
        throw error;
      } finally {
        setGenresLoading(false);
      }
    },
    [],
  );

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setGenresError(null);
  }, []);

  const clearData = useCallback(() => {
    clearGenresState();
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    // If we have existing data, refetch with basic query
    await fetchGenres();
  }, [fetchGenres]);

  return {
    // State
    data,
    isLoading,
    error,

    // Actions
    fetchGenres,
    searchGenres,
    getPopularGenres,
    getGenresAlphabetically,
    clearError,
    clearData,

    // Utils
    refetch,
  };
}

// ============================================================================
// Genre Detail Hook
// ============================================================================

/**
 * Hook for managing individual genre details
 *
 * @example
 * ```tsx
 * function GenreDetailPage({ id }: { id: string }) {
 *   const {
 *     genre,
 *     isLoading,
 *     error,
 *     fetchGenreDetail,
 *     clearError
 *   } = useGenreDetail();
 *
 *   useEffect(() => {
 *     fetchGenreDetail(id);
 *   }, [id]);
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *   if (!genre) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <GenreHeader genre={genre} />
 *       <GenreDescription description={genre.description} />
 *       <GenreGames genreId={genre.id} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useGenreDetail(): UseGenreDetailReturn {
  // Subscribe to global genre detail stores
  const genre = useStore($genreDetail);
  const isLoading = useStore($genreDetailLoading);
  const error = useStore($genreDetailError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchGenreDetail = useCallback(async (id: string): Promise<GenreResponse> => {
    setGenreDetailLoading(true);
    setGenreDetailError(null);

    try {
      const response = await genresService.getGenreById(id);
      setGenreDetail(response, id);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch genre details';
      setGenreDetailError(errorMessage);
      throw error;
    } finally {
      setGenreDetailLoading(false);
    }
  }, []);

  const fetchGenreBySlug = useCallback(async (slug: string): Promise<GenreResponse> => {
    setGenreDetailLoading(true);
    setGenreDetailError(null);

    try {
      const response = await genresService.getGenreBySlug(slug);
      setGenreDetail(response, response.id);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch genre by slug';
      setGenreDetailError(errorMessage);
      throw error;
    } finally {
      setGenreDetailLoading(false);
    }
  }, []);

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setGenreDetailError(null);
  }, []);

  const clearData = useCallback(() => {
    clearGenreDetailState();
  }, []);

  const refetch = useCallback(
    async (id?: string): Promise<void> => {
      // If id is provided, use it; otherwise try to refetch current genre
      if (id) {
        await fetchGenreDetail(id);
      } else if (genre) {
        await fetchGenreDetail(genre.id);
      }
    },
    [genre, fetchGenreDetail],
  );

  return {
    // State
    genre,
    isLoading,
    error,

    // Actions
    fetchGenreDetail,
    fetchGenreBySlug,
    clearError,
    clearData,

    // Utils
    refetch,
  };
}

// ============================================================================
// Genre Management Hook (Admin/Moderator)
// ============================================================================

/**
 * Hook for managing genre CRUD operations (Admin/Moderator only)
 *
 * @example
 * ```tsx
 * function GenreManagement() {
 *   const {
 *     isLoading,
 *     error,
 *     createGenre,
 *     updateGenre,
 *     deleteGenre,
 *     clearError
 *   } = useGenreManagement();
 *
 *   const handleCreateGenre = async (data: CreateGenreRequest) => {
 *     try {
 *       const newGenre = await createGenre(data);
 *       // Handle success (e.g., show toast, redirect)
 *     } catch (error) {
 *       // Error is already handled by the hook
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <GenreForm onSubmit={handleCreateGenre} isLoading={isLoading} />
 *       {error && <ErrorMessage message={error} onClose={clearError} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useGenreManagement(): UseGenreManagementReturn {
  // Subscribe to global genre form stores
  const isLoading = useStore($genreFormLoading);
  const error = useStore($genreFormError);

  // ============================================================================
  // API Actions
  // ============================================================================

  const createGenre = useCallback(async (genreData: CreateGenreRequest): Promise<GenreResponse> => {
    setGenreFormLoading(true);
    setGenreFormError(null);

    try {
      const response = await genresService.createGenre(genreData);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create genre';
      setGenreFormError(errorMessage);
      throw error;
    } finally {
      setGenreFormLoading(false);
    }
  }, []);

  const updateGenre = useCallback(
    async (id: string, genreData: UpdateGenreRequest): Promise<GenreResponse> => {
      setGenreFormLoading(true);
      setGenreFormError(null);

      try {
        const response = await genresService.updateGenre(id, genreData);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update genre';
        setGenreFormError(errorMessage);
        throw error;
      } finally {
        setGenreFormLoading(false);
      }
    },
    [],
  );

  const deleteGenre = useCallback(async (id: string): Promise<void> => {
    setGenreFormLoading(true);
    setGenreFormError(null);

    try {
      await genresService.deleteGenre(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete genre';
      setGenreFormError(errorMessage);
      throw error;
    } finally {
      setGenreFormLoading(false);
    }
  }, []);

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setGenreFormError(null);
  }, []);

  const clearState = useCallback(() => {
    clearGenreFormState();
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    createGenre,
    updateGenre,
    deleteGenre,
    clearError,

    // Utils
    clearState,
  };
}

// ============================================================================
// Specialized Genres Hooks
// ============================================================================

/**
 * Hook for fetching and managing all genres (for dropdowns, filters, etc.)
 */
export function useAllGenres() {
  const { data, isLoading, error, fetchGenres, clearError } = useGenres();

  const fetchAllGenres = useCallback(async () => {
    return fetchGenres({
      limit: 100, // Get a large number to cover most use cases
    });
  }, [fetchGenres]);

  useEffect(() => {
    fetchAllGenres();
  }, [fetchAllGenres]);

  return {
    genres: data?.data || [],
    isLoading,
    error,
    refetch: fetchAllGenres,
    clearError,
  };
}

/**
 * Hook for fetching and managing popular genres
 */
export function usePopularGenres(limit: number = 20) {
  const { data, isLoading, error, getPopularGenres, clearError } = useGenres();

  const fetchPopularGenres = useCallback(async () => {
    return getPopularGenres({
      limit,
    });
  }, [getPopularGenres, limit]);

  useEffect(() => {
    fetchPopularGenres();
  }, [fetchPopularGenres]);

  return {
    genres: data?.data || [],
    isLoading,
    error,
    refetch: fetchPopularGenres,
    clearError,
  };
}
