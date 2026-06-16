import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import type { ComponentType } from 'react'

import { outlinedActionButtonSx } from './buttonStyles'

interface MenuCardProps {
  icon: ComponentType<{ fontSize?: 'small' | 'inherit' | 'large' | 'medium' }>
  title: string
  description: string
  onClick: () => void
}

export function MenuCard({ icon: Icon, title, description, onClick }: MenuCardProps) {
  return (
    <Card 
      elevation={2}
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      {/* カードヘッダー部分 */}
      <Box sx={{ p: 3, textCenter: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* アイコン配置（指定の青色を適用） */}
        <Box sx={{ mb: 2, color: 'rgba(65, 126, 192, 0.84)', display: 'flex', justifyContent: 'center' }}>
          <Icon fontSize="large" />
        </Box>
        
        {/* タイトル */}
        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
          {title}
        </Typography>
        
        {/* 説明文 */}
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          {description}
        </Typography>
      </Box>

      {/* カードアクション（ボタン）部分 */}
      <CardContent sx={{ display: 'flex', justifyContent: 'center', pb: 3, pt: 0 }}>
        <Button 
          type="button"
          variant="contained" // 青背景なので、今回は塗りつぶしのcontainedにしています
          size="large"
          onClick={onClick}
          sx={{
            // 既存の共通スタイルを適応しつつ、今回の色で上書き
            ...outlinedActionButtonSx, 
            backgroundColor: 'rgba(65, 126, 192, 0.84)',
            color: '#ffffff',
            paddingX: 4,
            paddingY: 1,
            '&:hover': {
              backgroundColor: 'rgba(65, 126, 192, 1)', // ホバー時は不透明度100%にして濃くする
            },
          }}
        >
          開く
        </Button>
      </CardContent>
    </Card>
  )
}