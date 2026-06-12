import type { ReactNode } from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import {
  HamburgerMenu,
  type HamburgerMenuItem,
} from './HamburgerMenu'

export interface HeaderProps {
  title: string
  eyebrow?: string
  menuItems: readonly HamburgerMenuItem[]
  onMenuSelect?: (item: HamburgerMenuItem) => void
  children?: ReactNode
}

export function Header({
  title,
  eyebrow = 'Component Gallery',
  menuItems,
  onMenuSelect,
  children,
}: HeaderProps) {
  return (
    <AppBar
      position='fixed'
      elevation={0}
      color='transparent'
      sx={{
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'rgba(65, 126, 192, 0.84)',
        backdropFilter: 'blur(18px)',
        backgroundImage: 'none',
        color: 'var(--text-h)',
        boxShadow: 'none',
      }}
    >
      <Box sx={{ width: 'var(--shell-width)', margin: '0 auto' }}>
        <Toolbar sx={{ minHeight: 76, gap: 2, px: { xs: 2, md: 3 } }}>
          <HamburgerMenu
            title='Components'
            subtitle='サンプル画面と各 UI パーツ'
            items={menuItems}
            onSelect={onMenuSelect}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant='overline'
              sx={{ color: 'var(--accent)', letterSpacing: '0.16em' }}
            >
              {eyebrow}
            </Typography>
            <Typography
              variant='h5'
              sx={{
                fontFamily: 'var(--heading)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: 'var(--text-h)',
              }}
            >
              {title}
            </Typography>
          </Box>
          {children && (
            <Stack
              direction='row'
              spacing={1.25}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {children}
            </Stack>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  )
}
export default Header;