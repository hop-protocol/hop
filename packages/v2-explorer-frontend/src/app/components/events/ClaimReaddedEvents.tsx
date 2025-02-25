import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import React, { useState } from 'react'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Table } from '@/app/components/Table'
import { useEvents } from '@/app/hooks/useEvents'

export function ClaimReaddedEvents () {
  const eventName = 'ClaimReadded'
  const [filterBy, setFilterBy] = useState('claimId')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const { events, nextPage, previousPage, showNextButton, showPreviousButton, limit, loading } = useEvents(eventName, filter)

  const headers = [
    {
      key: 'timestamp',
      value: 'Timestamp',
    },
    {
      key: 'transactionHash',
      value: 'Transaction Hash'
    },
    {
      key: 'pathId',
      value: 'Path ID',
    },
    {
      key: 'claimId',
      value: 'Claim ID',
    },
    {
      key: 'eventChainId',
      value: 'Event Chain ID',
    },
  ]

  const rows = events.map((event: any) => {
    return [
      {
        key: 'timestamp',
        value: `${event.context.blockTimestamp} (${event.context.blockTimestampRelative})`,
        clipboardValue: event.context.blockTimestamp
      },
      {
        key: 'transactionHash',
        value: event.context.transactionHashTruncated,
        valueUrl: event.context.transactionHashExplorerUrl,
        clipboardValue: event.context.transactionHash
      },
      {
        key: 'pathId',
        value: event.pathIdTruncated,
        valueUrl: `/paths?pathId=${event.pathId}`,
        clipboardValue: event.pathId
      },
      {
        key: 'claimId',
        value: event.claimIdTruncated,
        clipboardValue: event.claimId
      },
      {
        key: 'eventChainId',
        value: event.context.chainLabel,
        clipboardValue: event.context.chainLabel
      },
    ]
  })

  function handleFilterByChange (event: any) {
    setFilterBy(event.target.value)
  }

  return (
    <Box>
      <Table title={<><strong>{eventName}</strong> Events</>} titleVariant="h5" headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} filters={
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Box mr={2}>
          <Typography variant="body1" color="secondary">Filter</Typography>
        </Box>
        <Box mr={2}>
          <Select
            value={filterBy}
            onChange={handleFilterByChange}>
              <MenuItem value={'claimId'}>Claim ID</MenuItem>
              <MenuItem value={'pathId'}>Path ID</MenuItem>
              <MenuItem value={'transactionHash'}>Transaction Hash</MenuItem>
              <MenuItem value={'eventChainId'}>Event Chain ID</MenuItem>
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
