'use client'
import React from 'react'
import Box from '@mui/material/Box'
import { useFetchPaths } from './useFetchPaths'
import { Table } from '@/app/components/Table'

export function Paths () {
  const { paths, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchPaths ()

  const headers = [
    {
      key: 'pathId',
      value: 'Path ID'
    },
    {
      key: 'chainId',
      value: 'Chain ID'
    },
    {
      key: 'token',
      value: 'Token'
    },
    {
      key: 'counterpartChainId',
      value: 'Counterpart Chain ID'
    },
    {
      key: 'counterpartToken',
      value: 'Counterpart Token'
    },
  ]

  const rows = paths.map((path: any) => {
    return [
      {
        key: 'pathId',
        value: path.pathId,
        clipboardValue: path.pathId
      },
      {
        key: 'chainId',
        value: path.chainId,
        clipboardValue: path.chainId
      },
      {
        key: 'token',
        value: path.token,
        clipboardValue: path.token
      },
      {
        key: 'counterpartChainId',
        value: path.counterpartChainId,
        clipboardValue: path.counterpartChainId
      },
      {
        key: 'counterpartToken',
        value: path.counterpartToken,
        clipboardValue: path.counterpartToken
      },
    ]
  })

  return (
    <Box>
      <Table title={'Paths'} headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} />
    </Box>
  )
}
