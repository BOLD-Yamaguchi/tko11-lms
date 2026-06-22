export const BORROWING_FILTER_OPTIONS = [
  { value: 'employeeCode', label: '社員番号' },
  { value: 'name', label: '借受人名' },
  { value: 'title', label: '書籍名' },
] as const

export const RESERVATION_FILTER_OPTIONS = [
  { value: 'reserver', label: '予約者' },
  { value: 'title', label: '書籍名' },
] as const

export const HISTORY_FILTER_OPTIONS = [
  { value: 'borrower', label: '貸出者' },
  { value: 'title', label: '書籍名' },
] as const
