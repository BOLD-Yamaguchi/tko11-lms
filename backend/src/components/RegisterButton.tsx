import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'

import { containedActionButtonSx } from './buttonStyles'

export interface RegisterButtonProps {
  label?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

function RegisterIcon() {
  return (
    <SvgIcon fontSize='small' viewBox='0 0 24 24'>
      <path d='M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m-6 8v-2c0-2.67 4-4 6-4 .68 0 1.43.08 2.19.23A5.95 5.95 0 0 0 17 16c0 1.31.42 2.52 1.13 3.5zM6 12v-2H4V8h2V6h2v2h2v2H8v2z' />
    </SvgIcon>
  )
}

export function RegisterButton({
  label = '登録',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: RegisterButtonProps) {
  return (
    <Button
      type={type}
      variant='contained'
      size='large'
      disableElevation
      endIcon={<RegisterIcon />}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      sx={{
        ...containedActionButtonSx,
        '& .MuiButton-endIcon': {
          marginLeft: 0.75,
        },
      }}
    >
      {label}
    </Button>
  )
}
