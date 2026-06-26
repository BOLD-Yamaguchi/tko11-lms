import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
  UserRole,
} from './types'

const roleStorageKey = 'tko11-mock-user-role'

function readStoredRole(): UserRole | null {
  const stored = sessionStorage.getItem(roleStorageKey)
  return stored === 'general' || stored === 'operator' || stored === 'admin'
    ? stored as unknown as UserRole
    : null
}

function App() {
  const [role, setRole] = useState<UserRole | null>(readStoredRole())
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

  // 新規書籍登録
const createBook = async (newBook: Book) => {
  const bookToSend = {
    ...newBook,
    id: String(newBook.id)
  }

  // ⭕ 修正: await の後ろ、または結果に対して `as any` をつけて型を柔軟にします
  const savedMstBook = (await registerBook(bookToSend)) as any

  const savedBook: Book = {
    ...newBook,
    // ⭕ これで savedMstBook.bookId がエラーなく読み取れるようになります！
    id: savedMstBook && savedMstBook.bookId ? String(savedMstBook.bookId) : String(newBook.id)
  }

  addBooksToCache([savedBook])

  return savedMstBook
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