import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronIcon, SearchIcon } from '../../Icons'
import {
  BackButton,
  DropdownField,
  TextBox,
  Toast,
} from '../../components'
import { searchBooks } from '../../api/booksApi'
import {
  ADMIN_COLLECTION_STATUS_OPTION,
  COLLECTION_STATUS_OPTIONS,
  LOAN_STATUS_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from '../../constants/bookSearch'
import { useLibraryDataValue } from '../../data/libraryQueries'
import type {
  LoanStatus,
  UserRole,
} from '../../types'
import {
  initialBookSearchState,
} from './searchState'
import type {
  BookSearchSortKey,
  BookSearchState,
  SearchConditions,
} from './searchState'

type BookSearchProps = {
  role: UserRole
  onLogout: () => void
}

type SearchLocationState = {
  searchState?: BookSearchState
}

function BookSearch({ role }: BookSearchProps) {
  const navigate = useNavigate()
  // 詳細画面から戻った場合、遷移時に渡した検索条件・並び順・ページを復元する。
  const location = useLocation()
  const restoredState = (
    location.state as SearchLocationState | null
  )?.searchState ?? initialBookSearchState
  // 書籍・カテゴリ・ログインユーザーの拠点情報を共通クエリから取得する。
  const data = useLibraryDataValue()
  const userLocation = data.roleProfiles[role].location
  // 入力中と適用済みの検索条件を分け、検索・ソート・ページング状態を管理する。
  const [form, setForm] = useState<SearchConditions>(restoredState.form)
  const [conditions, setConditions] = useState<SearchConditions>(restoredState.conditions)
  const [hasSearched, setHasSearched] = useState(restoredState.hasSearched)
  const [sortKey, setSortKey] = useState<BookSearchSortKey>(restoredState.sortKey)
  const [ascending, setAscending] = useState(restoredState.ascending)
  const [page, setPage] = useState(restoredState.page)
  const [pageSize, setPageSize] = useState(restoredState.pageSize)
  const [message, setMessage] = useState('')
  const collectionOptions = [
    ...COLLECTION_STATUS_OPTIONS,
    ...(role === 'admin' ? [ADMIN_COLLECTION_STATUS_OPTION] : []),
  ]
  const getMinorCategoryOptions = (majorCategory: string) => (
    majorCategory
      ? data.categoryOptions.minorByMajor?.[majorCategory] ?? data.categoryOptions.minor
      : data.categoryOptions.minor
  )
  const minorCategoryOptions = getMinorCategoryOptions(form.majorCategory)

  const updateMajorCategory = (value: string) => {
    const nextMinorOptions = getMinorCategoryOptions(value)
    setForm((current) => ({
      ...current,
      majorCategory: value,
      minorCategory: nextMinorOptions.includes(current.minorCategory)
        ? current.minorCategory
        : '',
    }))
  }

  // 入力された全条件をAND検索し、現在の並び順に合わせた結果を生成する。
  const results = useMemo(() => {
    if (!hasSearched) return []

    const exact = (value: string, query: string) => (
      !query.trim()
      || value.toLowerCase() === query.trim().toLowerCase()
    )
    const includes = (value: string, query: string) => (
      !query.trim()
      || value.toLowerCase().includes(query.trim().toLowerCase())
    )
    return data.books
      .filter((book) => {
        const isDisposed = book.collectionStatus === '廃棄'

        return (
          book.location === userLocation
          && (role === 'admin' || !isDisposed)
          && exact(book.id, conditions.id)
          && includes(book.title, conditions.title)
          && includes(book.author, conditions.author)
          && includes(book.publisher, conditions.publisher)
          && (!conditions.publishedFrom || book.publishedAt >= conditions.publishedFrom)
          && (!conditions.publishedTo || book.publishedAt <= conditions.publishedTo)
          && (!conditions.loanStatus || (!isDisposed && book.loanStatus === conditions.loanStatus))
          && (!conditions.majorCategory || book.majorCategory === conditions.majorCategory)
          && (!conditions.minorCategory || book.minorCategory === conditions.minorCategory)
          && (!conditions.collectionStatus || book.collectionStatus === conditions.collectionStatus)
        )
      })
      .toSorted((left, right) => {
        const compared = left[sortKey].localeCompare(right[sortKey], 'ja')
        return ascending ? compared : -compared
      })
  }, [ascending, conditions, data.books, hasSearched, role, sortKey, userLocation])

  const pageCount = Math.max(1, Math.ceil(results.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleBooks = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void searchBooks(form.id.trim() || 'all', form)
    setConditions(form)
    setHasSearched(true)
    setPage(1)
    setMessage('検索を実行しました。')
  }

  const toggleSort = (key: BookSearchSortKey) => {
    if (sortKey === key) {
      setAscending((current) => !current)
    } else {
      setSortKey(key)
      setAscending(true)
    }
  }

  return (
    <main className="page-shell search-page">
      <header className="search-header">
        <BackButton label="戻る" onClick={() => navigate('/mypage')} />
        <h1>書籍検索</h1>
        <span className="header-spacer" />
      </header>

      <form className="search-form" onSubmit={submitSearch}>
        <h2>書籍検索</h2>
        <div className="search-fields">
          <TextBox label="書籍ID" value={form.id} onChange={(value) => setForm({ ...form, id: value })} placeholder="B0001" />
          <TextBox label="書籍名" value={form.title} onChange={(value) => setForm({ ...form, title: value })} placeholder="例：AWS入門" />
          <TextBox label="著者名" value={form.author} onChange={(value) => setForm({ ...form, author: value })} placeholder="例：山田太郎" />
          <TextBox label="出版社" value={form.publisher} onChange={(value) => setForm({ ...form, publisher: value })} placeholder="例：技術評論社" />
          <TextBox label="出版日（開始）" type="date" value={form.publishedFrom} onChange={(value) => setForm({ ...form, publishedFrom: value })} />
          <TextBox label="出版日（終了）" type="date" value={form.publishedTo} onChange={(value) => setForm({ ...form, publishedTo: value })} />
          <DropdownField
            label="カテゴリ1"
            value={form.majorCategory}
            onChange={updateMajorCategory}
            options={[
              { value: '', label: '全て' },
              ...data.categoryOptions.major.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
          />
          <DropdownField
            label="カテゴリ2"
            value={form.minorCategory}
            onChange={(value) => setForm({ ...form, minorCategory: value })}
            options={[
              { value: '', label: '全て' },
              ...minorCategoryOptions.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
          />
          <DropdownField label="貸出ステータス" value={form.loanStatus} onChange={(value) => setForm({ ...form, loanStatus: value })} options={LOAN_STATUS_OPTIONS} />
          <DropdownField label="配架分類" value={form.collectionStatus} onChange={(value) => setForm({ ...form, collectionStatus: value })} options={collectionOptions} />
        </div>
        <div className="search-submit">
          <button type="submit" className="button button-primary"><SearchIcon size={20} />検索する</button>
        </div>
      </form>

      <section className="search-results">
        <div className="results-heading">
          <h2>
            検索結果一覧
            {hasSearched && <span>{results.length}件</span>}
          </h2>
          {hasSearched && (
            <div className="results-controls">
              <label className="page-size-control">
                <span>1ページあたり</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value))
                    setPage(1)
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>{size}件</option>
                  ))}
                </select>
              </label>
              <div className="pagination">
                <button type="button" disabled={currentPage === 1} onClick={() => setPage((current) => current - 1)}>‹</button>
                <span>{currentPage} / {pageCount}ページ</span>
                <button type="button" disabled={currentPage === pageCount} onClick={() => setPage((current) => current + 1)}>›</button>
              </div>
            </div>
          )}
        </div>
        <div className="table-scroll">
          <table className="data-table search-table">
            <thead>
              <tr>
                <SortableHeader label="書籍ID" active={sortKey === 'id'} ascending={ascending} onClick={() => toggleSort('id')} />
                <SortableHeader label="書籍名" active={sortKey === 'title'} ascending={ascending} onClick={() => toggleSort('title')} />
                <SortableHeader label="著者名" active={sortKey === 'author'} ascending={ascending} onClick={() => toggleSort('author')} />
                <SortableHeader label="出版社" active={sortKey === 'publisher'} ascending={ascending} onClick={() => toggleSort('publisher')} />
                <th>カテゴリ1</th><th>カテゴリ2</th><th>配架分類</th>
                <SortableHeader label="貸出ステータス" active={sortKey === 'loanStatus'} ascending={ascending} onClick={() => toggleSort('loanStatus')} />
                <th>詳細</th>
              </tr>
            </thead>
            <tbody>
              {!hasSearched && (
                <tr>
                  <td colSpan={9} className="empty-result">
                    検索条件を入力し「検索する」を押下してください
                  </td>
                </tr>
              )}
              {hasSearched && visibleBooks.map((book) => (
                <tr
                  key={book.id}
                  title={`配架分類：${book.collectionStatus}`}
                >
                  <td>{book.id}</td><td>{book.title}</td><td>{book.author}</td><td>{book.publisher}</td>
                  <td>{book.majorCategory}</td><td>{book.minorCategory}</td>
                  <td>{book.collectionStatus === '開架' ? '○' : '×'}</td>
                  <td>
                    {book.collectionStatus === '廃棄'
                      ? <span className="loan-badge disposed">廃棄済</span>
                      : <StatusBadge status={book.loanStatus} />}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="row-detail"
                        aria-label={`${book.title}の詳細`}
                        onClick={() => navigate(`/books/${book.id}`, {
                          state: {
                            from: '/search',
                            searchState: {
                              form,
                              conditions,
                              hasSearched,
                              sortKey,
                              ascending,
                              page: currentPage,
                              pageSize,
                            } satisfies BookSearchState,
                          },
                        })}
                    >
                      <ChevronIcon size={21} />
                    </button>
                  </td>
                </tr>
              ))}
              {hasSearched && visibleBooks.length === 0 && (
                <tr><td colSpan={9} className="empty-result">書籍が見つかりませんでした</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Toast open={Boolean(message)} message={message} severity="success" onClose={() => setMessage('')} />
    </main>
  )
}

function SortableHeader({
  label,
  active,
  ascending,
  onClick,
}: {
  label: string
  active: boolean
  ascending: boolean
  onClick: () => void
}) {
  return (
    <th>
      <button type="button" className="sort-button" onClick={onClick}>
        {label}<span>{active ? (ascending ? '▲' : '▼') : '↕'}</span>
      </button>
    </th>
  )
}

function StatusBadge({ status }: { status: LoanStatus }) {
  const className = status === '貸出可'
    ? 'available'
    : status === '貸出中'
      ? 'loaned'
      : status === '予約中'
        ? 'reserved'
        : 'returning'
  return <span className={`loan-badge ${className}`}>{status}</span>
}

export default BookSearch
