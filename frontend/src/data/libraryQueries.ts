import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { fetchLibraryData } from './libraryApi'

export const libraryDataQueryKey = ['library-data'] as const

const libraryDataQueryOptions = queryOptions({
  queryKey: libraryDataQueryKey,
  queryFn: fetchLibraryData,
  staleTime: 60_000,
})

export function useLibraryData() {
  return useQuery(libraryDataQueryOptions)
}

export function useLibraryDataValue() {
  return useSuspenseQuery(libraryDataQueryOptions).data
}
