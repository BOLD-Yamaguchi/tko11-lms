export const baseActionButtonSx = {
  minHeight: 44,
  px: 2.25,
  borderRadius: 999,
  fontFamily: 'var(--sans)',
  fontSize: '0.95rem',
  fontWeight: 600,
  letterSpacing: '0.01em',
  lineHeight: 1.2,
  textTransform: 'none',
  transition:
    'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
  '&:focus-visible, &.Mui-focusVisible': {
    outline: '2px solid var(--accent)',
    outlineOffset: 2,
  },
} as const

export const outlinedActionButtonSx = {
  ...baseActionButtonSx,
  borderWidth: 1,
  color: 'var(--text-h)',
  borderColor: 'var(--border)',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:hover': {
    borderWidth: 1,
    borderColor: 'var(--text-h)',
    backgroundColor: 'var(--social-bg)',
    boxShadow: 'var(--shadow)',
    transform: 'translateY(-1px)',
  },
  '&.Mui-disabled': {
    color: 'var(--text)',
    borderColor: 'var(--border)',
    backgroundColor: 'transparent',
    opacity: 0.56,
  },
} as const

export const containedActionButtonSx = {
  ...baseActionButtonSx,
  color: '#fff',
  backgroundColor: 'var(--accent)',
  boxShadow: 'var(--shadow)',
  '&:hover': {
    backgroundColor: 'var(--accent)',
    boxShadow: 'var(--shadow)',
    filter: 'brightness(1.04)',
    transform: 'translateY(-1px)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.78)',
    backgroundColor: 'var(--text)',
    boxShadow: 'none',
    opacity: 0.5,
  },
} as const

export const dangerOutlinedActionButtonSx = {
  ...baseActionButtonSx,
  borderWidth: 1,
  color: 'var(--danger)',
  borderColor: 'rgba(191, 54, 12, 0.28)',
  backgroundColor: 'var(--danger-bg)',
  boxShadow: 'none',
  '&:hover': {
    borderWidth: 1,
    borderColor: 'var(--danger)',
    backgroundColor: 'rgba(191, 54, 12, 0.14)',
    boxShadow: 'var(--shadow)',
    transform: 'translateY(-1px)',
  },
  '&.Mui-disabled': {
    color: 'var(--text)',
    borderColor: 'var(--border)',
    backgroundColor: 'transparent',
    opacity: 0.56,
  },
} as const

export const dangerContainedActionButtonSx = {
  ...baseActionButtonSx,
  color: '#fff',
  backgroundColor: 'var(--danger)',
  boxShadow: 'var(--shadow)',
  '&:hover': {
    backgroundColor: 'var(--danger)',
    boxShadow: 'var(--shadow)',
    filter: 'brightness(1.04)',
    transform: 'translateY(-1px)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.78)',
    backgroundColor: 'var(--text)',
    boxShadow: 'none',
    opacity: 0.5,
  },
} as const
