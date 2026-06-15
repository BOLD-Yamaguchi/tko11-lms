import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import AppRouter from './AppRouter'
import { libraryDataQueryKey, useLibraryData } from './data/libraryQueries'
import type { Book, LibraryData, LoanStatus, UserRole } from './types'

const roleStorageKey = 'tko11-mock-user-role'

function readStoredRole(): UserRole | null {
  const stored = sessionStorage.getItem(roleStorageKey)
  return stored === 'general' || stored === 'operator' || stored === 'admin'
    ? stored
    : null
}

function App() {
  // ログイン中の権限をセッションから復元し、画面全体の認可に利用する。
  const [role, setRole] = useState<UserRole | null>(readStoredRole)
  // React Queryのキャッシュを画面操作に応じて更新し、各画面へ即時反映する。
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
    <AppRouter
      role={role}
      onLogin={login}
      onLogout={logout}
      onCreateBook={createBook}
      onUpdateBook={updateBook}
      onLoanStatusChange={updateLoanStatus}
      onHistoryVisibilityChange={updateHistoryVisibility}
      onReturnCommentChange={updateReturnComment}
    />
  )
}

export default App
