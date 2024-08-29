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
      key: 'totalSent',
      value: 'Total Sent',
    },
    {
      key: 'attestedClaimId',
      value: 'Attested Claim ID',
    },
    {
      key: 'attestedClaims',
      value: 'Attested Claims',
    },
    {
      key: 'eventChainId',
      value: 'Event Chain ID',
    },
    {
      key: 'subtable',
      value: 'Next Hops',
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
        key: 'totalSent',
        value: event.totalSent,
        clipboardValue: event.totalSent
      },
      {
        key: 'attestedClaimId',
        value: event.attestedClaimIdTruncated,
        clipboardValue: event.attestedClaimId
      },
      {
        key: 'attestedTotalClaims',
        value: event.attestedTotalClaims,
        clipboardValue: event.attestedTotalClaims
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
              key: 'maxTotalSent',
              value: 'Max Total Sent',
            },
            {
              key: 'attestedClaimId',
              value: 'Attested Claim ID',
            },
          ],
          rows: event.nextHops.map((nextHop: any, i: number) => {
            return [
              {
                key: 'index',
                value: nextHop.index
              },
              {
                key: 'pathId',
                value: nextHop.pathIdTruncated,
                valueUrl: `/paths?pathId=${nextHop.pathId}`,
                clipboardValue: nextHop.pathId
              },
              {
                key: 'maxTotalSent',
                value: nextHop.maxTotalSent,
                clipboardValue: nextHop.maxTotalSent
              },
              {
                key: 'attestedClaimId',
                value: nextHop.attestedClaimIdTruncated,
                clipboardValue: nextHop.attestedClaimId
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
      <Table title={`${eventName} Events`} headers={headers} rows={rows} showNextButton={showNextButton} showPreviousButton={showPreviousButton} nextPage={nextPage} previousPage={previousPage} limit={limit} loading={loading} filters={
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
