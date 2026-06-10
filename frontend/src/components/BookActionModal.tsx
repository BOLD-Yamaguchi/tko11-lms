import { useState } from 'react'
import { ModalDialog } from './ModalDialog'
import { TextBox } from './TextBox'

type BookActionModalProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  requireEmployeeId?: boolean
  requirePassword?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function BookActionModal({
  open,
  title,
  description,
  confirmLabel,
  requireEmployeeId = false,
  requirePassword = false,
  onClose,
  onConfirm,
}: BookActionModalProps) {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const confirm = () => {
    if (requireEmployeeId && !employeeId.trim()) {
      setError('社員番号を入力してください。')
      return
    }
    if (requirePassword && !password) {
      setError('パスワードを入力してください。')
      return
    }
    onConfirm()
  }

  return (
    <ModalDialog
      open={open}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      onClose={onClose}
      onConfirm={confirm}
    >
      {(requireEmployeeId || requirePassword) && (
        <div className="book-action-auth-fields">
          {requireEmployeeId && (
            <TextBox
              label="社員番号"
              value={employeeId}
              onChange={setEmployeeId}
              placeholder="例：S0001"
              required
            />
          )}
          {requirePassword && (
            <TextBox
              label="パスワード"
              value={password}
              onChange={setPassword}
              type="password"
              required
            />
          )}
          {error && <p className="modal-input-error">{error}</p>}
        </div>
      )}
    </ModalDialog>
  )
}
