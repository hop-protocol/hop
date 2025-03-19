'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useFetchTokens } from '@/app/hooks/useFetchTokens'
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
import Paper from '@mui/material/Paper'
import TokenIcon from '@mui/icons-material/Token'

export function Tokens () {
  const theme = useTheme()
  const [filterBy, setFilterBy] = useState('symbol')
  const [filterValue, setFilterValue] = useState('')
  const filter = { [filterBy]: filterValue }
  const { tokens, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchTokens(filter)

  const headers = [
    {
      key: 'name',
      value: 'Name'
    },
    {
      key: 'symbol',
      value: 'Symbol'
    },
    {
      key: 'decimals',
      value: 'Decimals'
    },
    {
      key: 'chainId',
      value: 'Chain ID'
    },
    {
      key: 'address',
      value: 'Address'
    },
  ]

  const rows = tokens.map((token: any) => {
    return [
      {
        key: 'name',
        value: token.name,
        imageUrl: token.imageUrl,
        clipboardValue: token.name
      },
      {
        key: 'symbol',
        value: token.symbol,
        clipboardValue: token.symbol
      },
      {
        key: 'decimals',
        value: token.decimals,
        clipboardValue: token.decimals
      },
      {
        key: 'chainId',
        value: token.chainLabel,
        imageUrl: token.chainImageUrl,
        clipboardValue: token.chainId
      },
      {
        key: 'address',
        value: token.addressTruncated,
        valueUrl: token.tokenExplorerUrl,
        clipboardValue: token.address
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
              <TokenIcon 
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
                Tokens
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Browse and search tokens available across the network
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
              <InputLabel id="token-filter-by-label">Filter by</InputLabel>
              <Select
                labelId="token-filter-by-label"
                id="token-filter-by"
                value={filterBy}
                onChange={handleFilterByChange}
                label="Filter by"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value={'symbol'}>Symbol</MenuItem>
                <MenuItem value={'name'}>Name</MenuItem>
                <MenuItem value={'chainId'}>Chain ID</MenuItem>
                <MenuItem value={'address'}>Address</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              placeholder="Enter token details..."
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
