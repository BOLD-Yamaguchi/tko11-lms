import BookForm from './BookForm'
import { emptyBook } from './mockData'
import type { Book, UserRole } from './types'

type CreateBookProps = {
  onCreate: (book: Book) => void
  role: UserRole
  onLogout: () => void
}

function CreateBook({ onCreate, role, onLogout }: CreateBookProps) {
  return (
    <BookForm
      mode="create"
      initialValues={emptyBook}
      onSubmit={onCreate}
      role={role}
      onLogout={onLogout}
    />
  )
}

export default CreateBook
