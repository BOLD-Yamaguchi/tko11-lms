import type { ReactNode } from 'react'

export type CollectionStatus = '開架' | '閉架' | '廃棄'
export type LibraryLocation = '東京' | '大阪'
export type LoanStatus = '貸出可' | '貸出中' | '返却申請中' | '予約中'

export type UserProfile = {
  title: string
  label: string
  userId: string
  employeeCode: string
  name: string
  location: LibraryLocation
}

export type BookStatusDetail = {
  lendUserId?: string
  borrowerName?: string
  reserverName?: string
  reservationemployeeCode?: string
  returnDueDate?: string
  reservationDate?: string
}

export const UserRole = {
  General: 0,
  Operator: 1,
  Admin: 2,
} as const

export type UserRole =
  typeof UserRole[keyof typeof UserRole]

export function getRoleName(role: UserRole): string {
  switch (role) {
    case UserRole.General:
      return '一般利用者'

    case UserRole.Operator:
      return '貸出管理者'

    case UserRole.Admin:
      return '管理者'

    default:
      return '不明'
  }
}

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


export type AppFrameProps = {
  role: UserRole
  onLogout: () => void
  children: ReactNode
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

export type ReservationRecord = {
  employeeCode: string
  title: string
  author: string
  reserver: string
  reservationDate: string
  shelfNumber: string
  tierNumber: string
}

export type UserLoanHistory = {
  bookId: string
  title: string
  author: string
  borrower: string
  loanDate: string
  returnDate: string
  shelfNumber: string
  tierNumber: string
}

export type LibraryData = {
  books: CatalogBook[]
  emptyBook: CatalogBook
  borrowingRecords: BorrowingRecord[]
  reservationRecords: ReservationRecord[]
  userLoanHistory: UserLoanHistory[]
  loanHistory: LoanHistory[]
  roleProfiles: Record<UserRole, UserProfile>
  categoryOptions: {
    major: string[]
    minor: string[]
    minorByMajor?: Record<string, string[]>
  }
  locations: LibraryLocation[]
  bookStatusDetails: Record<string, BookStatusDetail>
  historyVisibility: Record<string, string[]>
  returnComments: Record<string, string>
}
