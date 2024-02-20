import React, { useState, useEffect } from 'react'
import { Table } from './Table'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useEvents } from '../hooks/useEvents'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'
import PendingIcon from '@mui/icons-material/Pending'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryParams } from '../hooks/useQueryParams'

export function ExplorerEvents () {
  const { queryParams, updateQueryParams } = useQueryParams()
  const navigate = useNavigate()
  const [filterBy, setFilterBy] = useState('messageId')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  function onPagination (params: any) {
    const { page } = params
    updateQueryParams({ page })
  }
  const { events, nextPage, previousPage, showNextButton, showPreviousButton, limit, loading } = useEvents('explorer', filter, onPagination, queryParams)

  const headers = [
    {
      key: 'status',
      value: 'Status',
    },
    {
      key: 'created',
      value: 'Created',
    },
    {
      key: 'messageId',
      value: 'Message ID',
    },
    {
      key: 'sourceChain',
      value: 'Source Chain',
    },
    {
      key: 'sourceTransactionHash',
      value: 'Source Transaction Hash'
    },
    {
      key: 'destinationChain',
      value: 'Destination Chain',
    },
    {
      key: 'destinationTransactionHash',
      value: 'Destination Transaction Hash'
    },
  ]

  const rows = events.map((event: any) => {
    let status = (
      <Chip icon={<PendingIcon />} label="Pending" />
    )
    const isRelayed = !!event.messageRelayedEvent
    if (isRelayed) {
      status = (
        <Chip icon={<CheckIcon style={{ color: '#fff' }} />} label="Relayed" style={{ backgroundColor: '#74d56e', color: '#fff' }} />
      )
    }
    return [
      {
        key: 'status',
        value: status,
        title: `${isRelayed ? 'This message has been relayed to the destination chain' : 'This message has not yet been relayed to the destination chain'}`,
      },
      {
        key: 'created',
        value: `${event.context?.blockTimestampRelative}`
      },
      {
        key: 'messageId',
        value: event.messageIdTruncated,
        clipboardValue: event.messageId
      },
      {
        key: 'sourceChain',
        value: event.context?.chainLabel
      },
      {
        key: 'sourceTransactionHash',
        value: event.context?.transactionHashTruncated,
        valueUrl: event.context?.transactionHashExplorerUrl,
        clipboardValue: event.context?.transactionHash
      },
      {
        key: 'destinationChain',
        value: event.toChainLabel
      },
      {
        key: 'destinationTransactionHash',
        value: event.messageRelayedEvent?.context?.transactionHashTruncated,
        valueUrl: event.messageRelayedEvent?.context?.transactionHashExplorerUrl,
        clipboardValue: event.messageRelayedEvent?.context?.transactionHash
      },
    ]
  })

  function handleRowClick (row: any) {
    const messageId = row.find((item: any) => item.key === 'messageId').clipboardValue
    navigate(`/m/${messageId}`)
  }

  function handleFilterByChange (event: any) {
    setFilterBy(event.target.value)
  }

  return (
    <Box width="100%">
      <Table title={'Messages'} headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} onRowClick={handleRowClick} filters={
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Box mr={2}>
            <Typography variant="body1">Filter</Typography>
          </Box>
          <Box mr={2}>
            <Select
              value={filterBy}
              onChange={handleFilterByChange}>
                <MenuItem value={'messageId'}>Message ID</MenuItem>
                <MenuItem value={'transactionHash'}>Transaction Hash</MenuItem>
            </Select>
          </Box>
          <Box>
            <TextField placeholder="0x" value={filterValue} onChange={(event: any) => setFilterValue(event.target.value)} />
          </Box>
        </Box>
      } />
    </Box>
  )
}
