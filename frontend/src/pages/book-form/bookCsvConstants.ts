import type {
  CollectionStatus,
  LibraryLocation,
} from '../../types'

export const BOOK_CSV_COLUMN_COUNT = 12

export const BOOK_CSV_COLUMN = {
  title: 0,
  isbn: 1,
  author: 2,
  collectionStatus: 3,
  publisher: 4,
  publishedAt: 5,
  notes: 6,
  majorCategory: 7,
  minorCategory: 8,
  location: 9,
  shelfNumber: 10,
  tierNumber: 11,
} as const

export const COLLECTION_STATUS_BY_CODE: Record<string, CollectionStatus> = {
  '0': '開架',
  '1': '閉架',
}

export const LOCATION_BY_CODE: Record<string, LibraryLocation> = {
  '0': '東京',
  '1': '大阪',
}

export const MAJOR_CATEGORY_BY_CODE: Record<string, string> = {
  '0': '技術書',
  '1': '自己啓発',
  '2': 'その他',
}
