import type { HamburgerMenuItem } from '../components/HamburgerMenu'
import { UserRole } from '../types'

const HOME_MENU_ITEM = {
  id: 'home',
  label: 'トップページ',
  description: 'トップページへ戻る',
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

export function getMyPageTitle(role: UserRole) {
  if (role === UserRole.Admin) return '書籍管理'
  if (role === UserRole.Operator) return '貸出ページ'
  return 'マイページ'
}

function getMyPageMenuItem(role: UserRole): HamburgerMenuItem {
  return {
    id: 'mypage',
    label: getMyPageTitle(role),
    description: '利用状況を確認する',
  }
}

export function getHomeMenuItems(role: UserRole): HamburgerMenuItem[] {
  return [
    {
      id: 'books',
      label: '書籍管理',
      description: `${getMyPageTitle(role)}と書籍検索を開きます`,
    },
    ...(role === UserRole.Admin
      ? [{ id: 'users', label: 'ユーザー管理', description: 'ユーザー管理モックを確認します' }]
      : []),
    { ...LOGOUT_MENU_ITEM, description: 'ログイン画面へ戻ります' },
  ]
}

export function getMyPageMenuItems(role: UserRole): HamburgerMenuItem[] {
  return [
    HOME_MENU_ITEM,
    SEARCH_MENU_ITEM,
    ...(role === UserRole.Admin ? [CREATE_MENU_ITEM] : []),
    LOGOUT_MENU_ITEM,
  ]
}

export function getBookSearchMenuItems(role: UserRole): HamburgerMenuItem[] {
  return [
    getMyPageMenuItem(role),
    ...(role === UserRole.Admin ? [CREATE_MENU_ITEM] : []),
    HOME_MENU_ITEM,
    LOGOUT_MENU_ITEM,
  ]
}

export function getBookFormMenuItems(
  isEdit: boolean,
  role: UserRole,
): HamburgerMenuItem[] {
  return [
    getMyPageMenuItem(role),
    SEARCH_MENU_ITEM,
    ...(isEdit ? [CREATE_MENU_ITEM] : []),
    HOME_MENU_ITEM,
    LOGOUT_MENU_ITEM,
  ]
}

export function getBookDetailMenuItems(role: UserRole): HamburgerMenuItem[] {
  return [
    getMyPageMenuItem(role),
    SEARCH_MENU_ITEM,
    ...(role === UserRole.Admin ? [CREATE_MENU_ITEM] : []),
    HOME_MENU_ITEM,
    LOGOUT_MENU_ITEM,
  ]
}
