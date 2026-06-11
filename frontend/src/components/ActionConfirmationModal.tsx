import { ModalDialog } from './ModalDialog'

type ActionConfirmationModalProps = {
  open: boolean
  title: string
  personLabel: string
  bookTitle: string
  returnDueDate?: string
  prompt: string
  confirmLabel?: string
  onClose: () => void
  onConfirm: () => void
}

export function ActionConfirmationModal({
  open,
  title,
  personLabel,
  bookTitle,
  returnDueDate,
  prompt,
  confirmLabel = '確定',
  onClose,
  onConfirm,
}: ActionConfirmationModalProps) {
  return (
    <ModalDialog
      open={open}
      title={title}
      confirmLabel={confirmLabel}
      maxWidth="sm"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <div className="action-confirmation">
        <dl>
          <div>
            <dt>氏名：</dt>
            <dd>{personLabel}</dd>
          </div>
          <div>
            <dt>書籍名：</dt>
            <dd>{bookTitle}</dd>
          </div>
          {returnDueDate && (
            <div>
              <dt>返却予定日：</dt>
              <dd>{returnDueDate}</dd>
            </div>
          )}
        </dl>
        <p>{prompt}</p>
      </div>
    </ModalDialog>
  )
}
