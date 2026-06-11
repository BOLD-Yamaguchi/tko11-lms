import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BookDetail from './BookDetail'
import BookSearch from './BookSearch'
import CreateBook from './CreateBook'
import EditBook from './EditBook'
import Home from './Home'
import LoginPage from './LoginPage'
import MyPage from './MyPage'
import { initialBooks, loanHistory } from './mockData'
import type { Book, CatalogBook, LoanStatus, UserRole } from './types'

const roleStorageKey = 'tko11-mock-user-role'

function readStoredRole(): UserRole | null {
  const stored = sessionStorage.getItem(roleStorageKey)
  return stored === 'general' || stored === 'operator' || stored === 'admin'
    ? stored
    : null
}

function App() {
  const [role, setRole] = useState<UserRole | null>(readStoredRole)
  const [books, setBooks] = useState<CatalogBook[]>(initialBooks)
  const [historyVisibility, setHistoryVisibility] = useState<Record<string, string[]>>(
    () => Object.fromEntries(
      initialBooks.map((book) => [book.id, loanHistory.map((history) => history.id)]),
    ),
  )
  const [returnComments, setReturnComments] = useState<Record<string, string>>({
    B0003: '図が多く、理解しやすかったです。',
    B0006: '具体例が豊富で、業務にも活用できそうです。',
    B0009: '画面構成の説明が分かりやすかったです。',
    B0011: '',
  })

  const login = (nextRole: UserRole) => {
    sessionStorage.setItem(roleStorageKey, nextRole)
    setRole(nextRole)
  }

  const logout = () => {
    sessionStorage.removeItem(roleStorageKey)
    setRole(null)
  }

  const createBook = (newBook: Book) => {
    setBooks((current) => [
      ...current.filter((book) => book.id !== newBook.id),
      { ...newBook, loanStatus: '貸出可' },
    ])
    setHistoryVisibility((current) => ({
      ...current,
      [newBook.id]: loanHistory.map((history) => history.id),
    }))
  }

  const updateBook = (updatedBook: Book) => {
    setBooks((current) => current.map((book) => (
      book.id === updatedBook.id
        ? { ...updatedBook, loanStatus: book.loanStatus }
        : book
    )))
  }

  const updateLoanStatus = (bookId: string, loanStatus: LoanStatus) => {
    setBooks((current) => current.map((book) => (
      book.id === bookId ? { ...book, loanStatus } : book
    )))
  }

  const updateHistoryVisibility = (bookId: string, visibleIds: string[]) => {
    setHistoryVisibility((current) => ({ ...current, [bookId]: visibleIds }))
  }

  const updateReturnComment = (bookId: string, comment: string) => {
    setReturnComments((current) => ({ ...current, [bookId]: comment }))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={role ? <Navigate to="/" replace /> : <LoginPage onLogin={login} />}
        />
        <Route
          path="/"
          element={role ? <Home role={role} onLogout={logout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/mypage"
          element={
            role
              ? <MyPage books={books} role={role} onLogout={logout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/search"
          element={
            role
              ? <BookSearch books={books} role={role} onLogout={logout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/create"
          element={
            role === 'admin'
              ? <CreateBook onCreate={createBook} role={role} onLogout={logout} />
              : <Navigate to={role ? '/mypage' : '/login'} replace />
          }
        />
        <Route
          path="/books/:bookId"
          element={
            role
              ? (
                <BookDetail
                  books={books}
                  role={role}
                  onStatusChange={updateLoanStatus}
                  historyVisibility={historyVisibility}
                  onHistoryVisibilityChange={updateHistoryVisibility}
                  returnComments={returnComments}
                  onReturnCommentChange={updateReturnComment}
                  onLogout={logout}
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
                  books={books}
                  onUpdate={updateBook}
                  role={role}
                  onLogout={logout}
                />
              )
              : <Navigate to={role ? '/mypage' : '/login'} replace />
          }
        />
        <Route path="/delete" element={<Navigate to={role ? '/' : '/login'} replace />} />
        <Route path="*" element={<Navigate to={role ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
