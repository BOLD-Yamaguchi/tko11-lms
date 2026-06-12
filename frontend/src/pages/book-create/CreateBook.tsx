import BookForm from '../book-form/BookForm'
import { useLibraryDataValue } from '../../data/libraryQueries'
import type { Book, UserRole } from '../../types'

type CreateBookProps = {
  onCreate: (book: Book) => void
  role: UserRole
  onLogout: () => void
}

function CreateBook({ onCreate, role, onLogout }: CreateBookProps) {
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
