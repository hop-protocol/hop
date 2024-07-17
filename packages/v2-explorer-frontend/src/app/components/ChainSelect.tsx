import MenuItem from '@mui/material/MenuItem'
import React from 'react'
import Select from '@mui/material/Select'

export type Chain = {
  chainId: string
}

export type Props = {
  value: string
  chains: string[]
  onChange: (chainId: string) => void
  labels?: Record<string, string> // 1: 'Ethereum (Mainnet)'
}

export function ChainSelect(props: Props) {
  const { labels, value, chains, onChange } = props

  function handleChange (event: any) {
    onChange(event.target.value)
  }

  return (
    <Select
      fullWidth
      value={value}
      onChange={handleChange}>
      {chains.map((chainId: string) => (
        <MenuItem value={chainId} key={chainId}>{chainId} - {labels?.[chainId]}</MenuItem>
      ))}
    </Select>
  )
}
