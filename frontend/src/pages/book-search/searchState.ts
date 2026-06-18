import { DEFAULT_PAGE_SIZE } from '../../constants/bookSearch'
import type { CatalogBook } from '../../types'

export type SearchConditions = {
  id: string
  title: string
  author: string
  publisher: string
  publishedFrom: string
  publishedTo: string
  loanStatus: string
  majorCategory: string
  minorCategory: string
  collectionStatus: string
}

export type BookSearchSortKey =
  | 'id'
  | 'title'
  | 'author'
  | 'publisher'
  | 'loanStatus'

export type BookSearchState = {
  form: SearchConditions
  conditions: SearchConditions
  results: CatalogBook[]
  hasSearched: boolean
  sortKey: BookSearchSortKey
  ascending: boolean
  page: number
  pageSize: number
}

export const emptySearchConditions: SearchConditions = {
  id: '',
  title: '',
  author: '',
  publisher: '',
  publishedFrom: '',
  publishedTo: '',
  loanStatus: '',
  majorCategory: '',
  minorCategory: '',
  collectionStatus: '',
}

export const initialBookSearchState: BookSearchState = {
  form: emptySearchConditions,
  conditions: emptySearchConditions,
  results: [],
  hasSearched: false,
  sortKey: 'id',
  ascending: true,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}
