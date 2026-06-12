import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookIcon, UserIcon, UsersIcon } from '../../Icons'
import type { UserRole } from '../../types'

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
    role: 'general',
    title: '一般ユーザー',
    description: '個人の貸出・予約状況を確認します',
    icon: <UserIcon size={42} />,
  },
  {
    role: 'operator',
    title: '貸出ユーザー',
    description: '全ユーザーの貸出状況を確認します',
    icon: <UsersIcon size={44} />,
  },
  {
    role: 'admin',
    title: '管理者ユーザー',
    description: '書籍登録・更新と返却承認を行います',
    icon: <BookIcon size={44} />,
  },
]

function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate()

  const login = (role: UserRole) => {
    onLogin(role)
    navigate('/', { replace: true })
  }

  return (
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
  )
}

export default LoginPage
