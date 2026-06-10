import type { UserRole } from './types'

export const roleInfo: Record<UserRole, {
  label: string
  userId: string
  name: string
}> = {
  general: {
    label: '一般ユーザー',
    userId: 'U0001',
    name: '山田 太郎',
  },
  operator: {
    label: '貸出ユーザー',
    userId: 'L0001',
    name: '貸出 担当',
  },
  admin: {
    label: '管理者ユーザー',
    userId: 'A0001',
    name: '管理 太郎',
  },
}
