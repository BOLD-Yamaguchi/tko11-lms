import type {
  BorrowingRecord,
  CatalogBook,
  LibraryData,
  LoanHistory,
  ReservationRecord,
  UserLoanHistory,
} from '../types'
import { UserRole } from '../types' // UserRoleをインポート

const baseBook = {
  isbn: '978-4-123456-78-9',
  publisher: '技術評論社',
  publishedAt: '2023-04-15',
  majorCategory: '技術書',
  minorCategory: 'プログラミング',
  collectionStatus: '開架' as const,
  location: '東京' as const,
  tierNumber: '02',
  notes: '付録なし',
}

const books: CatalogBook[] = [
  { ...baseBook, id: 'B0001', title: 'AWS入門', author: '山田太郎', shelfNumber: 'A-01', loanStatus: '貸出可' }
]

const emptyBook: CatalogBook = {
  id: 'B0013',
  title: '',
  isbn: '',
  author: '',
  publisher: '',
  publishedAt: '',
  majorCategory: '',
  minorCategory: '',
  collectionStatus: '開架',
  location: '東京',
  shelfNumber: '',
  tierNumber: '',
  notes: '',
  loanStatus: '貸出可',
}

const borrowingRecords: BorrowingRecord[] = []

const reservationRecords: ReservationRecord[] = [
//  { employeeCode: 'S0004', title: '機械学習の基礎', author: '渡辺直樹', reserver: '田中次郎', reservationDate: '2025/05/24', shelfNumber: 'A', tierNumber: '01' },
]

const userLoanHistory: UserLoanHistory[] = [
//  { bookId: 'B0001', title: 'Linuxの基礎', author: '田中次郎', borrower: '田中次郎', loanDate: '2025/04/26', returnDate: '2025/05/10', shelfNumber: 'A', tierNumber: '02' },
]

const loanHistory: LoanHistory[] = [
  { id: 'L001', borrower: '○○さん', loanDate: '2026/03/01', returnDate: '2026/03/15', comment: 'とても分かりやすく、実践的な内容でした。' },
]

const roleProfiles = {
  [UserRole.General]: {
    title: 'ユーザー情報',
    label: '一般ユーザー',
    userId: 'U0001',
    employeeCode: 'S0001',
    name: '山田 太郎',
    location: '東京' as const,
  },
  [UserRole.Operator]: {
    title: 'ユーザー情報',
    label: '貸出ユーザー',
    userId: 'L0001',
    employeeCode: 'S0101',
    name: '貸出 担当',
    location: '東京' as const,
  },
  [UserRole.Admin]: {
    title: 'ユーザー情報',
    label: '管理者ユーザー',
    userId: 'A0001',
    employeeCode: 'S9001',
    name: '管理 太郎',
    location: '東京' as const,
  },
}

export const mockLibraryData: LibraryData = {
  books,
  emptyBook,
  borrowingRecords,
  reservationRecords,
  userLoanHistory,
  loanHistory,
  roleProfiles,
  categoryOptions: {
    major: ['技術書', '自己啓発', 'その他'],
    minor: [
      'クラウド', 'プログラミング', 'ネットワーク', 'データベース',
      '資格・試験', 'キャリア', '学習法', 'その他',
    ],
    minorByMajor: {
      技術書: ['クラウド', 'プログラミング', 'ネットワーク', 'データベース','資格・試験','その他'],
      自己啓発: ['キャリア', '学習法','その他'],
      その他: ['その他'],
    },
  },
  locations: ['東京', '大阪'],

  bookStatusDetails: {
    B0002: {
      borrowerName: '山田太郎',
      returnDueDate: '2026/12/12',
    },
  },
  historyVisibility: Object.fromEntries(
    books.map((book) => [book.id, loanHistory.map((history) => history.id)]),
  ),
  returnComments: {
    B0003: '図が多く、理解しやすかったです。',
  },
}