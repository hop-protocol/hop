'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useFetchTokens } from '@/app/hooks/useFetchTokens'
import { Table } from '@/app/components/Table'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export function Tokens () {
  const [filterBy, setFilterBy] = useState('symbol')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const { tokens, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchTokens(filter)

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
        imageUrl: token.imageUrl,
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
        imageUrl: token.chainImageUrl,
        clipboardValue: token.chainId
      },
      {
        key: 'address',
        value: token.addressTruncated,
        valueUrl: token.tokenExplorerUrl,
        clipboardValue: token.address
      },
    ]
  })

  function handleFilterByChange (event: any) {
    setFilterBy(event.target.value)
  }

  return (
    <Box width="100%" maxWidth="1200px">
      <Table title={'Tokens'} headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} filters={
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Box mr={2}>
          <Typography variant="body1" color="secondary">Filter</Typography>
        </Box>
        <Box mr={2}>
          <Select
            value={filterBy}
            onChange={handleFilterByChange}>
              <MenuItem value={'symbol'}>Symbol</MenuItem>
              <MenuItem value={'address'}>Address</MenuItem>
              <MenuItem value={'chainId'}>Chain ID</MenuItem>
          </Select>
        </Box>
        <Box>
          <TextField placeholder="Value" value={filterValue} onChange={(event: any) => setFilterValue(event.target.value)} />
        </Box>
      </Box>
      } />
    </Box>
  )
}
