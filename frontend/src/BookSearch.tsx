import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronIcon, SearchIcon } from './Icons'
import {
  BackButton,
  DropdownField,
  TextBox,
  Toast,
  UserMenu,
} from './components'
import type { CatalogBook, LoanStatus, UserRole } from './types'

type BookSearchProps = {
  books: CatalogBook[]
  role: UserRole
  onLogout: () => void
}

type SearchConditions = {
  id: string
  title: string
  author: string
  publisher: string
  loanStatus: string
  majorCategory: string
  minorCategory: string
  collectionStatus: string
}

type SortKey = 'id' | 'title' | 'author' | 'publisher' | 'loanStatus'

const emptyConditions: SearchConditions = {
  id: '',
  title: '',
  author: '',
  publisher: '',
  loanStatus: '',
  majorCategory: '技術書',
  minorCategory: 'プログラミング',
  collectionStatus: '',
}

function BookSearch({ books, role, onLogout }: BookSearchProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<SearchConditions>(emptyConditions)
  const [conditions, setConditions] = useState<SearchConditions>(emptyConditions)
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [ascending, setAscending] = useState(true)
  const [page, setPage] = useState(1)
  const [message, setMessage] = useState('')
  const pageSize = 4
  const menuItems = [
    { id: 'mypage', label: 'マイページ', description: '利用状況を確認する' },
    ...(role === 'admin'
      ? [{ id: 'create', label: '書籍登録', description: '新しい書籍を登録する' }]
      : []),
    { id: 'system', label: 'システムメニュー', description: '最初のメニューへ戻る' },
    { id: 'logout', label: 'ログアウト', description: 'ログイン画面へ戻る' },
  ]

  const results = useMemo(() => {
    const includes = (value: string, query: string) => (
      !query || value.toLowerCase().includes(query.trim().toLowerCase())
    )
    return books
      .filter((book) => (
        includes(book.id, conditions.id)
        && includes(book.title, conditions.title)
        && includes(book.author, conditions.author)
        && includes(book.publisher, conditions.publisher)
        && (!conditions.loanStatus || book.loanStatus === conditions.loanStatus)
        && (!conditions.majorCategory || book.majorCategory === conditions.majorCategory)
        && (!conditions.minorCategory || book.minorCategory === conditions.minorCategory)
        && (!conditions.collectionStatus || book.collectionStatus === conditions.collectionStatus)
      ))
      .toSorted((left, right) => {
        const compared = left[sortKey].localeCompare(right[sortKey], 'ja')
        return ascending ? compared : -compared
      })
  }, [ascending, books, conditions, sortKey])

  const pageCount = Math.max(1, Math.ceil(results.length / pageSize))
  const visibleBooks = results.slice((page - 1) * pageSize, page * pageSize)

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setConditions(form)
    setPage(1)
    setMessage('検索条件を反映しました。')
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setAscending((current) => !current)
    } else {
      setSortKey(key)
      setAscending(true)
    }
  }

  const handleMenu = (id: string) => {
    if (id === 'mypage') navigate('/mypage')
    if (id === 'create') navigate('/create')
    if (id === 'system') navigate('/')
    if (id === 'logout') {
      onLogout()
      navigate('/login', { replace: true })
    }
  }

  return (
    <main className="page-shell search-page">
      <header className="search-header">
        <BackButton label="戻る" onClick={() => navigate('/mypage')} />
        <h1>書籍管理画面</h1>
        <UserMenu
          role={role}
          items={menuItems}
          onSelect={(item) => handleMenu(item.id)}
        />
      </header>

      <form className="search-form" onSubmit={submitSearch}>
        <h2>書籍検索</h2>
        <div className="search-fields">
          <TextBox label="書籍ID" value={form.id} onChange={(value) => setForm({ ...form, id: value })} placeholder="例：B0001" />
          <TextBox label="書籍名" value={form.title} onChange={(value) => setForm({ ...form, title: value })} placeholder="例：AWS入門" />
          <TextBox label="著者名" value={form.author} onChange={(value) => setForm({ ...form, author: value })} placeholder="例：山田太郎" />
          <TextBox label="出版社" value={form.publisher} onChange={(value) => setForm({ ...form, publisher: value })} placeholder="例：技術評論社" />
          <DropdownField label="貸出ステータス" value={form.loanStatus} onChange={(value) => setForm({ ...form, loanStatus: value })} options={loanOptions} />
          <DropdownField label="カテゴリ1" value={form.majorCategory} onChange={(value) => setForm({ ...form, majorCategory: value })} options={majorOptions} />
          <DropdownField label="カテゴリ2" value={form.minorCategory} onChange={(value) => setForm({ ...form, minorCategory: value })} options={minorOptions} />
          <DropdownField label="配架分類" value={form.collectionStatus} onChange={(value) => setForm({ ...form, collectionStatus: value })} options={collectionOptions} />
        </div>
        <div className="search-submit">
          <button type="submit" className="button button-primary"><SearchIcon size={20} />検索する</button>
        </div>
      </form>

      <section className="search-results">
        <div className="results-heading">
          <h2>検索結果一覧 <span>{results.length}件</span></h2>
          <div className="pagination">
            <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>‹</button>
            <span>{page} / {pageCount}ページ</span>
            <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>›</button>
          </div>
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
              {visibleBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td><td>{book.title}</td><td>{book.author}</td><td>{book.publisher}</td>
                  <td>{book.majorCategory}</td><td>{book.minorCategory}</td>
                  <td>{book.collectionStatus === '開架' ? '○' : '×'}</td>
                  <td><StatusBadge status={book.loanStatus} /></td>
                  <td>
                    <button type="button" className="row-detail" aria-label={`${book.title}の詳細`} onClick={() => navigate(`/books/${book.id}`)}>
                      <ChevronIcon size={21} />
                    </button>
                  </td>
                </tr>
              ))}
              {visibleBooks.length === 0 && (
                <tr><td colSpan={9} className="empty-result">該当する書籍はありません。</td></tr>
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

const loanOptions = [
  { value: '', label: '指定なし' },
  { value: '貸出可', label: '貸出可' },
  { value: '貸出中', label: '貸出中' },
  { value: '返却申請中', label: '返却申請中' },
  { value: '予約中', label: '予約中' },
]

const majorOptions = [
  { value: '', label: '全て' },
  { value: '技術書', label: '技術書' },
]

const minorOptions = [
  { value: '', label: '全て' },
  { value: 'プログラミング', label: 'プログラミング' },
]

const collectionOptions = [
  { value: '', label: '全て' },
  { value: '開架', label: '開架' },
  { value: '閉架', label: '閉架' },
]

export default BookSearch
