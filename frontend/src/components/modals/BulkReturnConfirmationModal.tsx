import type { BorrowingRecord } from '../../types'
import { ModalDialog } from './ModalDialog'

type BulkReturnConfirmationModalProps = {
  open: boolean
  records: BorrowingRecord[]
  onClose: () => void
  onConfirm: () => void
}

export function BulkReturnConfirmationModal({
  open,
  records,
  onClose,
  onConfirm,
}: BulkReturnConfirmationModalProps) {
  return (
    <ModalDialog
      open={open}
      title="一括返却の確認"
      description={`選択した${records.length}件を一括で返却します。`}
      confirmLabel="一括返却する"
      maxWidth="sm"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <div className="bulk-return-confirmation">
        <ul>
          {records.map((record) => (
            <li key={record.employeeNumber}>
              <strong>{record.title}</strong>
              {' '}
              <span>{record.borrower}さん（{record.employeeNumber}）</span>
            </li>
          ))}
        </ul>
        <p>上記の内容で返却登録を実施しますか？</p>
      </div>
    </ModalDialog>
  )
}
