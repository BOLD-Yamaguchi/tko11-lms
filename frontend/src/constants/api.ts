export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
).replace(/\/+$/, '')

export const API_ENDPOINTS = {
  libraryData: 'api/library-data',
  users: 'users',
  book: 'book',
  books: 'books',
  bookDetail: (bookId: string) => `book/${encodeURIComponent(bookId)}`,
  borrowLists: 'book/borrow-lists',
  historyLists: 'book/historiy-lists',
  reservationLists: 'book/reservation-lists',
  bookSearch: 'book/search',
  returnRequest: 'book/return-request',
  returnApprove: 'book/return',
  reserve: 'book/reserve',
  lend: 'book/lend',
  reserveCancel: 'book/cancel-reservation',
  returnReject: 'book/return-reject',
  directReturn: 'book/direcet-return',
  bookUpdate: (bookId: string) => `books/${encodeURIComponent(bookId)}`,
  bulkReturn: 'books/bulk-return',
  csvImport: 'books/csv-import',
  myPage: 'mypage',
} as const

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'
