import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { UserRole } from './types'
import AppRouter from './AppRouter'
import {
  importBooksFromCsv,
  registerBook,
  updateBookHistoryVisibility,
  updateBookInformation,
} from './api/booksApi'
import { libraryDataQueryKey, useLibraryData } from './data/libraryQueries'
import type {
  Book,
  BookStatusDetail,
  LibraryData,
  LoanStatus,
} from './types'

const roleStorageKey = 'adminKbn'

function readStoredRole(): UserRole | null {
  const stored = Number(sessionStorage.getItem(roleStorageKey))

  switch (stored) {
    case UserRole.General:
    case UserRole.Operator:
    case UserRole.Admin:
      return stored

    default:
      return null
  }
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
    sessionStorage.setItem(roleStorageKey, String(nextRole))
    setRole(nextRole)
  }
  const logout = () => {
    sessionStorage.removeItem(roleStorageKey)
    setRole(null)
  }

  const addBooksToCache = (newBooks: Book[]) => {
    updateLibraryData((current) => ({
      ...current,
      books: [
        ...current.books.filter((book) => (
          !newBooks.some((newBook) => newBook.id === book.id)
        )),
        ...newBooks.map((book) => ({ ...book, loanStatus: '貸出可' as const })),
      ],
      historyVisibility: {
        ...current.historyVisibility,
        ...Object.fromEntries(newBooks.map((book) => [
          book.id,
          current.loanHistory.map((history) => history.id),
        ])),
      },
    }))
  }

  const createBook = (newBook: Book) => {
    void registerBook(newBook)
    addBooksToCache([newBook])
  }

  const createBooks = (newBooks: Book[]) => {
    void importBooksFromCsv(newBooks)
    addBooksToCache(newBooks)
  }

  const updateBook = (updatedBook: Book) => {
    void updateBookInformation(updatedBook.id, updatedBook)
    updateLibraryData((current) => ({
      ...current,
      books: current.books.map((book) => (
        book.id === updatedBook.id
          ? { ...updatedBook, loanStatus: book.loanStatus }
          : book
      )),
    }))
  }

  const updateLoanStatus = (
    bookId: string,
    loanStatus: LoanStatus,
    statusDetail?: BookStatusDetail | null,
  ) => {
    updateLibraryData((current) => ({
      ...current,
      books: current.books.map((book) => (
        book.id === bookId ? { ...book, loanStatus } : book
      )),
      bookStatusDetails: statusDetail === undefined
        ? current.bookStatusDetails
        : statusDetail === null
          ? Object.fromEntries(
            Object.entries(current.bookStatusDetails).filter(([id]) => id !== bookId),
          )
          : {
            ...current.bookStatusDetails,
            [bookId]: statusDetail,
          },
    }))
  }

  const updateHistoryVisibility = (bookId: string, visibleIds: string[]) => {
    void updateBookHistoryVisibility(bookId, visibleIds)
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
      onCreateBooks={createBooks}
      onUpdateBook={updateBook}
      onLoanStatusChange={updateLoanStatus}
      onHistoryVisibilityChange={updateHistoryVisibility}
      onReturnCommentChange={updateReturnComment}
    />
  )
}

export default App