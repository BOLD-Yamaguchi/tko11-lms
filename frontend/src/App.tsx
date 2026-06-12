import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { libraryDataQueryKey, useLibraryData } from './data/libraryQueries'
import CreateBook from './pages/book-create/CreateBook'
import EditBook from './pages/book-edit/EditBook'
import BookDetail from './pages/book-detail/BookDetail'
import BookSearch from './pages/book-search/BookSearch'
import Home from './pages/home/Home'
import LoginPage from './pages/login/LoginPage'
import MyPage from './pages/my-page/MyPage'
import type { Book, LibraryData, LoanStatus, UserRole } from './types'

const roleStorageKey = 'tko11-mock-user-role'

function readStoredRole(): UserRole | null {
  const stored = sessionStorage.getItem(roleStorageKey)
  return stored === 'general' || stored === 'operator' || stored === 'admin'
    ? stored
    : null
}

function App() {
  const [role, setRole] = useState<UserRole | null>(readStoredRole)
  const queryClient = useQueryClient()
  const { data, isPending, isError } = useLibraryData()

  if (isPending) {
    return <main className="page-shell">データを読み込んでいます。</main>
  }
  if (isError || !data) {
    return <main className="page-shell">データの取得に失敗しました。</main>
  }

  const updateLibraryData = (updater: (current: LibraryData) => LibraryData) => {
    queryClient.setQueryData<LibraryData>(
      libraryDataQueryKey,
      (current) => current ? updater(current) : current,
    )
  }

  const login = (nextRole: UserRole) => {
    sessionStorage.setItem(roleStorageKey, nextRole)
    setRole(nextRole)
  }

  const logout = () => {
    sessionStorage.removeItem(roleStorageKey)
    setRole(null)
  }

  const createBook = (newBook: Book) => {
    updateLibraryData((current) => ({
      ...current,
      books: [
        ...current.books.filter((book) => book.id !== newBook.id),
        { ...newBook, loanStatus: '貸出可' },
      ],
      historyVisibility: {
        ...current.historyVisibility,
        [newBook.id]: current.loanHistory.map((history) => history.id),
      },
    }))
  }

  const updateBook = (updatedBook: Book) => {
    updateLibraryData((current) => ({
      ...current,
      books: current.books.map((book) => (
        book.id === updatedBook.id
          ? { ...updatedBook, loanStatus: book.loanStatus }
          : book
      )),
    }))
  }

  const updateLoanStatus = (bookId: string, loanStatus: LoanStatus) => {
    updateLibraryData((current) => ({
      ...current,
      books: current.books.map((book) => (
        book.id === bookId ? { ...book, loanStatus } : book
      )),
    }))
  }

  const updateHistoryVisibility = (bookId: string, visibleIds: string[]) => {
    updateLibraryData((current) => ({
      ...current,
      historyVisibility: {
        ...current.historyVisibility,
        [bookId]: visibleIds,
      },
    }))
  }

  const updateReturnComment = (bookId: string, comment: string) => {
    updateLibraryData((current) => ({
      ...current,
      returnComments: {
        ...current.returnComments,
        [bookId]: comment,
      },
    }))
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
              ? <MyPage role={role} onLogout={logout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/search"
          element={
            role
              ? <BookSearch role={role} onLogout={logout} />
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
                  role={role}
                  onStatusChange={updateLoanStatus}
                  onHistoryVisibilityChange={updateHistoryVisibility}
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
