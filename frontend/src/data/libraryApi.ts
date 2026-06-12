import type { LibraryData } from '../types'
import { mockLibraryData } from './mockLibraryData'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const libraryDataEndpoint = '/api/library-data'
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false'

export async function fetchLibraryData(): Promise<LibraryData> {
  if (useMockApi) {
    return structuredClone(mockLibraryData)
  }

  const response = await fetch(`${apiBaseUrl}${libraryDataEndpoint}`)
  if (!response.ok) {
    throw new Error(`書籍管理データの取得に失敗しました: ${response.status}`)
  }

  return response.json() as Promise<LibraryData>
}
