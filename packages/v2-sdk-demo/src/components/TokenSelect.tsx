import React from 'react'
import { CustomSelect } from './CustomSelect'
import { CustomMenuItem } from './CustomMenuItem'
import { network } from '../config'

export type Token = {
  symbol: string
}

export type Props = {
  value: string
  tokens: string[]
  onChange: (token: Token) => void
}

// TODO: pull from a token list
const tokenListByChain = {
sepolia: {
    MOCK: {
      name: 'Mock Token',
      decimals: 18,
      addresses: {
        '11155111': '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
        '11155420': '0xaCa72C8D5360dC237001cD963566F411732980B0',
      },
    },
    USDC: {
      name: 'USD Coin',
      decimals: 6,
      addresses: {
        '11155111': '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        '11155420': '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
      },
    }
  }
}

// usage:
// <TokenSelect value={'USDC'} tokens={['USDC', 'MOCK']} onChange={value => console.log('value', value)} />

export function TokenSelect(props: Props) {
  const { value, tokens, onChange } = props

  function handleChange (event: any) {
    onChange(tokenListByChain[network][event.target.value])
  }

  return (
    <CustomSelect
      fullWidth
      value={value}
      onChange={handleChange}>
      {tokens.map((tokenSymbol: string, i: number) => (
        <CustomMenuItem key={i} value={tokenSymbol}>{tokenSymbol} - {tokenListByChain[network][tokenSymbol].name}</CustomMenuItem>
      ))}
    </CustomSelect>
  )
}
