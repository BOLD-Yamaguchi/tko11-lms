import type { ReactNode } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import {
  containedActionButtonSx,
  dangerContainedActionButtonSx,
  outlinedActionButtonSx,
} from './buttonStyles'

export interface ModalDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'default' | 'danger'
  onClose: () => void
  onConfirm?: () => void
  children?: ReactNode
}

export function ModalDialog({
  open,
  title,
  description,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  tone = 'default',
  onClose,
  onConfirm,
  children,
}: ModalDialogProps) {
  const confirmSx =
    tone === 'danger' ? dangerContainedActionButtonSx : containedActionButtonSx

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xs'
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface-strong)',
            backgroundImage: 'none',
            boxShadow: 'var(--shadow)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: description || children ? 1.5 : 2,
          color: 'var(--text-h)',
          fontFamily: 'var(--heading)',
          fontWeight: 600,
        }}
      >
        {title}
      </DialogTitle>
      {(description || children) && (
        <DialogContent sx={{ pt: 0 }}>
          {description && (
            <DialogContentText sx={{ color: 'var(--text)' }}>
              {description}
            </DialogContentText>
          )}
          {children}
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'flex-end' }}>
        <Button variant='outlined' onClick={onClose} sx={outlinedActionButtonSx}>
          {cancelLabel}
        </Button>
        <Button
          variant='contained'
          onClick={onConfirm}
          autoFocus
          sx={confirmSx}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
