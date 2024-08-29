'use client'
import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { useFetchPaths } from './useFetchPaths'
import { Table } from '@/app/components/Table'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQueryParams } from '@/app/hooks/useQueryParams'

export function Paths () {
  const { queryParams, updateQueryParams } = useQueryParams()
  const [filterBy, setFilterBy] = useState('pathId')
  const [filterValue, setFilterValue] = useState(queryParams.pathId || '')
  const filter = { [filterBy]: filterValue }
  const { paths, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchPaths(filter)
  console.log(paths)

  useEffect(() => {
    updateQueryParams({ pathId: undefined })
  }, [])

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
        value: path.pathIdTruncated,
        clipboardValue: path.pathId
      },
      {
        key: 'chainId',
        value: path.chainLabel,
        clipboardValue: path.chainId
      },
      {
        key: 'token',
        value: `${path.tokenSymbol ? `(${path.tokenSymbol}) ` : ''} ${path.tokenTruncated}`,
        valueUrl: path.tokenExplorerUrl,
        clipboardValue: path.token
      },
      {
        key: 'counterpartChainId',
        value: path.counterpartChainLabel,
        clipboardValue: path.counterpartChainId
      },
      {
        key: 'counterpartToken',
        value: `${path.counterpartTokenSymbol ? `(${path.counterpartTokenSymbol}) ` : ''}${path.counterpartTokenTruncated}`,
        valueUrl: path.counterpartTokenExplorerUrl,
        clipboardValue: path.counterpartToken
      },
    ]
  })

  function handleFilterByChange (event: any) {
    setFilterBy(event.target.value)
  }

  return (
    <Box>
      <Table title={'Paths'} headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} filters={
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Box mr={2}>
          <Typography variant="body1" color="secondary">Filter</Typography>
        </Box>
        <Box mr={2}>
          <Select
            value={filterBy}
            onChange={handleFilterByChange}>
              <MenuItem value={'pathId'}>Path ID</MenuItem>
              <MenuItem value={'token'}>Token Address</MenuItem>
              <MenuItem value={'counterpartToken'}>Counterpart Token Address</MenuItem>
              <MenuItem value={'chainId'}>Chain ID</MenuItem>
              <MenuItem value={'counterpartChainId'}>Counterpart Chain ID</MenuItem>
          </Select>
        </Box>
        <Box>
          <TextField placeholder="0x" value={filterValue} onChange={(event: any) => setFilterValue(event.target.value)} />
        </Box>
      </Box>
      }
      />
    </Box>
  )
}
