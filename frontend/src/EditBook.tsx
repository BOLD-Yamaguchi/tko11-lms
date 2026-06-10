import { useParams } from 'react-router-dom'
import BookForm from './BookForm'
import type { Book, CatalogBook, UserRole } from './types'

type EditBookProps = {
  books: CatalogBook[]
  onUpdate: (book: Book) => void
  role: UserRole
  onLogout: () => void
}

function EditBook({
  books,
  onUpdate,
  role,
  onLogout,
}: EditBookProps) {
  const { bookId } = useParams()
  const book = books.find((candidate) => candidate.id === bookId) ?? books[0]

  if (!book) {
    return null
  }

  return (
    <BookForm
      mode="edit"
      initialValues={book}
      onSubmit={onUpdate}
      role={role}
      onLogout={onLogout}
    />
  )
}

export default EditBook
