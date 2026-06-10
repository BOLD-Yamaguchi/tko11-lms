import { useId } from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly DropdownOption[]
}

export function DropdownField({
  label,
  value,
  onChange,
  options,
}: DropdownFieldProps) {
  const labelId = useId()

  return (
    <FormControl fullWidth>
      <InputLabel
        id={labelId}
        sx={{
          color: 'var(--text)',
          '&.Mui-focused': {
            color: 'var(--accent)',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{
          borderRadius: 3,
          backgroundColor: 'var(--surface)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--accent-border)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--accent)',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
