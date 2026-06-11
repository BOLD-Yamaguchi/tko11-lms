import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'

import { outlinedActionButtonSx } from './buttonStyles'

export interface BackButtonProps {
  label?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

function BackArrowIcon() {
  return (
    <SvgIcon fontSize='small' viewBox='0 0 24 24'>
      <path d='M19 11H7.83l4.88-4.88L11.29 4.7 4 12l7.29 7.3 1.42-1.41L7.83 13H19z' />
    </SvgIcon>
  )
}

export function BackButton({
  label = '戻る',
  onClick,
  className = '',
  disabled = false,
}: BackButtonProps) {
  const handleClick = () => {
    if (disabled) {
      return
    }

    if (onClick) {
      onClick()
      return
    }

    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <Button
      type='button'
      variant='outlined'
      size='large'
      startIcon={<BackArrowIcon />}
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
