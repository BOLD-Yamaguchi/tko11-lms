import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRole } from '../types'
import {
  Header,
  LogoutConfirmationModal,
} from './index'

import type {
  AppFrameProps
} from '../types'

import type { HamburgerMenuItem } from './'

function AppFrame({
  role,
  onLogout,
  children,
}: AppFrameProps) {
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const menuItems: HamburgerMenuItem[] = [
    { id: 'home', label: 'トップページ', description: 'トップページへ戻る' },
    { id: 'mypage', label: 'マイページ', description: '利用状況を確認する' },
    { id: 'search', label: '書籍検索', description: '蔵書を条件検索する' },
    ...(role === UserRole.Admin
      ? [{ id: 'create', label: '書籍登録', description: '新しい書籍を登録する' }]
      : []),
  ]

  const handleMenuSelect = (item: HamburgerMenuItem) => {
    if (item.id === 'home') navigate('/home')
    if (item.id === 'mypage') navigate('/mypage')
    if (item.id === 'search') navigate('/search')
    if (item.id === 'create') navigate('/create')
  }

  const logout = () => {
    setLogoutOpen(false)
    onLogout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-screen-layout">
      <Header
        title="書籍貸出管理システム"
        eyebrow="BOOK MANAGEMENT SYSTEM"
        menuItems={menuItems}
        onMenuSelect={handleMenuSelect}
      >
        
      </Header>
      <div className="app-screen-content">
        {children}
      </div>
      <LogoutConfirmationModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={logout}
      />
    </div>
  )
}

export default AppFrame