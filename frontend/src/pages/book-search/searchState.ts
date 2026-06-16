import { DEFAULT_PAGE_SIZE } from '../../constants/bookSearch'

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
  location: string
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
  location: '',
}

export const initialBookSearchState: BookSearchState = {
  form: emptySearchConditions,
  conditions: emptySearchConditions,
  hasSearched: false,
  sortKey: 'id',
  ascending: true,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}
