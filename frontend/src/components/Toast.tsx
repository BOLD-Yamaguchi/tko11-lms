import type { SyntheticEvent } from 'react'

import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import type { SnackbarCloseReason } from '@mui/material/Snackbar'

export type ToastSeverity = 'success' | 'info' | 'warning' | 'error'

export interface ToastProps {
  open: boolean
  message: string
  severity?: ToastSeverity
  autoHideDuration?: number
  onClose: () => void
}

export function Toast({
  open,
  message,
  severity = 'info',
  autoHideDuration = 3600,
  onClose,
}: ToastProps) {
  const handleClose = (
    _event?: Event | SyntheticEvent,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    onClose()
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: 'calc(var(--header-height) + 8px)',
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant='filled'
        sx={{
          width: '100%',
          borderRadius: 3,
          alignItems: 'center',
          boxShadow: 'var(--shadow)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
