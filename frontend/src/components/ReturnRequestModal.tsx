import { useState } from 'react'
import { ModalDialog } from './ModalDialog'
import { TextBox } from './TextBox'

type ReturnRequestModalProps = {
  open: boolean
  initialComment?: string
  onClose: () => void
  onConfirm: (comment: string) => void
}

export function ReturnRequestModal({
  open,
  initialComment = '',
  onClose,
  onConfirm,
}: ReturnRequestModalProps) {
  const [comment, setComment] = useState(initialComment)

  return (
    <ModalDialog
      open={open}
      title="返却申請"
      confirmLabel="確定"
      maxWidth="sm"
      onClose={onClose}
      onConfirm={() => onConfirm(comment.trim())}
    >
      <div className="return-request-form">
        <p>書籍の返却を申請します。感想を入力してください（任意）。</p>
        <TextBox
          label="感想（任意）"
          value={comment}
          onChange={setComment}
          placeholder="この本の感想をご自由にご入力ください。"
          multiline
          minRows={5}
        />
      </div>
    </ModalDialog>
  )
}
