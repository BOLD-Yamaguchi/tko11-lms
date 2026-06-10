import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'

export interface RadioOption {
  value: string
  label: string
  description?: string
}

export interface RadioButtonGroupProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly RadioOption[]
  row?: boolean
}

export function RadioButtonGroup({
  label,
  value,
  onChange,
  options,
  row = false,
}: RadioButtonGroupProps) {
  return (
    <FormControl>
      <FormLabel
        sx={{
          mb: 1.25,
          color: 'var(--text-h)',
          fontWeight: 600,
          '&.Mui-focused': {
            color: 'var(--accent)',
          },
        }}
      >
        {label}
      </FormLabel>
      <RadioGroup
        row={row}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{
          gap: row ? 1.25 : 1,
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  color: 'var(--border-strong)',
                  '&.Mui-checked': {
                    color: 'var(--accent)',
                  },
                }}
              />
            }
            label={
              <Box sx={{ py: 0.25 }}>
                <Typography
                  component='span'
                  sx={{ display: 'block', color: 'var(--text-h)', fontWeight: 600 }}
                >
                  {option.label}
                </Typography>
                {option.description && (
                  <Typography
                    component='span'
                    sx={{ display: 'block', color: 'var(--text)', fontSize: '0.88rem' }}
                  >
                    {option.description}
                  </Typography>
                )}
              </Box>
            }
            sx={{
              m: 0,
              alignItems: 'flex-start',
              border: '1px solid var(--border)',
              borderRadius: 3,
              px: 1.25,
              py: 1,
              backgroundColor: 'var(--surface)',
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
