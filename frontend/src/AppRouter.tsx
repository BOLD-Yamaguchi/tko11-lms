import { useEffect } from 'react'
import { UserRole } from './types'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import PasswordReset from './passwordReset'
import UserEdit from './UserEdit'
import UserManagement from './UserManagement'
import UserList from './UsersList'
import Login from './pages/login/Login'
import CreateBook from './pages/book-create/CreateBook'
import BookDetail from './pages/book-detail/BookDetail'
import EditBook from './pages/book-edit/EditBook'
import BookSearch from './pages/book-search/BookSearch'
import MyPage from './pages/my-page/MyPage'
import type {
  Book,
  BookStatusDetail,
  LoanStatus,
} from './types'
import ProtectedRoute from "./components/ProtectedRoute";

type AppRouterProps = {
  role: UserRole | null
  onLogin: (role: UserRole) => void
  onLogout: () => void
  onCreateBook: (book: Book) => void
  onCreateBooks: (books: Book[]) => void
  onUpdateBook: (book: Book) => void
  onLoanStatusChange: (
    bookId: string,
    status: LoanStatus,
    statusDetail?: BookStatusDetail | null,
  ) => void
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
    console.log("AppRouter role =", role),
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/user-login" replace />} />
        <Route
          path="/system"
          element={<Navigate to={role ? '/mypage' : '/user-login'} replace />}
        />
        <Route
          path="/mypage" element={<ProtectedRoute role={role} onLogout={onLogout}><MyPage role={role!} onLogout={onLogout} /> </ProtectedRoute>}
        />
        <Route
          path="/search" element={(<ProtectedRoute role={role} onLogout={onLogout}><BookSearch role={role!} onLogout={onLogout} /></ProtectedRoute>)}
        />
        <Route
          path="/create"
          element={
            role === UserRole.Admin
              ? (
                <ProtectedRoute role={role} onLogout={onLogout}>
                  <CreateBook
                    onCreate={onCreateBook}
                    onCsvCreate={onCreateBooks}
                    role={role}
                    onLogout={onLogout}
                  />
                </ProtectedRoute>
              )
              : <Navigate to={role ? '/mypage' : '/user-login'} replace />
          }
        />
        <Route
          path="/books/:bookId"
          element={<ProtectedRoute role={role} onLogout={onLogout}>
                  <BookDetail
                    role={role!}
                    onStatusChange={onLoanStatusChange}
                    onHistoryVisibilityChange={onHistoryVisibilityChange}
                    onReturnCommentChange={onReturnCommentChange}
                    onLogout={onLogout}
                  />
                </ProtectedRoute>
          }
        />
        <Route
          path="/books/:bookId/edit"
          element={
            role === UserRole.Admin
              ? (
                <ProtectedRoute role={role} onLogout={onLogout}>
                  <EditBook
                    onUpdate={onUpdateBook}
                    role={role}
                    onLogout={onLogout}
                  />
                </ProtectedRoute>
              )
              : <Navigate to={role ? '/mypage' : '/user-login'} replace />
          }
        />
        <Route path="/books" element={<Navigate to={role ? '/mypage' : '/user-login'} replace />} />
        <Route path="/delete" element={<Navigate to={role ? '/mypage' : '/user-login'} replace />} />
        <Route path="/delete" element={<Navigate to={role ? '/system' : '/user-login'} replace />} />

        <Route path="/home" element={<ProtectedRoute role={role} onLogout={onLogout}><HomePage /></ProtectedRoute>} />

        {/* ユーザー管理その他ルート */}
        <Route path="/user-login" element={<Login  onLogin={onLogin} />} />
        <Route path="/UsersList" element={<ProtectedRoute role={role} onLogout={onLogout}><UserList /></ProtectedRoute>} />
        <Route path="/users/:employeeCode" element={<ProtectedRoute role={role} onLogout={onLogout}><UserEdit /></ProtectedRoute>} />
        <Route path="/user-create" element={<UserManagement />} />
        <Route path="/passwordReset" element={<PasswordReset />} />

        <Route path="*" element={<Navigate to="/user-login" replace />} />
        {/* いずれにも一致しない場合はルートへ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter