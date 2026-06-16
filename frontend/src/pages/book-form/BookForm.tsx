import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BackButton,
  ModalDialog,
  RegisterButton,
  Toast,
} from '../../components'
import { useLibraryDataValue } from '../../data/libraryQueries'
import { bookSchema } from '../../schemas/bookSchema'
import type { BookValidationErrors } from '../../schemas/bookSchema'
import { parseBookCsv } from './bookCsvParser'
import type { BookCsvError } from './bookCsvParser'
import type {
  Book,
  CollectionStatus,
  UserRole,
} from '../../types'

type BookFormProps = {
  mode: 'create' | 'edit'
  initialValues: Book
  onSubmit: (book: Book) => void
  onCsvSubmit?: (books: Book[]) => void
  role: UserRole
  allowDisposal?: boolean
  onLogout: () => void
}

function BookForm({
  mode,
  initialValues,
  onSubmit,
  onCsvSubmit,
  allowDisposal = false,
}: BookFormProps) {
  // 入力内容、検証結果、CSV選択、破棄確認の各フォーム状態を管理する。
  const [form, setForm] = useState<Book>(initialValues)
  const [csvMessage, setCsvMessage] = useState('')
  const [csvErrors, setCsvErrors] = useState<BookCsvError[]>([])
  const [pendingCsvBooks, setPendingCsvBooks] = useState<Book[]>([])
  const [isParsingCsv, setIsParsingCsv] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState<BookValidationErrors>({})
  const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  // カテゴリと拠点の選択肢を、書籍管理データの共通クエリから取得する。
  const data = useLibraryDataValue()
  const isEdit = mode === 'edit'
  const getMinorCategoryOptions = (majorCategory: string) => (
    majorCategory
      ? data.categoryOptions.minorByMajor?.[majorCategory] ?? data.categoryOptions.minor
      : data.categoryOptions.minor
  )
  const minorCategoryOptions = getMinorCategoryOptions(form.majorCategory)

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    if (name === 'majorCategory') {
      const nextMinorOptions = getMinorCategoryOptions(value)
      setForm((current) => ({
        ...current,
        majorCategory: value,
        minorCategory: nextMinorOptions.includes(current.minorCategory)
          ? current.minorCategory
          : '',
      }))
    } else {
      setForm((current) => ({ ...current, [name]: value }))
    }
    setValidationErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = bookSchema.safeParse(form)

    if (!result.success) {
      const errors: BookValidationErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof Book
        errors[field] ??= issue.message
      })
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    onSubmit(result.data)
    navigate(`/books/${result.data.id}`, {
      state: { message: isEdit ? '書籍情報を更新しました。' : '書籍を登録しました。' },
    })
  }

  const handleCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsParsingCsv(true)
    setCsvMessage(`${file.name} を解析しています。`)
    setCsvErrors([])
    setPendingCsvBooks([])

    try {
      const result = await parseBookCsv(
        file,
        data.books.map((book) => book.id),
        data.categoryOptions.minor,
      )
      setCsvErrors(result.errors)

      if (result.errors.length > 0) {
        setCsvMessage(
          `${file.name}に${result.errors.length}件のエラーがあります。登録は実施していません。`,
        )
      } else {
        setCsvMessage(`${file.name}から${result.books.length}件を読み込みました。`)
        setPendingCsvBooks(result.books)
      }
    } catch {
      setCsvMessage(`${file.name}の読み込みに失敗しました。`)
      setCsvErrors([{
        rowNumber: 1,
        message: 'UTF-8形式のCSVファイルか確認してください。',
      }])
    } finally {
      setIsParsingCsv(false)
      event.target.value = ''
    }
  }

  const registerCsvBooks = () => {
    if (pendingCsvBooks.length === 0) return

    const registeredCount = pendingCsvBooks.length
    onCsvSubmit?.(pendingCsvBooks)
    setPendingCsvBooks([])
    setCsvErrors([])
    setCsvMessage(`${registeredCount}件の書籍を登録しました。`)
    setToastMessage(`${registeredCount}件の書籍を登録しました。`)
  }

  return (
    <main className="page-shell form-page">
      <header className="page-header form-header">
        <BackButton label="戻る" onClick={() => navigate(-1)} />
        <h1>{isEdit ? '書籍編集' : '書籍登録'}</h1>
        <span className="header-spacer" />
      </header>

      <form className="book-form" onSubmit={handleSubmit} noValidate>
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
          />
          {validationErrors.title && <p className="field-error">{validationErrors.title}</p>}
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
          />
          {validationErrors.author && <p className="field-error">{validationErrors.author}</p>}
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
          />
          {validationErrors.publisher && <p className="field-error">{validationErrors.publisher}</p>}
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
            {data.categoryOptions.major.map((category) => (
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
            {minorCategoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <fieldset className="field field-full radio-field">
          <legend>配架分類</legend>
          <div className="radio-row">
            {([
              '開架',
              '閉架',
              ...(isEdit ? ['廃棄'] : []),
            ] as CollectionStatus[]).map((status) => (
              <label
                key={status}
                className={`radio-option ${status === '廃棄' && !allowDisposal ? 'disabled' : ''}`}
              >
                <input
                  type="radio"
                  name="collectionStatus"
                  value={status}
                  checked={form.collectionStatus === status}
                  onChange={updateField}
                  disabled={status === '廃棄' && !allowDisposal}
                />
                {status}
              </label>
            ))}
          </div>
          {isEdit && !allowDisposal && (
            <p className="field-guidance">「廃棄」は貸出ステータスが「貸出可」の書籍のみ選択できます。</p>
          )}
        </fieldset>

        <fieldset className="field field-full radio-field">
          <legend>拠点</legend>
          <div className="radio-row">
            {data.locations.map((location) => (
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
          />
          {validationErrors.shelfNumber && <p className="field-error">{validationErrors.shelfNumber}</p>}
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
            <button
              type="button"
              className="button button-danger"
              onClick={() => setDiscardConfirmationOpen(true)}
            >
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
                disabled={isParsingCsv}
                onClick={() => fileInputRef.current?.click()}
              >
                {isParsingCsv ? 'CSV解析中...' : 'CSV登録'}
              </button>
            </>
          )}
          <RegisterButton type="submit" label={isEdit ? '更新する' : '登録する'} />
        </div>
        {!isEdit && (
          <p className="csv-guidance field-full">
            UTF-8・ヘッダーなし・12項目のCSVに対応しています。配架分類は開架・閉架のみ登録できます。
          </p>
        )}
        {csvMessage && (
          <div className={`csv-result field-full ${csvErrors.length > 0 ? 'has-errors' : 'success'}`}>
            <p>{csvMessage}</p>
            {csvErrors.length > 0 && (
              <ul>
                {csvErrors.map((error, index) => (
                  <li key={`${error.rowNumber}-${index}`}>
                    {error.rowNumber}行目：{error.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </form>
      <ModalDialog
        open={pendingCsvBooks.length > 0}
        title="CSV一括登録"
        confirmLabel="はい"
        cancelLabel="いいえ"
        onClose={() => setPendingCsvBooks([])}
        onConfirm={registerCsvBooks}
      >
        <p className="csv-confirmation-message">
          {pendingCsvBooks.length}件の書籍を登録します。
          <br />
          よろしいですか？
        </p>
      </ModalDialog>
      <ModalDialog
        open={discardConfirmationOpen}
        title="変更内容の破棄"
        description="変更を破棄して良いですか。"
        confirmLabel="破棄する"
        tone="danger"
        onClose={() => setDiscardConfirmationOpen(false)}
        onConfirm={() => navigate(-1)}
      />
      <Toast
        open={Boolean(toastMessage)}
        message={toastMessage}
        severity="success"
        onClose={() => setToastMessage('')}
      />
    </main>
  )
}

export default BookForm
