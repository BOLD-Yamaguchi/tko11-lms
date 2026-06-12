import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'

import { outlinedActionButtonSx } from './buttonStyles'

export interface UpdateButtonProps {
  label?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

function RefreshIcon() {
  return (
    <SvgIcon fontSize='small' viewBox='0 0 24 24'>
      <path d='M17.65 6.35A7.95 7.95 0 0 0 12 4C7.58 4 4 7.58 4 12s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A6.003 6.003 0 0 1 12 18a6 6 0 1 1 0-12c1.66 0 3.14.69 4.22 1.78L13 11h7V4z' />
    </SvgIcon>
  )
}

export function UpdateButton({
  label = '更新',
  onClick,
  className = '',
  disabled = false,
}: UpdateButtonProps) {
  const handleClick = () => {
    if (disabled) {
      return
    }

    if (onClick) {
      onClick()
      return
    }

    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <Button
      type='button'
      variant='outlined'
      size='large'
      startIcon={<RefreshIcon />}
      className={className}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      sx={{
        ...outlinedActionButtonSx,
        '& .MuiButton-startIcon': {
          marginRight: 0.75,
        },
      }}
    >
      {label}
    </Button>
  )
}
