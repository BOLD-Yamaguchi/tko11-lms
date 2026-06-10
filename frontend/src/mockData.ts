import type {
  BorrowingRecord,
  CatalogBook,
  LoanHistory,
  ReservationRecord,
  UserLoanHistory,
} from './types'

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

export const initialBooks: CatalogBook[] = [
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
  { ...baseBook, id: 'B0012', title: 'ネットワーク入門', author: '小林優子', shelfNumber: 'C-02', loanStatus: '貸出可' },
]

export const initialBook = initialBooks[1]

export const emptyBook: CatalogBook = {
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

export const borrowingRecords: BorrowingRecord[] = [
  { id: 'U0001', borrower: '山田太郎', title: 'AWS入門', author: '山田太郎', loanDate: '2025/05/20', shelfNumber: 'A-01-03', tierNumber: '01', status: '貸出中' },
  { id: 'U0002', borrower: '佐藤花子', title: 'Python実践', author: '佐藤花子', loanDate: '2025/05/18', shelfNumber: 'B-02-01', tierNumber: '02', status: '貸出中' },
  { id: 'U0003', borrower: '鈴木一郎', title: 'データ分析の基礎', author: '鈴木一郎', loanDate: '2025/05/22', shelfNumber: 'C-01-05', tierNumber: '03', status: '返却申請中' },
  { id: 'U0004', borrower: '田中次郎', title: 'Linuxの基礎', author: '田中次郎', loanDate: '2025/05/16', shelfNumber: 'A-02-02', tierNumber: '01', status: '貸出中' },
  { id: 'U0005', borrower: '高橋美咲', title: 'SQL入門', author: '高橋美咲', loanDate: '2025/05/16', shelfNumber: 'B-01-04', tierNumber: '03', status: '貸出中' },
  { id: 'U0006', borrower: '伊藤健一', title: 'データベース設計', author: '伊藤健一', loanDate: '2025/05/17', shelfNumber: 'C-03-01', tierNumber: '03', status: '貸出中' },
  { id: 'U0007', borrower: '渡辺直樹', title: '機械学習の基礎', author: '渡辺直樹', loanDate: '2025/05/19', shelfNumber: 'A-03-02', tierNumber: '01', status: '貸出中' },
  { id: 'U0008', borrower: '中村真由美', title: 'Webアプリ開発入門', author: '中村真由美', loanDate: '2025/05/21', shelfNumber: 'B-03-03', tierNumber: '02', status: '貸出中' },
  { id: 'U0009', borrower: '小林大輔', title: 'ネットワークの基礎', author: '小林大輔', loanDate: '2025/05/14', shelfNumber: 'C-02-04', tierNumber: '03', status: '貸出中' },
  { id: 'U0010', borrower: '加藤優子', title: '情報セキュリティ入門', author: '加藤優子', loanDate: '2025/05/13', shelfNumber: 'A-01-05', tierNumber: '01', status: '貸出中' },
]

export const reservationRecords: ReservationRecord[] = [
  { title: '機械学習の基礎', author: '渡辺直樹', reserver: '田中次郎', reservationDate: '2025/05/24', shelfNumber: 'A', tierNumber: '01' },
  { title: 'ネットワークの基礎', author: '小林大輔', reserver: '中村真由美', reservationDate: '2025/05/23', shelfNumber: 'C', tierNumber: '03' },
  { title: 'Webアプリ開発入門', author: '中村真由美', reserver: '加藤優子', reservationDate: '2025/05/24', shelfNumber: 'B', tierNumber: '02' },
]

export const userLoanHistory: UserLoanHistory[] = [
  { title: 'Linuxの基礎', author: '田中次郎', borrower: '田中次郎', loanDate: '2025/04/26', returnDate: '2025/05/10', shelfNumber: 'A', tierNumber: '02' },
  { title: 'SQL入門', author: '高橋美咲', borrower: '高橋美咲', loanDate: '2025/04/12', returnDate: '2025/04/28', shelfNumber: 'B', tierNumber: '01' },
  { title: 'データベース設計', author: '伊藤健一', borrower: '伊藤健一', loanDate: '2025/04/01', returnDate: '2025/04/15', shelfNumber: 'C', tierNumber: '03' },
]

export const loanHistory: LoanHistory[] = [
  { id: 'L001', borrower: '○○さん', loanDate: '2026/03/01', returnDate: '2026/03/15', comment: 'とても分かりやすく、実践的な内容でした。' },
  { id: 'L002', borrower: '△△さん', loanDate: '2026/02/01', returnDate: '2026/02/14', comment: '図が多く、理解しやすかったです。' },
  { id: 'L003', borrower: '□□さん', loanDate: '2026/01/05', returnDate: '2026/01/18', comment: '初心者にもおすすめの一冊です。' },
  { id: 'L004', borrower: '××さん', loanDate: '2025/12/01', returnDate: '2025/12/15', comment: 'クラウドの基礎がしっかり学べました。' },
  { id: 'L005', borrower: '◇◇さん', loanDate: '2025/11/01', returnDate: '2025/11/15', comment: '実例が多く、参考になりました。' },
]
