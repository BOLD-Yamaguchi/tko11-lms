import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookIcon, UsersIcon } from '../../Icons'
import { Toast, UserMenu } from '../../components'
import { getHomeMenuItems } from '../../constants/navigation'
import type { UserRole } from '../../types'

type HomeProps = {
  role: UserRole
  onLogout: () => void
}

function Home({ role, onLogout }: HomeProps) {
  const navigate = useNavigate()
  // 画面内操作の案内をトーストとして一時表示する。
  const [message, setMessage] = useState('')
  const isAdmin = role === 'admin'
  const menuItems = getHomeMenuItems(role)

  const openUsers = () => {
    setMessage('ユーザー管理画面は今回のモック対象外です。')
  }

  const logout = () => {
    onLogout()
    navigate('/login', { replace: true })
  }

  const handleMenu = (id: string) => {
    if (id === 'books') navigate('/mypage')
    if (id === 'users') openUsers()
    if (id === 'logout') logout()
  }

  return (
    <main className="system-menu-page">
      <header className="system-topbar">
        <h1>書籍貸出管理システム</h1>
        <div className="system-topbar-right">
          <UserMenu
            role={role}
            title="メニュー"
            items={menuItems}
            onSelect={(item) => handleMenu(item.id)}
          />
        </div>
      </header>

      <section className={`system-cards ${isAdmin ? '' : 'single-card'}`} aria-label="管理メニュー">
        <article className="system-card">
          <span className="system-card-icon"><BookIcon size={72} /></span>
          <h2>書籍管理</h2>
          <p>
            {role === 'admin' && '書籍の検索・登録・編集ができます'}
            {role === 'operator' && '書籍の検索・貸出状況の確認ができます'}
            {role === 'general' && '書籍の検索・予約状況の確認ができます'}
          </p>
          <button type="button" className="button button-primary" onClick={() => navigate('/mypage')}>
            開く
          </button>
        </article>

        {isAdmin && (
          <article className="system-card">
            <span className="system-card-icon"><UsersIcon size={74} /></span>
            <h2>ユーザー管理</h2>
            <p>ユーザーの登録・編集ができます</p>
            <button type="button" className="button button-primary" onClick={openUsers}>
              開く
            </button>
          </article>
        )}
      </section>

      <button type="button" className="system-logout" onClick={logout}>
        ログアウト
      </button>

      <Toast open={Boolean(message)} message={message} severity="info" onClose={() => setMessage('')} />
    </main>
  )
}

export default Home
