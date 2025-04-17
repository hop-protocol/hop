'use client'

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import PendingIcon from '@mui/icons-material/Pending'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Paper from '@mui/material/Paper'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'
import FilterListIcon from '@mui/icons-material/FilterList'
import { alpha } from '@mui/material/styles'
import { Table } from './Table'
import { useEvents } from '../hooks/useEvents'
import { useRouter } from 'next/navigation'
import { useQueryParams } from '@/app/hooks/useQueryParams'
import { utils } from 'ethers'
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle'
import { useTheme } from '@/app/hooks/useTheme'

const { formatUnits } = utils

export function ExplorerEvents (props: any) {
  const { initialEvents } = props
  const router = useRouter()
  const { theme, dark: isDarkMode } = useTheme()
  const { queryParams, updateQueryParams } = useQueryParams()
  const navigate = router.push
  const [filterBy, setFilterBy] = useState('transferId')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const defaultLimit = Number(queryParams?.limit) || 10
  const { events: clientEvents, nextPage, previousPage, showNextButton, showPreviousButton, limit, loading: clientEventsLoading } = useEvents('explorer', filter, onPagination, queryParams)
  
  function onPagination (params: any) {
    const { page, limit } = params
    updateQueryParams({ page, limit })
  }

  function handlePageLimitChange(newLimit: number) {
    onPagination({ page: 1, limit: newLimit })
  }

  const [loading, setLoading] = useState(() => {
    return !initialEvents?.events.length
  })

  const [events, setEvents] = useState(() => {
    return initialEvents?.events || []
  })

  useEffect(() => {
    if (clientEvents?.length) {
      setEvents(clientEvents)
    }
    if (!clientEvents?.length && (events?.length !== clientEvents?.length && !clientEventsLoading)) {
      setEvents([])
    }
    setLoading(false)
  }, [clientEvents, clientEventsLoading, events?.length])

  const headers = [
    {
      key: 'index',
      value: '#',
    },
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
      key: 'sourceChain',
      value: 'Source Chain',
    },
    {
      key: 'sourceTransactionHash',
      value: 'Source Tx Hash'
    },
    {
      key: 'destinationChain',
      value: 'Destination Chain',
    },
    {
      key: 'destinationTransactionHash',
      value: 'Destination Tx Hash'
    },
    {
      key: 'details',
      value: 'Details'
    },
  ]

  const rows = events?.map((event: any, index: number) => {
    const isBonded = event.transferBondedEvents?.length > 0
    const isWithdrawn = event.claimWithdrawnEvents?.length > 0
    const isCompleted = isBonded || isWithdrawn
    const statusLabel = isBonded ? 'Bonded' : isWithdrawn ? 'Withdrawn' : 'Pending'
    
    let status
    if (isCompleted) {
      status = (
        <Chip 
          icon={<CheckIcon />} 
          label={statusLabel} 
          sx={{ 
            backgroundColor: '#74d56e', 
            color: '#fff',
            fontWeight: 'medium',
            '& .MuiChip-icon': {
              color: '#fff'
            }
          }} 
        />
      )
    } else {
      status = (
        <Chip 
          icon={<PendingIcon />} 
          label="Pending" 
          color="secondary"
        />
      )
    }

    const transferAmountDisplay = `${event?.amountDisplay ?? ''} (${event?.amountUsdDisplay ?? ''})`

    return [
      {
        key: 'index',
        value: event.i
      },
      {
        key: 'status',
        value: status,
        hoverTitle: `${isBonded ? 'This message has been bonded to the destination chain' : 'This message has not yet been bonded to the destination chain'}`,
      },
      {
        key: 'created',
        value: `${event.context?.blockTimestampRelative}`,
        hoverTitle: `${event.context?.blockTimestampISO}`
      },
      {
        key: 'token',
        value: `${event?.token?.name ?? ''} (${event?.token?.symbol ?? ''})`,
        imageUrl: event.token?.imageUrl,
        valueUrl: event.token?.tokenExplorerUrl,
      },
      {
        key: 'amount',
        value: transferAmountDisplay,
        clipboardValue: transferAmountDisplay
      },
      {
        key: 'transferId',
        value: event.transferIdTruncated,
        clipboardValue: event.transferId
      },
      {
        key: 'sourceChain',
        value: event.context?.chainLabel,
        imageUrl: event.context?.chainImageUrl,
        clipboardValue: event.context?.chainLabel
      },
      {
        key: 'sourceTransactionHash',
        value: event.context?.transactionHashTruncated,
        valueUrl: event.context?.transactionHashExplorerUrl,
        clipboardValue: event.context?.transactionHash
      },
      {
        key: 'destinationChain',
        value: event.toChainLabel,
        imageUrl: event.toChainImageUrl,
        clipboardValue: event.toChainLabel
      },
      {
        key: 'destinationTransactionHash',
        value: event.transferBondedEvents[event.transferBondedEvents.length - 1]?.context?.transactionHashTruncated,
        valueUrl: event.transferBondedEvents[event.transferBondedEvents.length - 1]?.context?.transactionHashExplorerUrl,
        clipboardValue: event.transferBondedEvents[event.transferBondedEvents.length - 1]?.context?.transactionHash
      },
      {
        key: 'details',
        value: 'View Details',
        valueUrl: `/t/${event.transferId}`,
        button: true
      },
    ]
  })

  function handleRowClick (row: any) {
    const transferId = row.find((item: any) => item.key === 'transferId').clipboardValue
    navigate(`/t/${transferId}`)
  }

  function handleFilterByChange (event: any) {
    const val = event.target.value
    setFilterBy(val)
    if (val === 'bonded' || val === 'pending') {
      setFilterValue('')
    }
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "2800px", mx: "auto" }}>
      <Paper 
        elevation={isDarkMode ? 3 : 1} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          mb: 4,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: 3
          }}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                whiteSpace: 'nowrap',
                mb: 0.5
              }}
            >
              <SwapHorizontalCircleIcon 
                sx={{ 
                  fontSize: '2.2rem',
                  color: theme.palette.primary.main,
                  mr: 1
                }} 
              />
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold" 
                color="text.primary"
              >
                Transfer Events
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              View and track all transfers across the protocol
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', md: 'auto' }
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
                <MenuItem value={'transactionHash'}>Transaction Hash</MenuItem>
                <MenuItem value={'account'}>Account</MenuItem>
                <MenuItem value={'recipient'}>Recipient</MenuItem>
                <MenuItem value={'bonded'}>Bonded</MenuItem>
                <MenuItem value={'pending'}>Pending</MenuItem>
              </Select>
            </FormControl>

            {!['bonded', 'pending'].includes(filterBy) && (
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
            )}
          </Box>
        </Box>

        <Table 
          title={''} 
          headers={headers} 
          rows={rows} 
          showNextButton={showNextButton} 
          showPreviousButton={showPreviousButton} 
          nextPage={nextPage} 
          previousPage={previousPage} 
          limit={limit} 
          defaultLimit={defaultLimit}
          onPageLimitChange={handlePageLimitChange}
          loading={loading} 
          onRowClick={handleRowClick} 
          minWidth={'2100px'}
          filters={null}
        />
      </Paper>
    </Box>
  )
}