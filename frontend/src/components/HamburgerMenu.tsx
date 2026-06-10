import { useState } from 'react'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'

export interface HamburgerMenuItem {
  id: string
  label: string
  description?: string
}

export interface HamburgerMenuProps {
  label?: string
  title?: string
  subtitle?: string
  items: readonly HamburgerMenuItem[]
  onSelect?: (item: HamburgerMenuItem) => void
}

function MenuIcon() {
  return (
    <SvgIcon viewBox='0 0 24 24'>
      <path d='M4 7h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' />
    </SvgIcon>
  )
}

function CloseIcon() {
  return (
    <SvgIcon viewBox='0 0 24 24'>
      <path d='M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.4 4.29 19.7 2.88 18.29l6.3-6.29-6.3-6.29L4.29 4.3l6.3 6.29 6.29-6.3z' />
    </SvgIcon>
  )
}

export function HamburgerMenu({
  label = 'メニューを開く',
  title = 'Navigation',
  subtitle = '必要な画面へすぐ移動',
  items,
  onSelect,
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleSelect = (item: HamburgerMenuItem) => {
    onSelect?.(item)
    handleClose()
  }

  return (
    <>
      <IconButton
        aria-label={label}
        onClick={() => setOpen(true)}
        sx={{
          width: 48,
          height: 48,
          border: '1px solid var(--border)',
          borderRadius: 3,
          color: 'var(--text-h)',
          backgroundColor: 'var(--surface-strong)',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'var(--social-bg)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor='left'
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxWidth: '88vw',
              backgroundColor: 'var(--surface-strong)',
              color: 'var(--text-h)',
              backgroundImage: 'none',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', minHeight: '100%', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
              px: 2.5,
              py: 2.25,
            }}
          >
            <Box>
              <Typography
                variant='overline'
                sx={{ color: 'var(--accent)', letterSpacing: '0.14em' }}
              >
                {title}
              </Typography>
              <Typography
                variant='body2'
                sx={{ color: 'var(--text)', lineHeight: 1.5 }}
              >
                {subtitle}
              </Typography>
            </Box>
            <IconButton
              aria-label='メニューを閉じる'
              onClick={handleClose}
              sx={{ color: 'var(--text-h)' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ display: 'grid', gap: 0.75, p: 1.25 }}>
            {items.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => handleSelect(item)}
                sx={{
                  alignItems: 'flex-start',
                  borderRadius: 3,
                  px: 1.5,
                  py: 1.25,
                  '&:hover': {
                    backgroundColor: 'var(--social-bg)',
                  },
                }}
              >
                <Box>
                  <Typography sx={{ color: 'var(--text-h)', fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography
                      variant='body2'
                      sx={{ mt: 0.4, color: 'var(--text)' }}
                    >
                      {item.description}
                    </Typography>
                  )}
                </Box>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
