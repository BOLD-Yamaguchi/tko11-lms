import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './HomePage'
import Login from './Login'
import PasswordReset from './passwordReset'
import UserEdit from './UserEdit'
import UserManagement from './UserManagement'
import UserList from './UsersList'
import CreateBook from './pages/book-create/CreateBook'
import BookDetail from './pages/book-detail/BookDetail'
import EditBook from './pages/book-edit/EditBook'
import BookSearch from './pages/book-search/BookSearch'
import Home from './pages/home/Home'
import LoginPage from './pages/login/LoginPage'
import MyPage from './pages/my-page/MyPage'
import type { Book, LoanStatus, UserRole } from './types'

type AppRouterProps = {
  role: UserRole | null
  onLogin: (role: UserRole) => void
  onLogout: () => void
  onCreateBook: (book: Book) => void
  onUpdateBook: (book: Book) => void
  onLoanStatusChange: (bookId: string, status: LoanStatus) => void
  onHistoryVisibilityChange: (bookId: string, visibleIds: string[]) => void
  onReturnCommentChange: (bookId: string, comment: string) => void
}

function AppRouter({
  role,
  onLogin,
  onLogout,
  onCreateBook,
  onUpdateBook,
  onLoanStatusChange,
  onHistoryVisibilityChange,
  onReturnCommentChange,
}: AppRouterProps) {
  return (
    <BrowserRouter>
      <Routes>
        {/* チーム2の既存ルート */}
        <Route
          path="/login"
          element={role ? <Navigate to="/system" replace /> : <LoginPage onLogin={onLogin} />}
        />
        <Route
          path="/system"
          element={role ? <Home role={role} onLogout={onLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/mypage"
          element={
            role
              ? <MyPage role={role} onLogout={onLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/search"
          element={
            role
              ? <BookSearch role={role} onLogout={onLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/create"
          element={
            role === 'admin'
              ? <CreateBook onCreate={onCreateBook} role={role} onLogout={onLogout} />
              : <Navigate to={role ? '/mypage' : '/login'} replace />
          }
        />
        <Route
          path="/books/:bookId"
          element={
            role
              ? (
                <BookDetail
                  role={role}
                  onStatusChange={onLoanStatusChange}
                  onHistoryVisibilityChange={onHistoryVisibilityChange}
                  onReturnCommentChange={onReturnCommentChange}
                  onLogout={onLogout}
                />
              )
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/books/:bookId/edit"
          element={
            role === 'admin'
              ? (
                <EditBook
                  onUpdate={onUpdateBook}
                  role={role}
                  onLogout={onLogout}
                />
              )
              : <Navigate to={role ? '/mypage' : '/login'} replace />
          }
        />
        <Route path="/books" element={<Navigate to={role ? '/mypage' : '/login'} replace />} />
        <Route path="/delete" element={<Navigate to={role ? '/system' : '/login'} replace />} />

        {/* ユーザー管理 / 現在のマシンのメインルート */}
        <Route path="/" element={<Login role={role} onLogin={onLogin} onLogout={onLogout} />} />
        <Route path="/user-login" element={<Navigate to="/" replace />} />
        
        <Route path="/home" element={<HomePage role={role} onLogout={onLogout} />} />
        <Route path="/UsersList" element={<UserList />} />
        <Route path="/users/:id" element={<UserEdit />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/passwordReset" element={<PasswordReset />} />

        {/* いずれにも一致しない場合はホーム（または仕様に応じてルート）へ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter