import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { fetchLibraryData } from './libraryApi'

export const libraryDataQueryKey = ['library-data'] as const

const libraryDataQueryOptions = queryOptions({
  queryKey: libraryDataQueryKey,
  queryFn: fetchLibraryData,
  staleTime: 60_000,
})

export function useLibraryData() {
  // 読み込み・エラー状態を含めて書籍管理データを取得する画面向けHook。
  return useQuery(libraryDataQueryOptions)
}

export function useLibraryDataValue() {
  // Suspense配下で、取得済みの書籍管理データを直接利用する画面向けHook。
  return useSuspenseQuery(libraryDataQueryOptions).data
}
