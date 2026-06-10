import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackButton, RegisterButton, UserMenu } from './components'
import type {
  Book,
  CollectionStatus,
  LibraryLocation,
  UserRole,
} from './types'

type BookFormProps = {
  mode: 'create' | 'edit'
  initialValues: Book
  onSubmit: (book: Book) => void
  role: UserRole
  onLogout: () => void
}

const majorCategories = ['技術書', '文学', 'ビジネス', '資格・試験']
const minorCategories = ['クラウド', 'プログラミング', 'ネットワーク', 'データベース']

function BookForm({
  mode,
  initialValues,
  onSubmit,
  role,
  onLogout,
}: BookFormProps) {
  const [form, setForm] = useState<Book>(initialValues)
  const [csvName, setCsvName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const menuItems = [
    { id: 'mypage', label: 'マイページ', description: '利用状況を確認する' },
    { id: 'search', label: '書籍検索', description: '蔵書を条件検索する' },
    ...(!isEdit
      ? []
      : [{ id: 'create', label: '書籍登録', description: '新しい書籍を登録する' }]),
    { id: 'system', label: 'システムメニュー', description: '最初のメニューへ戻る' },
    { id: 'logout', label: 'ログアウト', description: 'ログイン画面へ戻る' },
  ]

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(form)
    navigate(`/books/${form.id}`, {
      state: { message: isEdit ? '書籍情報を更新しました。' : '書籍を登録しました。' },
    })
  }

  const handleCsv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setCsvName(`${file.name} を選択しました`)
  }

  const handleMenu = (id: string) => {
    if (id === 'mypage') navigate('/mypage')
    if (id === 'search') navigate('/search')
    if (id === 'create') navigate('/create')
    if (id === 'system') navigate('/')
    if (id === 'logout') {
      onLogout()
      navigate('/login', { replace: true })
    }
  }

  return (
    <main className="page-shell form-page">
      <header className="page-header form-header">
        <BackButton label="戻る" onClick={() => navigate(-1)} />
        <h1>{isEdit ? '書籍編集画面' : '書籍登録画面'}</h1>
        <UserMenu
          role={role}
          items={menuItems}
          onSelect={(item) => handleMenu(item.id)}
        />
      </header>

      <form className="book-form" onSubmit={handleSubmit}>
        <div className="field field-full">
          <label htmlFor="title">
            書籍名 <span className="required">*</span>
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="例：AWS入門"
            required
          />
        </div>

        <div className="field field-full">
          <label htmlFor="isbn">ISBN</label>
          <input
            id="isbn"
            name="isbn"
            value={form.isbn}
            onChange={updateField}
            placeholder="例：978-4-123456-78-9"
          />
        </div>

        <div className="field field-full">
          <label htmlFor="author">
            著者名 <span className="required">*</span>
          </label>
          <input
            id="author"
            name="author"
            value={form.author}
            onChange={updateField}
            placeholder="例：山田太郎"
            required
          />
        </div>

        <div className="field field-full">
          <label htmlFor="publisher">
            出版社 <span className="required">*</span>
          </label>
          <input
            id="publisher"
            name="publisher"
            value={form.publisher}
            onChange={updateField}
            placeholder="例：技術評論社"
            required
          />
        </div>

        <div className="field field-full">
          <label htmlFor="publishedAt">出版日</label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="date"
            value={form.publishedAt}
            onChange={updateField}
          />
        </div>

        <div className="field">
          <label htmlFor="majorCategory">大分類</label>
          <select
            id="majorCategory"
            name="majorCategory"
            value={form.majorCategory}
            onChange={updateField}
          >
            <option value="">選択してください</option>
            {majorCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="minorCategory">中分類</label>
          <select
            id="minorCategory"
            name="minorCategory"
            value={form.minorCategory}
            onChange={updateField}
          >
            <option value="">選択してください</option>
            {minorCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <fieldset className="field field-full radio-field">
          <legend>配架分類</legend>
          <div className="radio-row">
            {(['開架', '閉架', ...(isEdit ? ['廃棄'] : [])] as CollectionStatus[]).map((status) => (
              <label key={status} className="radio-option">
                <input
                  type="radio"
                  name="collectionStatus"
                  value={status}
                  checked={form.collectionStatus === status}
                  onChange={updateField}
                />
                {status}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field field-full radio-field">
          <legend>拠点</legend>
          <div className="radio-row">
            {(['東京', '大阪'] as LibraryLocation[]).map((location) => (
              <label key={location} className="radio-option">
                <input
                  type="radio"
                  name="location"
                  value={location}
                  checked={form.location === location}
                  onChange={updateField}
                />
                {location}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="shelfNumber">
            棚番号 <span className="required">*</span>
          </label>
          <input
            id="shelfNumber"
            name="shelfNumber"
            value={form.shelfNumber}
            onChange={updateField}
            placeholder="例：3"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="tierNumber">段番号</label>
          <input
            id="tierNumber"
            name="tierNumber"
            value={form.tierNumber}
            onChange={updateField}
            placeholder="例：2"
          />
        </div>

        <div className="field field-full">
          <label htmlFor="notes">備考</label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={updateField}
            rows={3}
          />
        </div>

        <div className="form-footer field-full">
          {isEdit ? (
            <button type="button" className="button button-danger" onClick={() => navigate(-1)}>
              キャンセル
            </button>
          ) : (
            <>
              <input
                ref={fileInputRef}
                className="visually-hidden"
                type="file"
                accept=".csv,text/csv"
                onChange={handleCsv}
              />
              <button
                type="button"
                className="button button-csv"
                onClick={() => fileInputRef.current?.click()}
              >
                CSV登録
              </button>
            </>
          )}
          <RegisterButton type="submit" label={isEdit ? '更新する' : '登録する'} />
        </div>
        {csvName && <p className="csv-message field-full">{csvName}</p>}
      </form>
    </main>
  )
}

export default BookForm
