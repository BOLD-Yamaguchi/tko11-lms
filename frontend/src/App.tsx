import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { libraryDataQueryKey, useLibraryData } from './data/libraryQueries'
import type { Book, LibraryData, LoanStatus, UserRole } from './types'

import UserList from "./UsersList";
import UserEdit from "./UserEdit";
import Login from "./Login";
import PasswordReset from "./passwordReset";

import HomePage from "./HomePage";
import UserManagement from "./UserManagement";

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
    <BrowserRouter>
      <Routes>
        {/* ログイン画面 */}
        {/* エラーを回避するため、Login側の型定義に合わせてPropsの渡し方を調整してください。 */}
        {/* もしLoginコンポーネントがPropsを受け取らない実装であれば、単に element={<Login />} に戻してください。 */}
        <Route 
          path="/" 
          element={
            <Login 
              role={role}
              onLogin={login}
              onLogout={logout}
            />
          } 
        />

        {/* ユーザー管理（main） */}
        <Route path="/UsersList" element={<UserList />} />
        <Route path="/users/create" element={<UserManagement />} />
        <Route path="/passwordReset" element={<PasswordReset />} />

        {/* 書籍管理（feature/oka） */}
        <Route 
          path="/home" 
          element={
            <HomePage 
              role={role}
              onLogout={logout}
            />
          } 
        />
        <Route path="/users/:employeeCode" element={<UserEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App