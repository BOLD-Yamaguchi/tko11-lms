import type {
  BorrowingRecord,
  CatalogBook,
  LibraryData,
  LoanHistory,
  ReservationRecord,
  UserLoanHistory,
  UserRole,
  UserProfile,
} from '../types'

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
  { ...baseBook, id: 'B0001', title: 'AWS入門', author: '山田太郎', shelfNumber: 'A-01', loanStatus: '貸出可' },
  { ...baseBook, id: 'B0002', title: 'AWS入門', author: '山田太郎', shelfNumber: 'A-01', loanStatus: '貸出中' },
  { ...baseBook, id: 'B0003', title: 'AWS入門', author: '山田太郎', shelfNumber: 'A-03', loanStatus: '返却申請中' },
  { ...baseBook, id: 'B0004', title: 'Python実践', author: '佐藤花子', shelfNumber: 'B-02', loanStatus: '予約中' },
  { ...baseBook, id: 'B0005', title: 'Python実践', author: '佐藤花子', shelfNumber: 'B-01', loanStatus: '貸出中' },
  { ...baseBook, id: 'B0006', title: 'データ分析の基礎', author: '鈴木一郎', shelfNumber: 'C-01', loanStatus: '返却申請中' },
  { ...baseBook, id: 'B0007', title: 'データ分析の基礎', author: '鈴木一郎', shelfNumber: 'C-01', loanStatus: '貸出可' },
  { ...baseBook, id: 'B0008', title: '機械学習の教科書', author: '高橋健一', shelfNumber: 'A-03', loanStatus: '貸出中' },
  { ...baseBook, id: 'B0009', title: 'Webアプリ開発入門', author: '伊藤美咲', shelfNumber: 'B-03', loanStatus: '返却申請中' },
  { ...baseBook, id: 'B0010', title: 'Webアプリ開発入門', author: '伊藤美咲', shelfNumber: 'B-03', loanStatus: '貸出可' },
  { ...baseBook, id: 'B0011', title: 'セキュリティの基礎', author: '中村拓也', shelfNumber: 'C-02', loanStatus: '返却申請中' },
  {
    ...baseBook,
    id: 'B0012',
    title: 'ネットワーク入門',
    author: '小林優子',
    shelfNumber: 'C-02',
    collectionStatus: '廃棄',
    loanStatus: '貸出可',
  },
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

const borrowingRecords: BorrowingRecord[] = [
  { employeeNumber: 'S0001', borrower: '山田太郎', title: 'AWS入門', author: '山田太郎', loanDate: '2025/05/20', shelfNumber: 'A-01-03', tierNumber: '01', status: '貸出中' },
  { employeeNumber: 'S0002', borrower: '佐藤花子', title: 'Python実践', author: '佐藤花子', loanDate: '2025/05/18', shelfNumber: 'B-02-01', tierNumber: '02', status: '貸出中' },
  {
    employeeNumber: 'S0003',
    borrower: '鈴木一郎',
    title: 'データ分析の基礎',
    author: '鈴木一郎',
    loanDate: '2025/05/22',
    shelfNumber: 'C-01-05',
    tierNumber: '03',
    status: '返却申請中',
    returnComment: '図が多く、理解しやすかったです。',
  },
  { employeeNumber: 'S0004', borrower: '田中次郎', title: 'Linuxの基礎', author: '田中次郎', loanDate: '2025/05/16', shelfNumber: 'A-02-02', tierNumber: '01', status: '貸出中' },
  { employeeNumber: 'S0005', borrower: '高橋美咲', title: 'SQL入門', author: '高橋美咲', loanDate: '2025/05/16', shelfNumber: 'B-01-04', tierNumber: '03', status: '貸出中' },
  { employeeNumber: 'S0006', borrower: '伊藤健一', title: 'データベース設計', author: '伊藤健一', loanDate: '2025/05/17', shelfNumber: 'C-03-01', tierNumber: '03', status: '貸出中' },
  { employeeNumber: 'S0007', borrower: '渡辺直樹', title: '機械学習の基礎', author: '渡辺直樹', loanDate: '2025/05/19', shelfNumber: 'A-03-02', tierNumber: '01', status: '貸出中' },
  { employeeNumber: 'S0008', borrower: '中村真由美', title: 'Webアプリ開発入門', author: '中村真由美', loanDate: '2025/05/21', shelfNumber: 'B-03-03', tierNumber: '02', status: '貸出中' },
  { employeeNumber: 'S0009', borrower: '小林大輔', title: 'ネットワークの基礎', author: '小林大輔', loanDate: '2025/05/14', shelfNumber: 'C-02-04', tierNumber: '03', status: '貸出中' },
  { employeeNumber: 'S0010', borrower: '加藤優子', title: '情報セキュリティ入門', author: '加藤優子', loanDate: '2025/05/13', shelfNumber: 'A-01-05', tierNumber: '01', status: '貸出中' },
]

const reservationRecords: ReservationRecord[] = [
  { employeeNumber: 'S0004', title: '機械学習の基礎', author: '渡辺直樹', reserver: '田中次郎', reservationDate: '2025/05/24', shelfNumber: 'A', tierNumber: '01' },
  { employeeNumber: 'S0008', title: 'ネットワークの基礎', author: '小林大輔', reserver: '中村真由美', reservationDate: '2025/05/23', shelfNumber: 'C', tierNumber: '03' },
  { employeeNumber: 'S0010', title: 'Webアプリ開発入門', author: '中村真由美', reserver: '加藤優子', reservationDate: '2025/05/24', shelfNumber: 'B', tierNumber: '02' },
]

const userLoanHistory: UserLoanHistory[] = [
  { bookId: 'B0001', title: 'Linuxの基礎', author: '田中次郎', borrower: '田中次郎', loanDate: '2025/04/26', returnDate: '2025/05/10', shelfNumber: 'A', tierNumber: '02' },
  { bookId: 'B0004', title: 'SQL入門', author: '高橋美咲', borrower: '高橋美咲', loanDate: '2025/04/12', returnDate: '2025/04/28', shelfNumber: 'B', tierNumber: '01' },
  { bookId: 'B0006', title: 'データベース設計', author: '伊藤健一', borrower: '伊藤健一', loanDate: '2025/04/01', returnDate: '2025/04/15', shelfNumber: 'C', tierNumber: '03' },
  { bookId: 'B0012', title: 'ネットワーク入門', author: '小林優子', borrower: '小林優子', loanDate: '2025/03/10', returnDate: '2025/03/24', shelfNumber: 'C', tierNumber: '02' },
]

const loanHistory: LoanHistory[] = [
  { id: 'L001', borrower: '○○さん', loanDate: '2026/03/01', returnDate: '2026/03/15', comment: 'とても分かりやすく、実践的な内容でした。' },
  { id: 'L002', borrower: '△△さん', loanDate: '2026/02/01', returnDate: '2026/02/14', comment: '図が多く、理解しやすかったです。' },
  { id: 'L003', borrower: '□□さん', loanDate: '2026/01/05', returnDate: '2026/01/18', comment: '初心者にもおすすめの一冊です。' },
  { id: 'L004', borrower: '××さん', loanDate: '2025/12/01', returnDate: '2025/12/15', comment: 'クラウドの基礎がしっかり学べました。' },
  { id: 'L005', borrower: '◇◇さん', loanDate: '2025/11/01', returnDate: '2025/11/15', comment: '実例が多く、参考になりました。' },
]

const roleProfiles: Record<UserRole, UserProfile> = {
  general: {
    title: 'ユーザー情報',
    label: '一般ユーザー',
    userId: 'U0001',
    employeeNumber: 'S0001',
    name: '山田 太郎',
    location: '東京',
  },
  operator: {
    title: '貸出ユーザー情報',
    label: '貸出ユーザー',
    userId: 'L0001',
    employeeNumber: 'S0101',
    name: '貸出 担当',
    location: '東京',
  },
  admin: {
    title: 'ユーザー情報',
    label: '管理者ユーザー',
    userId: 'A0001',
    employeeNumber: 'S9001',
    name: '管理 太郎',
    location: '東京',
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
    major: ['技術書', '文学', 'ビジネス', '資格・試験'],
    minor: ['クラウド', 'プログラミング', 'ネットワーク', 'データベース'],
  },
  locations: ['東京', '大阪'],
  bookStatusDetails: {
    B0002: {
      borrowerName: '山田太郎',
      returnDueDate: '2026/12/12',
    },
    B0003: {
      borrowerName: '山田太郎',
    },
    B0004: {
      reserverName: '佐藤花子',
      reservationDate: '2026/04/01',
    },
  },
  historyVisibility: Object.fromEntries(
    books.map((book) => [book.id, loanHistory.map((history) => history.id)]),
  ),
  returnComments: {
    B0003: '図が多く、理解しやすかったです。',
    B0006: '具体例が豊富で、業務にも活用できそうです。',
    B0009: '画面構成の説明が分かりやすかったです。',
    B0011: '',
  },
}
