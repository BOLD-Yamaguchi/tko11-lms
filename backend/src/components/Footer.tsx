import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export interface FooterLink {
  label: string
  href: string
}

export interface FooterProps {
  title?: string
  description?: string
  links?: FooterLink[]
}

export function Footer({
  title = 'React Component Set',
  description = 'MUI をベースにした画面部品のサンプルセットです。',
  links = [],
}: FooterProps) {
  return (
    <Box
      component='footer'
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        width: '100%',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'rgba(255, 253, 250, 0.88)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <Box
        sx={{
          width: 'var(--shell-width)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          gap: 2,
          px: { xs: 2, md: 3 },
          py: 3,
        }}
      >
        <Box>
          <Typography
            variant='subtitle1'
            sx={{ color: 'var(--text-h)', fontWeight: 700 }}
          >
            {title}
          </Typography>
          <Typography variant='body2' sx={{ color: 'var(--text)' }}>
            {description}
          </Typography>
        </Box>
        {links.length > 0 && (
          <Stack
            direction='row'
            spacing={2}
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                underline='hover'
                target='_blank'
                rel='noreferrer'
                sx={{ color: 'var(--text-h)', fontWeight: 600 }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
