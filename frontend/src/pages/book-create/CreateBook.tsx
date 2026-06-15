import BookForm from '../book-form/BookForm'
import { useLibraryDataValue } from '../../data/libraryQueries'
import type { Book, UserRole } from '../../types'

type CreateBookProps = {
  onCreate: (book: Book) => void
  role: UserRole
  onLogout: () => void
}

function CreateBook({ onCreate, role, onLogout }: CreateBookProps) {
  // 新規登録フォームの初期値を共通の書籍管理データから取得する。
  const data = useLibraryDataValue()

  return (
    <BookForm
      mode="create"
      initialValues={data.emptyBook}
      onSubmit={onCreate}
      role={role}
      onLogout={onLogout}
    />
  )
}

export default CreateBook
