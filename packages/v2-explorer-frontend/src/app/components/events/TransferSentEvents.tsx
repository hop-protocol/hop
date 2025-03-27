import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import React, { useState } from 'react'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useTheme } from '@mui/material/styles'
import { Table } from '@/app/components/Table'
import { useEvents } from '@/app/hooks/useEvents'

export function TransferSentEvents () {
  const eventName = 'TransferSent'
  const theme = useTheme()
  const [filterBy, setFilterBy] = useState('transferId')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const { events, nextPage, previousPage, showNextButton, showPreviousButton, limit, loading } = useEvents(eventName, filter)
  console.log(events)

  const headers = [
    {
      key: 'index',
      value: '#',
    },
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
        key: 'index',
        value: event.i,
      },
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
      <Table 
        title={<><strong>{eventName}</strong> Events</>} 
        titleVariant="h5" 
        headers={headers} 
        rows={rows} 
        showNextButton={showNextButton} 
        showPreviousButton={showPreviousButton} 
        nextPage={nextPage} 
        previousPage={previousPage} 
        limit={limit} 
        loading={loading} 
        filters={
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'flex-end',
              gap: 2,
              width: '100%'
            }}
          >
            <FormControl 
              variant="outlined" 
              size="small"
              sx={{ 
                minWidth: 150,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <InputLabel id="filter-by-label">Filter by</InputLabel>
              <Select
                labelId="filter-by-label"
                id="filter-by"
                value={filterBy}
                onChange={handleFilterByChange}
                label="Filter by"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value={'transferId'}>Transfer ID</MenuItem>
                <MenuItem value={'attestedClaimId'}>Attested Claim ID</MenuItem>
                <MenuItem value={'pathId'}>Path ID</MenuItem>
                <MenuItem value={'transactionHash'}>Transaction Hash</MenuItem>
                <MenuItem value={'eventChainId'}>Event Chain ID</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              placeholder={filterBy === 'transferId' ? 'Enter transfer ID' : 'Enter 0x...'}
              value={filterValue} 
              onChange={(event: any) => setFilterValue(event.target.value)} 
              size="small"
              variant="outlined"
              fullWidth
              sx={{
                width: { xs: '100%', sm: '250px' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        } 
      />
    </Box>
  )
}
