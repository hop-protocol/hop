import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import React, { useState } from 'react'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Table } from '@/app/components/Table'
import { useEvents } from '@/app/hooks/useEvents'

export function TransferSentEvents () {
  const eventName = 'TransferSent'
  const [filterBy, setFilterBy] = useState('transferId')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const { events, nextPage, previousPage, showNextButton, showPreviousButton, limit, loading } = useEvents(eventName, filter)
  console.log(events)

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
      key: 'transferId',
      value: 'Transfer ID',
    },
    {
      key: 'amount',
      value: 'Amount',
    },
    {
      key: 'sourcePool',
      value: 'Source Pool',
    },
    {
      key: 'eventChainId',
      value: 'Event Chain ID',
    },
    {
      key: 'subtable',
      value: 'Hops',
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
        key: 'transferId',
        value: event.transferIdTruncated,
        clipboardValue: event.transferId
      },
      {
        key: 'amount',
        value: event.amount,
        clipboardValue: event.amount
      },
      {
        key: 'sourcePool',
        value: event.sourcePool,
        clipboardValue: event.sourcePool
      },
      {
        key: 'eventChainId',
        value: event.context.chainLabel,
        clipboardValue: event.context.chainLabel
      },
      {
        key: 'subtable',
        value: {
          headers: [
            {
              key: 'index',
              value: '#'
            },
            {
              key: 'pathId',
              value: 'Path ID',
            },
            {
              key: 'maxBonderFee',
              value: 'Max Bonder Fee',
            },
            {
              key: 'maxTotalSent',
              value: 'Max Total Sent',
            },
            {
              key: 'attestedClaimId',
              value: 'Attested Claim ID',
            },
          ],
          rows: event.hops.map((hop: any, i: number) => {
            return [
              {
                key: 'index',
                value: hop.index
              },
              {
                key: 'pathId',
                value: hop.pathIdTruncated,
                valueUrl: `/paths?pathId=${hop.pathId}`,
                clipboardValue: hop.pathId
              },
              {
                key: 'maxBonderFee',
                value: hop.maxBonderFee,
                clipboardValue: hop.maxBonderFee
              },
              {
                key: 'maxTotalSent',
                value: hop.maxTotalSent,
                clipboardValue: hop.maxTotalSent
              },
              {
                key: 'attestedClaimId',
                value: hop.attestedClaimIdTruncated,
                clipboardValue: hop.attestedClaimId
              },
            ]
          })
        }
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
              <MenuItem value={'transferId'}>Transfer ID</MenuItem>
              <MenuItem value={'attestedClaimId'}>Attested Claim ID</MenuItem>
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
