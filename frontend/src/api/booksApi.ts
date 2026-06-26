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
  bookStatus: string | null
  publisher: string
  publishedAt: string | null
  memo: string | null
  categoryLevel1: number | null
  categoryLevel2: number | null
  region: string | null
  shelfNo: string
  tierNo: number | string | null
}

export type BorrowingRecordResponse = {
  employeeCode: string
  borrower: string 
  title: string
  author: string
  loanDate: string
  shelfNumber: string
  tierNumber: string
  status: string
  returnComment?: string
}

export type SearchBooksConditions = {
  id?: string
  title?: string
  author?: string
  publisher?: string
  publishedFrom?: string
  publishedTo?: string
  loanStatus?: string
  majorCategory?: string
  minorCategory?: string
  collectionStatus?: string
  location?: string
}

const collectionStatusByCode: Record<string, CollectionStatus> = {
  '0': '開架',
  '1': '閉架',
  '2': '廃棄',
  開架: '開架',
  閉架: '閉架',
  廃棄: '廃棄',
  open: '開架',
  closed: '閉架',
  disposed: '廃棄',
  available: '開架',
}

const loanStatusByCode: Record<string, LoanStatus> = {
  '0': '貸出可',
  '1': '予約中',
  '2': '貸出中',
  '3': '返却申請中',
  貸出可: '貸出可',
  貸出中: '貸出中',
  返却申請中: '返却申請中',
  予約中: '予約中',
  available: '貸出可',
  borrowed: '貸出中',
  return_requested: '返却申請中',
  reserved: '予約中',
}

const majorCategoryById: Record<number, string> = {
  0: '技術書',
  1: '自己啓発',
  2: 'その他',
}

const minorCategoryById: Record<number, string> = {
  1: 'クラウド',
  2: 'プログラミング',
  3: 'ネットワーク',
  4: 'データベース',
  5: '資格・試験',
  6: 'マネジメント',
  7: 'キャリア',
  8: '学習法',
  9: 'その他',
  10: 'その他',
  11: 'その他',
}

const majorCategoryCodeByName: Record<string, string> = {
  技術書: '0',
  自己啓発: '1',
  その他: '2',
}

const minorCategoryCodeByName: Record<string, string> = Object.fromEntries(
  Object.entries(minorCategoryById).map(([code, name]) => [name, code]),
)

const collectionStatusCodeByName: Record<string, string> = {
  開架: '0',
  閉架: '1',
  廃棄: '2',
}

const loanStatusCodeByName: Record<string, string> = {
  貸出可: '0',
  予約中: '1',
  貸出中: '2',
  返却申請中: '3',
}

const locationCodeByName: Record<string, string> = {
  東京: '0',
  大阪: '1',
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
  return value === '1' || value === 'B' ? '大阪' : '東京'
}

function toCatalogBook(response: BookSearchResponse): CatalogBook {
  return {
    id: String(response.bookId),
    title: response.bookName,
    isbn: response.isbn ?? '',
    author: response.authorName,
    publisher: response.publisher,
    publishedAt: response.publishedAt ?? '',
    majorCategory: response.categoryLevel1 !== null
      ? majorCategoryById[response.categoryLevel1] ?? String(response.categoryLevel1)
      : '',
    minorCategory: response.categoryLevel2 !== null
      ? minorCategoryById[response.categoryLevel2] ?? String(response.categoryLevel2)
      : '',
    collectionStatus: toCollectionStatus(response.bookStatus),
    location: toLocation(response.region),
    shelfNumber: response.shelfNo,
    tierNumber: response.tierNo === null ? '' : String(response.tierNo),
    notes: response.memo ?? '',
    loanStatus: toLoanStatus(response.status),
  }
}

function toBorrowingRecord(
  response: BorrowingRecordResponse,
): BorrowingRecord {
  return {
    employeeCode: response.employeeCode,
    borrower: response.borrower,
    title: response.title,
    author: response.author,
    loanDate: response.loanDate,
    shelfNumber: response.shelfNumber,
    tierNumber: response.tierNumber,
    status: response.status as "貸出中" | "返却申請中",
    returnComment: response.returnComment,
  }
}

export async function fetchSearchBooks() {
  return searchBooks()
}

function toSearchParams(conditions: SearchBooksConditions = {}) {
  return Object.fromEntries(
    Object.entries({
      bookId: /^\d+$/.test(conditions.id?.trim() ?? '')
        ? conditions.id?.trim()
        : undefined,
      bookName: conditions.title?.trim(),
      authorName: conditions.author?.trim(),
      publisher: conditions.publisher?.trim(),
      publishedAtStart: conditions.publishedFrom,
      publishedAtEnd: conditions.publishedTo,
      categoryLevel1: conditions.majorCategory
        ? majorCategoryCodeByName[conditions.majorCategory]
        : undefined,
      categoryLevel2: conditions.minorCategory
        ? minorCategoryCodeByName[conditions.minorCategory]
        : undefined,
      status: conditions.loanStatus
        ? loanStatusCodeByName[conditions.loanStatus]
        : undefined,
      bookStatus: conditions.collectionStatus
        ? collectionStatusCodeByName[conditions.collectionStatus]
        : undefined,
      region: conditions.location
        ? locationCodeByName[conditions.location]
        : undefined,
    }).filter(([, value]) => value !== undefined && value !== ''),
  )
}

type UnknownPayload = Record<string, unknown>

// 1. callBookApi の中で、リクエストの結果をしっかり return するように修正
async function callBookApi<T>(request: () => Promise<T>): Promise<T | undefined> {
  try {
    return await request() // ★ 修正：await の前に return を追加
  } catch (error) {
    if (!USE_MOCK_API) {
      throw error
    }
    return undefined
  }
}

// 2. post 関数が callBookApi の戻り値をそのまま上に返せるように修正
function post(endpoint: string, payload: UnknownPayload) {
  // callBookApi が return するようになったので、自動的に中身が呼び出し元に返ります
  return callBookApi(() => httpClient.post(endpoint, { json: payload }).json())
}

// 3. registerBook でデータを受け取る
export async function registerBook(book: Book): Promise<any> {
  const response: any = await post(API_ENDPOINTS.book + '/create', book)
  
  // お使いの httpClient.post(...).json() の仕様によって、
  // response 自体にデータが入るか、response.data に入るかが変わります。
  // 安全のため、両方に対応できるようにしておきます。
  return response?.data ?? response
}

export async function fetchBookDetail(bookId: string): Promise<void> {
  await callBookApi(() => httpClient.get(API_ENDPOINTS.bookDetail(bookId)).json())
}

export async function fetchBorrowLists(): Promise<BorrowingRecord[]> {
  const response = await httpClient
    .get(API_ENDPOINTS.borrowLists)
    .json<BorrowingRecordResponse[]>()

  return response.map(toBorrowingRecord)
}

export async function fetchHistoryLists() {
  return httpClient
    .get(API_ENDPOINTS.historyLists)
    .json<UserLoanHistory[]>()
}

export async function fetchReservationLists() {
  return httpClient
    .get(API_ENDPOINTS.reservationLists)
    .json<ReservationRecord[]>()
}

export async function searchBooks(
  conditions: SearchBooksConditions = {},
): Promise<CatalogBook[]> {
  const books = await httpClient.get(API_ENDPOINTS.bookSearch, {
    searchParams: toSearchParams(conditions),
  }).json<BookSearchResponse[]>()
  return books.map(toCatalogBook)
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

export async function fetchMyPageInformation() {
  return httpClient
    .get(API_ENDPOINTS.myPage)
    .json()
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
