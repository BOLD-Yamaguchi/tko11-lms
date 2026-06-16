import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import HomePage from './HomePage'
import Login from './Login'
import PasswordReset from './passwordReset'
import UserEdit from './UserEdit'
import UserManagement from './UserManagement'
import UserList from './UsersList'
import {
  Footer,
  Header,
  LogoutConfirmationModal,
} from './components'
import type { HamburgerMenuItem } from './components'
import CreateBook from './pages/book-create/CreateBook'
import BookDetail from './pages/book-detail/BookDetail'
import EditBook from './pages/book-edit/EditBook'
import BookSearch from './pages/book-search/BookSearch'
import LoginPage from './pages/login/LoginPage'
import MyPage from './pages/my-page/MyPage'
import { useLibraryDataValue } from './data/libraryQueries'
import type { Book, LoanStatus, UserRole } from './types'

type AppRouterProps = {
  role: UserRole | null
  onLogin: (role: UserRole) => void
  onLogout: () => void
  onCreateBook: (book: Book) => void
  onCreateBooks: (books: Book[]) => void
  onUpdateBook: (book: Book) => void
  onLoanStatusChange: (bookId: string, status: LoanStatus) => void
  onHistoryVisibilityChange: (bookId: string, visibleIds: string[]) => void
  onReturnCommentChange: (bookId: string, comment: string) => void
}

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname, location.search])

  return null
}

type AppFrameProps = {
  role: UserRole
  onLogout: () => void
  children: ReactNode
}

function AppFrame({
  role,
  onLogout,
  children,
}: AppFrameProps) {
  const navigate = useNavigate()
  const data = useLibraryDataValue()
  const currentUser = data.roleProfiles[role]
  const [logoutOpen, setLogoutOpen] = useState(false)
  const menuItems: HamburgerMenuItem[] = [
    { id: 'home', label: 'トップページ', description: 'トップページへ戻る' },
    { id: 'mypage', label: 'マイページ', description: '利用状況を確認する' },
    { id: 'search', label: '書籍検索', description: '蔵書を条件検索する' },
    ...(role === 'admin'
      ? [{ id: 'create', label: '書籍登録', description: '新しい書籍を登録する' }]
      : []),
    { id: 'logout', label: 'ログアウト', description: 'ログイン画面へ戻る' },
  ]

  const handleMenuSelect = (item: HamburgerMenuItem) => {
    if (item.id === 'home') navigate('/home')
    if (item.id === 'mypage') navigate('/mypage')
    if (item.id === 'search') navigate('/search')
    if (item.id === 'create') navigate('/create')
    if (item.id === 'logout') setLogoutOpen(true)
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
        <span className={`logged-in-user header-login-user ${role}`}>
          <span className="logged-in-prefix">ログイン中：</span>
          <strong>{currentUser.name}</strong>
          <span className="logged-in-id">（{currentUser.userId}）</span>
        </span>
      </Header>
      <div className="app-screen-content">
        {children}
      </div>
      <Footer
        title="書籍貸出管理システム"
        description="テスト段階のモック画面です。"
      />
      <LogoutConfirmationModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={logout}
      />
    </div>
  )
}

function AppRouter({
  role,
  onLogin,
  onLogout,
  onCreateBook,
  onCreateBooks,
  onUpdateBook,
  onLoanStatusChange,
  onHistoryVisibilityChange,
  onReturnCommentChange,
}: AppRouterProps) {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/login"
          element={role ? <Navigate to="/mypage" replace /> : <LoginPage onLogin={onLogin} />}
        />
        <Route path="/" element={<Navigate to="/user-login" replace />} />
        <Route
          path="/system"
          element={<Navigate to={role ? '/mypage' : '/login'} replace />}
        />
        <Route
          path="/mypage"
          element={
            role
              ? (
                <AppFrame role={role} onLogout={onLogout}>
                  <MyPage role={role} onLogout={onLogout} />
                </AppFrame>
              )
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/search"
          element={
            role
              ? (
                <AppFrame role={role} onLogout={onLogout}>
                  <BookSearch role={role} onLogout={onLogout} />
                </AppFrame>
              )
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/create"
          element={
            role === 'admin'
              ? (
                <AppFrame role={role} onLogout={onLogout}>
                  <CreateBook
                    onCreate={onCreateBook}
                    onCsvCreate={onCreateBooks}
                    role={role}
                    onLogout={onLogout}
                  />
                </AppFrame>
              )
              : <Navigate to={role ? '/mypage' : '/login'} replace />
          }
        />
        <Route
          path="/books/:bookId"
          element={
            role
              ? (
                <AppFrame role={role} onLogout={onLogout}>
                  <BookDetail
                    role={role}
                    onStatusChange={onLoanStatusChange}
                    onHistoryVisibilityChange={onHistoryVisibilityChange}
                    onReturnCommentChange={onReturnCommentChange}
                    onLogout={onLogout}
                  />
                </AppFrame>
              )
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/books/:bookId/edit"
          element={
            role === 'admin'
              ? (
                <AppFrame role={role} onLogout={onLogout}>
                  <EditBook
                    onUpdate={onUpdateBook}
                    role={role}
                    onLogout={onLogout}
                  />
                </AppFrame>
              )
              : <Navigate to={role ? '/mypage' : '/login'} replace />
          }
        />
        <Route path="/books" element={<Navigate to={role ? '/mypage' : '/login'} replace />} />
        <Route path="/delete" element={<Navigate to={role ? '/mypage' : '/login'} replace />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/user-login" element={<Login />} />
        <Route path="/UsersList" element={<UserList />} />
        <Route path="/users/:id" element={<UserEdit />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/passwordReset" element={<PasswordReset />} />

        <Route path="*" element={<Navigate to="/user-login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
