export const LOAN_STATUS_OPTIONS = [
  { value: '', label: '指定なし' },
  { value: '貸出可', label: '貸出可' },
  { value: '貸出中', label: '貸出中' },
  { value: '返却申請中', label: '返却申請中' },
] as const

export const COLLECTION_STATUS_OPTIONS = [
  { value: '', label: '全て' },
  { value: '開架', label: '開架' },
] as const

export const ADMIN_COLLECTION_STATUS_OPTION = {
  value: '廃棄',
  label: '廃棄',
} as const

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
export const DEFAULT_PAGE_SIZE = 20
