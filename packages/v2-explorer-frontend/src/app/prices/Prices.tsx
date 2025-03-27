'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useFetchPrices } from '@/app/hooks/useFetchPrices'
import { Table } from '@/app/components/Table'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useTheme } from '@mui/material/styles'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Paper from '@mui/material/Paper'

export function Prices () {
  const theme = useTheme()
  const [filterBy, setFilterBy] = useState('token')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const { prices, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchPrices(filter)

  const headers = [
    {
      key: 'index',
      value: '#'
    },
    {
      key: 'timestamp',
      value: 'Timestamp'
    },
    {
      key: 'token',
      value: 'Token'
    },
    {
      key: 'priceUsd',
      value: 'Price (USD)'
    },
  ]

  const rows = prices.map((price: any) => {
    return [
      {
        key: 'index',
        value: price.i
      },
      {
        key: 'timestamp',
        value: `${price.timestamp} (${price.timestampRelative})`,
        clipboardValue: price.timestamp
      },
      {
        key: 'token',
        value: price.token,
        clipboardValue: price.token
      },
      {
        key: 'priceUsd',
        value: price.priceUsdDisplay,
        clipboardValue: price.priceUsd
      },
    ]
  })

  function handleFilterByChange (event: any) {
    setFilterBy(event.target.value)
  }

  return (
    <Box width="100%" maxWidth="1200px">
      <Paper 
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 1px 5px rgba(0, 0, 0, 0.1)',
          mb: 4
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
                whiteSpace: 'nowrap'
              }}
            >
              <AttachMoneyIcon 
                sx={{ 
                  fontSize: '2rem',
                  color: theme.palette.primary.main,
                  mr: 1
                }} 
              />
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold" 
                color="text.primary"
                sx={{ mb: 0.5 }}
              >
                Token Prices
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              View historical token price data across the network
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
              <InputLabel id="price-filter-by-label">Filter by</InputLabel>
              <Select
                labelId="price-filter-by-label"
                id="price-filter-by"
                value={filterBy}
                onChange={handleFilterByChange}
                label="Filter by"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value={'token'}>Token Symbol</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              placeholder="Enter token symbol..."
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
        </Box>
        
        <Table 
          title=""
          titleVariant="h5"
          headers={headers} 
          rows={rows} 
          showNextButton={showNextButton} 
          showPreviousButton={showPreviousButton} 
          nextPage={nextPage} 
          previousPage={previousPage} 
          limit={limit} 
          loading={loading} 
        />
      </Paper>
    </Box>
  )
}
