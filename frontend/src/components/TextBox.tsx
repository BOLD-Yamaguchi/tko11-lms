import type { HTMLInputTypeAttribute } from 'react'
import TextField from '@mui/material/TextField'

export interface TextBoxProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helperText?: string
  multiline?: boolean
  minRows?: number
  required?: boolean
  type?: HTMLInputTypeAttribute
}

export function TextBox({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  multiline = false,
  minRows,
  required = false,
  type = 'text',
}: TextBoxProps) {
  return (
    <TextField
      fullWidth
      variant='outlined'
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      helperText={helperText}
      multiline={multiline}
      minRows={minRows}
      required={required}
      type={type}
      sx={{
        '& .MuiInputLabel-root': {
          color: 'var(--text)',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'var(--accent)',
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          backgroundColor: 'var(--surface)',
          '& fieldset': {
            borderColor: 'var(--border)',
          },
          '&:hover fieldset': {
            borderColor: 'var(--accent-border)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--accent)',
          },
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0,
          marginTop: 1,
          color: 'var(--text)',
        },
      }}
    />
  )
}
