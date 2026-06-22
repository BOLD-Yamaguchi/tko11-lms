import { ModalDialog } from './ModalDialog'

type LogoutConfirmationModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutConfirmationModal({
  open,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  return (
    <ModalDialog
      open={open}
      title="ログアウト確認"
      description="ログアウトします。よろしいですか？"
      confirmLabel="ログアウト"
      cancelLabel="キャンセル"
      tone="danger"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
