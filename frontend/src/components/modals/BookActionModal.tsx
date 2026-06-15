import { useState } from 'react'
import { createBookActionSchema } from '../../schemas/bookActionSchema'
import { ModalDialog } from './ModalDialog'
import { TextBox } from '../TextBox'

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
  // 貸出・返却操作に必要な認証入力とZod検証エラーをモーダル内で管理する。
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const confirm = () => {
    const result = createBookActionSchema(
      requireEmployeeId,
      requirePassword,
    ).safeParse({ employeeId, password })

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? '入力内容を確認してください。')
      return
    }

    setError('')
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
