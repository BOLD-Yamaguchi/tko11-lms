export type CollectionStatus = '開架' | '閉架' | '廃棄'
export type LibraryLocation = '東京' | '大阪'
export type LoanStatus = '貸出可' | '貸出中' | '返却申請中' | '予約中'
export type UserRole = 'general' | 'operator' | 'admin'

export type Book = {
  id: string
  title: string
  isbn: string
  author: string
  publisher: string
  publishedAt: string
  majorCategory: string
  minorCategory: string
  collectionStatus: CollectionStatus
  location: LibraryLocation
  shelfNumber: string
  tierNumber: string
  notes: string
}

export type CatalogBook = Book & {
  loanStatus: LoanStatus
}

export type LoanHistory = {
  id: string
  borrower: string
  loanDate: string
  returnDate: string
  comment: string
}

export type BorrowingRecord = {
  id: string
  borrower: string
  title: string
  author: string
  loanDate: string
  shelfNumber: string
  tierNumber: string
  status: '貸出中' | '返却申請中'
}

export type ReservationRecord = {
  title: string
  author: string
  reserver: string
  reservationDate: string
  shelfNumber: string
  tierNumber: string
}

export type UserLoanHistory = {
  title: string
  author: string
  borrower: string
  loanDate: string
  returnDate: string
  shelfNumber: string
  tierNumber: string
}
