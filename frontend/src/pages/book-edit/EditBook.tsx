import { useParams } from 'react-router-dom'
import BookForm from '../book-form/BookForm'
import { useLibraryDataValue } from '../../data/libraryQueries'
import type { Book, UserRole } from '../../types'

type EditBookProps = {
  onUpdate: (book: Book) => void
  role: UserRole
  onLogout: () => void
}

function EditBook({
  onUpdate,
  role,
  onLogout,
}: EditBookProps) {
  const { bookId } = useParams()
  const data = useLibraryDataValue()
  const books = data.books
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
      allowDisposal={book.loanStatus === '貸出可'}
      onLogout={onLogout}
    />
  )
}

export default EditBook
