import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import PendingIcon from '@mui/icons-material/Pending'
import React, { useState } from 'react'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Table } from './Table'
import { useEvents } from '../hooks/useEvents'
import { useNavigate } from 'react-router-dom'
import { useQueryParams } from '../hooks/useQueryParams'
import { utils } from 'ethers'

export function ExplorerEvents () {
  const { queryParams, updateQueryParams } = useQueryParams()
  const navigate = useNavigate()
  const [filterBy, setFilterBy] = useState('transferId')
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
      key: 'token',
      value: 'Token',
    },
    {
      key: 'amount',
      value: 'Amount',
    },
    {
      key: 'transferId',
      value: 'Transfer ID',
    },
    {
      key: 'checkpoint',
      value: 'Checkpoint',
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
    const isBonded = !!event.transferBondedEvent
    if (isBonded) {
      status = (
        <Chip icon={<CheckIcon style={{ color: '#fff' }} />} label="Bonded" style={{ backgroundColor: '#74d56e', color: '#fff' }} />
      )
    }

    const transferAmount = event?.amount
    const transferAmountFormatted = transferAmount ? utils.formatUnits(transferAmount, event?.token?.decimals) : null
    const transferAmountDisplay = transferAmount ? `${transferAmountFormatted} ${event?.token?.symbol}` : null

    return [
      {
        key: 'status',
        value: status,
        title: `${isBonded ? 'This message has been bonded to the destination chain' : 'This message has not yet been bonded to the destination chain'}`,
      },
      {
        key: 'created',
        value: `${event.context?.blockTimestampRelative}`
      },
      {
        key: 'token',
        value: `${event?.token?.name} (${event?.token?.symbol})`,
        valueUrl: event.token?.tokenExplorerUrl,
      },
      {
        key: 'amount',
        value: transferAmountDisplay
      },
      {
        key: 'transferId',
        value: event.transferIdTruncated,
        clipboardValue: event.transferId
      },
      {
        key: 'checkpoint',
        value: event.checkpointTruncated,
        clipboardValue: event.checkpoint
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
        value: event.transferBondedEvent?.context?.transactionHashTruncated,
        valueUrl: event.transferBondedEvent?.context?.transactionHashExplorerUrl,
        clipboardValue: event.transferBondedEvent?.context?.transactionHash
      },
    ]
  })

  function handleRowClick (row: any) {
    const transferId = row.find((item: any) => item.key === 'transferId').clipboardValue
    navigate(`/t/${transferId}`)
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
                <MenuItem value={'transferId'}>TransferId ID</MenuItem>
                <MenuItem value={'checkpoint'}>Checkpoint</MenuItem>
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
