import { API_ENDPOINTS } from '../constants/api'
import { httpClient } from './httpClient'
import type {
  CatalogBook,
  CollectionStatus,
  LibraryLocation,
  LoanStatus,
} from '../types'

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

export async function searchBooks() {
  const books = await httpClient.get(API_ENDPOINTS.bookSearchAll).json<BookSearchResponse[]>()
  return books.map(toCatalogBook)
}

export async function deleteBook(id: string) {
  await httpClient.delete(`${API_ENDPOINTS.books}/${encodeURIComponent(id)}`, {
    json: { id },
  })
}
