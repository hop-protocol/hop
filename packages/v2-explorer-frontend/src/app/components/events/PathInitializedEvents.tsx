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


export function PathInitializedEvents () {
  const eventName = 'PathInitialized'
  const theme = useTheme()
  const [filterBy, setFilterBy] = useState('pathId')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const { events, nextPage, previousPage, showNextButton, showPreviousButton, limit, loading } = useEvents(eventName, filter)

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
      key: 'pathId',
      value: 'Path ID',
    },
    {
      key: 'token',
      value: 'Token',
    },
    {
      key: 'counterpartChainId',
      value: 'Counterpart Chain ID',
    },
    {
      key: 'counterpartToken',
      value: 'Counterpart Token',
    },
    {
      key: 'initialReserve',
      value: 'Initial Reserve',
    },
    {
      key: 'path',
      value: 'Path',
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
        key: 'pathId',
        value: event.pathIdTruncated,
        valueUrl: `/p/${event.pathId}`,
        clipboardValue: event.pathId
      },
      {
        key: 'token',
        value: event.token,
        clipboardValue: event.token
      },
      {
        key: 'counterpartChainId',
        value: event.counterpartChainId,
        clipboardValue: event.counterpartChainId
      },
      {
        key: 'counterpartToken',
        value: event.counterpartToken,
        clipboardValue: event.counterpartToken
      },
      {
        key: 'initialReserve',
        value: event.initialReserve,
        clipboardValue: event.initialReserve
      },
      {
        key: 'path',
        value: event.path,
        clipboardValue: event.path
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
                <MenuItem value={'pathId'}>Path ID</MenuItem>
                <MenuItem value={'token'}>Token</MenuItem>
                <MenuItem value={'counterpartChainId'}>Counterpart Chain ID</MenuItem>
                <MenuItem value={'counterpartToken'}>Counterpart Token</MenuItem>
                <MenuItem value={'initialReserve'}>Initial Reserve</MenuItem>
                <MenuItem value={'path'}>Path</MenuItem>
                <MenuItem value={'transactionHash'}>Transaction Hash</MenuItem>
                <MenuItem value={'eventChainId'}>Event Chain ID</MenuItem>
              </Select>
            </FormControl>

            <TextField
              placeholder={filterBy === 'pathId' ? 'Enter path ID' : filterBy === 'token' ? 'Enter token address' : 'Enter value...'}
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
