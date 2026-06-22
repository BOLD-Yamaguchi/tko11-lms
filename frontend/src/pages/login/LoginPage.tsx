import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookIcon, UserIcon, UsersIcon } from '../../Icons'
import { Footer, Header } from '../../components'
import type { HamburgerMenuItem } from '../../components'
import { UserRole } from '../../types'

type LoginPageProps = {
  onLogin: (role: UserRole) => void
}

const roles: Array<{
  role: UserRole
  title: string
  description: string
  icon: ReactNode
}> = [
  {
    role: UserRole.General,
    title: '一般ユーザー',
    description: '個人の貸出・予約状況を確認します',
    icon: <UserIcon size={42} />,
  },
  {
    role: UserRole.Operator,
    title: '貸出ユーザー',
    description: '全ユーザーの貸出状況を確認します',
    icon: <UsersIcon size={44} />,
  },
  {
    role: UserRole.Admin,
    title: '管理者ユーザー',
    description: '書籍登録・更新と返却承認を行います',
    icon: <BookIcon size={44} />,
  },
]

function LoginPage({ onLogin }: LoginPageProps) {
  // テスト段階では権限選択後に直接マイページへ遷移する。
  const navigate = useNavigate()
  const menuItems: HamburgerMenuItem[] = [
    {
      id: 'home',
      label: 'トップページ',
      description: 'トップページへ戻る',
    },
  ]

  const login = (role: UserRole) => {
    onLogin(role)
    navigate('/mypage', { replace: true })
  }

  const handleMenuSelect = (item: HamburgerMenuItem) => {
    if (item.id === 'home') navigate('/home')
  }

  return (
    <div className="mock-screen-layout">
      <Header
        title="書籍貸出管理システム"
        eyebrow="BOOK MANAGEMENT SYSTEM"
        menuItems={menuItems}
        onMenuSelect={handleMenuSelect}
      />
      <main className="login-page">
        <section className="login-panel">
          <p className="eyebrow">LIBRARY MANAGEMENT MOCK</p>
          <h1>モックログイン</h1>
          <p className="login-guidance">
            ログイン済みユーザーの権限を選択してください。選択した権限はログアウトまで固定されます。
          </p>
          <div className="login-role-grid">
            {roles.map((item) => (
              <button
                key={item.role}
                type="button"
                className={`login-role-card ${item.role}`}
                onClick={() => login(item.role)}
              >
                <span>{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
                <b>この権限でログイン</b>
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer
        title="書籍貸出管理システム"
        description="テスト段階のモック画面です。"
      />
    </div>
  )
}

export default LoginPage
