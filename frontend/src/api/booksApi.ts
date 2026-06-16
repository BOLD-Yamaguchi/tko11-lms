import { API_ENDPOINTS, USE_MOCK_API } from '../constants/api'
import type {
  Book,
  BorrowingRecord,
  CatalogBook,
  CollectionStatus,
  LibraryLocation,
  LoanStatus,
  ReservationRecord,
  UserLoanHistory,
} from '../types'
import { httpClient } from './httpClient'

type BookSearchResponse = {
  bookId: number
  bookName: string
  isbn: string | null
  authorName: string
  status: string | null
  lendStatus: string | null
  publisher: string
  publishedAt: string | null
  memo: string | null
  categoryLevel1: number | null
  categoryLevel2: number | null
  region: string | null
  shelfNo: string
  tierNo: string | null
}

const collectionStatusByCode: Record<string, CollectionStatus> = {
  '0': '開架',
  '1': '閉架',
  '2': '廃棄',
  open: '開架',
  closed: '閉架',
  disposed: '廃棄',
  available: '開架',
}

const loanStatusByCode: Record<string, LoanStatus> = {
  '0': '貸出可',
  '1': '貸出中',
  '2': '返却申請中',
  '3': '予約中',
  available: '貸出可',
  borrowed: '貸出中',
  return_requested: '返却申請中',
  reserved: '予約中',
}

const majorCategoryById: Record<number, string> = {
  1: '技術書',
  2: '文学',
  3: 'ビジネス',
  4: '資格・試験',
}

const minorCategoryById: Record<number, string> = {
  11: 'クラウド',
  12: 'プログラミング',
  21: 'ネットワーク',
  31: 'データベース',
  41: 'クラウド',
}

function normalizeCode(value: string | null | undefined) {
  return value?.trim().toLowerCase()
}

function toCollectionStatus(value: string | null): CollectionStatus {
  const code = normalizeCode(value)
  return code ? collectionStatusByCode[code] ?? '開架' : '開架'
}

function toLoanStatus(value: string | null): LoanStatus {
  const code = normalizeCode(value)
  return code ? loanStatusByCode[code] ?? '貸出可' : '貸出可'
}

function toLocation(value: string | null): LibraryLocation {
  return value === 'B' ? '大阪' : '東京'
}

function toCatalogBook(response: BookSearchResponse): CatalogBook {
  return {
    id: String(response.bookId),
    title: response.bookName,
    isbn: response.isbn ?? '',
    author: response.authorName,
    publisher: response.publisher,
    publishedAt: response.publishedAt ?? '',
    majorCategory: response.categoryLevel1
      ? majorCategoryById[response.categoryLevel1] ?? String(response.categoryLevel1)
      : '',
    minorCategory: response.categoryLevel2
      ? minorCategoryById[response.categoryLevel2] ?? String(response.categoryLevel2)
      : '',
    collectionStatus: toCollectionStatus(response.status),
    location: toLocation(response.region),
    shelfNumber: response.shelfNo,
    tierNumber: response.tierNo ?? '',
    notes: response.memo ?? '',
    loanStatus: toLoanStatus(response.lendStatus),
  }
}

export async function fetchSearchBooks() {
  const books = await httpClient.get(API_ENDPOINTS.bookSearchAll).json<BookSearchResponse[]>()
  return books.map(toCatalogBook)
}

type UnknownPayload = Record<string, unknown>

async function callBookApi(request: () => Promise<unknown>) {
  try {
    await request()
  } catch (error) {
    if (!USE_MOCK_API) {
      throw error
    }
  }
}

function post(endpoint: string, payload: UnknownPayload) {
  return callBookApi(() => httpClient.post(endpoint, { json: payload }).json())
}

export async function registerBook(book: Book) {
  await post(API_ENDPOINTS.book, { book })
}

export async function fetchBookDetail(bookId: string): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.bookDetail(bookId)).json())
}

export async function fetchBorrowLists(): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.borrowLists).json<BorrowingRecord[]>())
}

export async function fetchHistoryLists(): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.historyLists).json<UserLoanHistory[]>())
}

export async function fetchReservationLists(): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.reservationLists).json<ReservationRecord[]>())
}

export async function searchBooks(
  bookId: string,
  conditions: Record<string, string>,
): Promise<void> {
  const searchParams = Object.fromEntries(
    Object.entries(conditions).filter(([, value]) => value.trim()),
  )

  await callBookApi(() => (
    httpClient.get(API_ENDPOINTS.bookSearch(bookId), { searchParams }).json<CatalogBook[]>()
  ))
}

export async function requestBookReturn(payload: UnknownPayload) {
  await post(API_ENDPOINTS.returnRequest, payload)
}

export async function approveBookReturn(payload: UnknownPayload) {
  await post(API_ENDPOINTS.returnApprove, payload)
}

export async function reserveBook(payload: UnknownPayload) {
  await post(API_ENDPOINTS.reserve, payload)
}

export async function lendBook(payload: UnknownPayload) {
  await post(API_ENDPOINTS.lend, payload)
}

export async function cancelBookReservation(payload: UnknownPayload) {
  await post(API_ENDPOINTS.reserveCancel, payload)
}

export async function rejectBookReturnRequest(payload: UnknownPayload) {
  await post(API_ENDPOINTS.returnReject, payload)
}

export async function directlyReturnBook(payload: UnknownPayload) {
  await post(API_ENDPOINTS.directReturn, payload)
}

export async function updateBookInformation(bookId: string, book: Book) {
  await callBookApi(() => (
    httpClient.put(API_ENDPOINTS.bookUpdate(bookId), { json: { book } }).json()
  ))
}

export async function bulkReturnBooks(records: BorrowingRecord[]) {
  await post(API_ENDPOINTS.bulkReturn, { records })
}

export async function importBooksFromCsv(books: Book[]) {
  await post(API_ENDPOINTS.csvImport, { books })
}

export async function fetchMyPageInformation(): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.myPage).json())
}

export async function updateBookHistoryVisibility(
  bookId: string,
  visibleHistoryIds: string[],
) {
  await callBookApi(() => (
    httpClient.put(API_ENDPOINTS.historyLists, {
      json: {
        bookId,
        visibleHistoryIds,
      },
    }).json()
  ))
}

export async function deleteBook(id: string) {
  await callBookApi(() => (
    httpClient.delete(`${API_ENDPOINTS.books}/${encodeURIComponent(id)}`, {
      json: { id },
    }).json()
  ))
}
