'use client'
import React from 'react'
import Box from '@mui/material/Box'
import { useFetchTokens } from './useFetchTokens'
import { Table } from '@/app/components/Table'

export function Tokens () {
  const { tokens, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchTokens()

  const headers = [
    {
      key: 'name',
      value: 'Name'
    },
    {
      key: 'symbol',
      value: 'Symbol'
    },
    {
      key: 'decimals',
      value: 'Decimals'
    },
    {
      key: 'chainId',
      value: 'Chain ID'
    },
    {
      key: 'address',
      value: 'Address'
    },
  ]

  const rows = tokens.map((token: any) => {
    return [
      {
        key: 'name',
        value: token.name,
        clipboardValue: token.name
      },
      {
        key: 'symbol',
        value: token.symbol,
        clipboardValue: token.symbol
      },
      {
        key: 'decimals',
        value: token.decimals,
        clipboardValue: token.decimals
      },
      {
        key: 'chainId',
        value: token.chainLabel,
        clipboardValue: token.chainLabel
      },
      {
        key: 'address',
        value: token.addressTruncated,
        valueUrl: token.tokenExplorerUrl,
        clipboardValue: token.address
      },
    ]
  })

  return (
    <Box>
      <Table title={'Tokens'} headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} />
    </Box>
  )
}
