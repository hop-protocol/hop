'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useFetchPrices } from '@/app/hooks/useFetchPrices'
import { Table } from '@/app/components/Table'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export function Prices () {
  const [filterBy, setFilterBy] = useState('token')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const { prices, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchPrices(filter)

  const headers = [
    {
      key: 'timestamp',
      value: 'Timestamp'
    },
    {
      key: 'token',
      value: 'Token'
    },
    {
      key: 'priceUsd',
      value: 'Price (USD)'
    },
  ]

  const rows = prices.map((price: any) => {
    return [
      {
        key: 'timestamp',
        value: `${price.timestamp} (${price.timestampRelative})`,
        clipboardValue: price.timestamp
      },
      {
        key: 'token',
        value: price.token,
        clipboardValue: price.token
      },
      {
        key: 'priceUsd',
        value: price.priceUsdDisplay,
        clipboardValue: price.priceUsd
      },
    ]
  })

  function handleFilterByChange (event: any) {
    setFilterBy(event.target.value)
  }

  return (
    <Box width="100%" maxWidth="1200px">
      <Table title={'Token Prices'} headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} filters={
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Box mr={2}>
          <Typography variant="body1" color="secondary">Filter</Typography>
        </Box>
        <Box mr={2}>
          <Select
            value={filterBy}
            onChange={handleFilterByChange}>
              <MenuItem value={'token'}>Symbol</MenuItem>
          </Select>
        </Box>
        <Box>
          <TextField placeholder="Value" value={filterValue} onChange={(event: any) => setFilterValue(event.target.value)} />
        </Box>
      </Box>
      }

      />
    </Box>
  )
}
