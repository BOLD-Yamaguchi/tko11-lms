export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
).replace(/\/+$/, '')

export const API_ENDPOINTS = {
  libraryData: 'api/library-data',
  users: 'users',
  books: 'books',
} as const

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'
