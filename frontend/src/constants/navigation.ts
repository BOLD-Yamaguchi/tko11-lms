import type { HamburgerMenuItem } from '../components/HamburgerMenu'
import type { UserRole } from '../types'

const SYSTEM_MENU_ITEM = {
  id: 'system',
  label: 'システムメニュー',
  description: '最初のメニューへ戻る',
} as const

const MY_PAGE_MENU_ITEM = {
  id: 'mypage',
  label: 'マイページ',
  description: '利用状況を確認する',
} as const

const SEARCH_MENU_ITEM = {
  id: 'search',
  label: '書籍検索',
  description: '蔵書を条件検索する',
} as const

const CREATE_MENU_ITEM = {
  id: 'create',
  label: '書籍登録',
  description: '新しい書籍を登録する',
} as const

const LOGOUT_MENU_ITEM = {
  id: 'logout',
  label: 'ログアウト',
  description: 'ログイン画面へ戻る',
} as const

export function getHomeMenuItems(role: UserRole): HamburgerMenuItem[] {
  return [
    { id: 'books', label: '書籍管理', description: 'マイページと書籍検索を開きます' },
    ...(role === 'admin'
      ? [{ id: 'users', label: 'ユーザー管理', description: 'ユーザー管理モックを確認します' }]
      : []),
    { ...LOGOUT_MENU_ITEM, description: 'ログイン画面へ戻ります' },
  ]
}

export function getMyPageMenuItems(role: UserRole): HamburgerMenuItem[] {
  return [
    SYSTEM_MENU_ITEM,
    SEARCH_MENU_ITEM,
    ...(role === 'admin' ? [CREATE_MENU_ITEM] : []),
    LOGOUT_MENU_ITEM,
  ]
}

export function getBookSearchMenuItems(role: UserRole): HamburgerMenuItem[] {
  return [
    MY_PAGE_MENU_ITEM,
    ...(role === 'admin' ? [CREATE_MENU_ITEM] : []),
    SYSTEM_MENU_ITEM,
    LOGOUT_MENU_ITEM,
  ]
}

export function getBookFormMenuItems(isEdit: boolean): HamburgerMenuItem[] {
  return [
    MY_PAGE_MENU_ITEM,
    SEARCH_MENU_ITEM,
    ...(isEdit ? [CREATE_MENU_ITEM] : []),
    SYSTEM_MENU_ITEM,
    LOGOUT_MENU_ITEM,
  ]
}

export function getBookDetailMenuItems(role: UserRole): HamburgerMenuItem[] {
  return [
    MY_PAGE_MENU_ITEM,
    SEARCH_MENU_ITEM,
    ...(role === 'admin' ? [CREATE_MENU_ITEM] : []),
    SYSTEM_MENU_ITEM,
    LOGOUT_MENU_ITEM,
  ]
}
