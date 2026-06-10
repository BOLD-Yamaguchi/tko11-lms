import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'

import { dangerOutlinedActionButtonSx } from './buttonStyles'

export interface DeleteButtonProps {
  label?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

function DeleteIcon() {
  return (
    <SvgIcon fontSize='small' viewBox='0 0 24 24'>
      <path d='M9 3h6l1 2h5v2H3V5h5zm1 6h2v8h-2zm4 0h2v8h-2zM7 9h2v8H7zm-1 12a2 2 0 0 1-2-2V8h16v11a2 2 0 0 1-2 2z' />
    </SvgIcon>
  )
}

export function DeleteButton({
  label = '削除',
  onClick,
  className = '',
  disabled = false,
}: DeleteButtonProps) {
  return (
    <Button
      type='button'
      variant='outlined'
      size='large'
      startIcon={<DeleteIcon />}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      sx={{
        ...dangerOutlinedActionButtonSx,
        '& .MuiButton-startIcon': {
          marginRight: 0.75,
        },
      }}
    >
      {label}
    </Button>
  )
}
