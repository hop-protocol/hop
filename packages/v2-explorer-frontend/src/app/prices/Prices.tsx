'use client'
import React from 'react'
import Box from '@mui/material/Box'
import { useFetchPrices } from './useFetchPrices'
import { Table } from '@/app/components/Table'

export function Prices () {
  const { prices, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchPrices ()

  const headers = [
    {
      key: 'relativeDate',
      value: 'Relative Date'
    },
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
        key: 'relativeDate',
        value: price.timestampRelative,
        clipboardValue: price.timestampRelative
      },
      {
        key: 'timestamp',
        value: price.timestamp,
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
        clipboardValue: price.priceUsdDisplay
      },
    ]
  })

  return (
    <Box>
      <Table title={'Token Prices'} headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} />
    </Box>
  )
}
