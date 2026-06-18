import type { ReactNode } from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

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
  showMenu?: boolean
}

export function Header({
  title,
  eyebrow = 'Component Gallery',
  menuItems,
  onMenuSelect,
  children,
  showMenu = true,
}: HeaderProps) {

  const navigate = useNavigate()

  const logout = () => {

    sessionStorage.removeItem("adminKbn")
    sessionStorage.removeItem("employeeCode")
    sessionStorage.removeItem("username")

    navigate("/user-login")
  }

  const username = sessionStorage.getItem("username")
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
      <Box sx={{ width: '100%', margin: '0 auto' }}>
        <Toolbar sx={{ minHeight: 76, gap: 2, px: { xs: 2, md: 3 } }}>
          {showMenu && (
            <HamburgerMenu
              title='Components'
              subtitle='サンプル画面と各 UI パーツ'
              items={menuItems}
              onSelect={onMenuSelect}
            />
          )}
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
          {username && (
            <Stack
              direction='row'
              spacing={2}
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">
                {username} さん
              </Typography>

              <Button
                color="inherit"
                variant="outlined"
                onClick={logout}
              >
                ログアウト
              </Button>

              {children}
            </Stack>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  )
}
export default Header;