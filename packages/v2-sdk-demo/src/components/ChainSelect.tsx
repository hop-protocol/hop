import React from 'react'
import { CustomSelect } from './CustomSelect'
import { CustomMenuItem } from './CustomMenuItem'

export type Chain = {
  chainId: string
}

export type Props = {
  value: string
  chains: string[]
  onChange: (chainId: string) => void
}

const labels: Record<string, string> = {
  1: 'Ethereum (Mainnet)',
  10: 'Optimism (Mainnet)',
  420: 'Optimism (Goerli)',
  5: 'Ethereum (Goerli)',
}

export function ChainSelect(props: Props) {
  const { value, chains, onChange } = props

  function handleChange (event: any) {
    onChange(event.target.value)
  }

  return (
    <CustomSelect
      fullWidth
      value={value}
      onChange={handleChange}>
      {chains.map((chainId: string, i: number) => (
        <CustomMenuItem key={i} value={chainId}>{chainId} - {labels[chainId]}</CustomMenuItem>
      ))}
    </CustomSelect>
  )
}
