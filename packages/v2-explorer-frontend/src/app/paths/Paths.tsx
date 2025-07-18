'use client'
import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { useFetchPaths } from '@/app/hooks/useFetchPaths'
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
import { useTheme } from '@/app/hooks/useTheme'
import { useQueryParams } from '@/app/hooks/useQueryParams'
import Paper from '@mui/material/Paper'
import RoutesIcon from '@mui/icons-material/Route'

export function Paths () {
  const { theme, dark: isDarkMode } = useTheme()
  const { queryParams, updateQueryParams } = useQueryParams()
  const [filterBy, setFilterBy] = useState('pathId')
  const [filterValue, setFilterValue] = useState(queryParams.pathId || '')
  const filter = { [filterBy]: filterValue }
  const { paths, loading, error, nextPage, previousPage, showNextButton, showPreviousButton, limit } = useFetchPaths(filter)
  console.log(paths)

  useEffect(() => {
    updateQueryParams({ pathId: undefined })
  }, [])

  const headers = [
    {
      key: 'index',
      value: '#'
    },
    {
      key: 'pathId',
      value: 'Path ID'
    },
    {
      key: 'chainId',
      value: 'Chain ID'
    },
    {
      key: 'token',
      value: 'Token'
    },
    {
      key: 'counterpartChainId',
      value: 'Counterpart Chain ID'
    },
    {
      key: 'counterpartToken',
      value: 'Counterpart Token'
    },
    {
      key: 'details',
      value: 'Details'
    },
  ]

  const rows = paths.map((path: any) => {
    return [
      {
        key: 'index',
        value: path.i
      },
      {
        key: 'pathId',
        value: path.pathIdTruncated,
        valueUrl: `/p/${path.pathId}`,
        clipboardValue: path.pathId,
      },
      {
        key: 'chainId',
        value: path.chainLabel,
        valueUrl: path.chainExplorerUrl,
        imageUrl: path.chainImageUrl,
        clipboardValue: path.chainId
      },
      {
        key: 'token',
        value: `${path.tokenSymbol ? `(${path.tokenSymbol}) ` : ''} ${path.tokenTruncated}`,
        valueUrl: path.tokenExplorerUrl,
        imageUrl: path.tokenImageUrl,
        clipboardValue: path.token
      },
      {
        key: 'counterpartChainId',
        value: path.counterpartChainLabel,
        valueUrl: path.counterpartChainExplorerUrl,
        imageUrl: path.counterpartChainImageUrl,
        clipboardValue: path.counterpartChainId
      },
      {
        key: 'counterpartToken',
        value: `${path.counterpartTokenSymbol ? `(${path.counterpartTokenSymbol}) ` : ''}${path.counterpartTokenTruncated}`,
        valueUrl: path.counterpartTokenExplorerUrl,
        imageUrl: path.counterpartTokenImageUrl,
        clipboardValue: path.counterpartToken
      },
      {
        key: 'details',
        value: 'View Details',
        valueUrl: `/p/${path.pathId}`,
        button: true
      },
    ]
  })

  function handleFilterByChange (event: any) {
    setFilterBy(event.target.value)
  }

  // Helper function to get appropriate placeholder text based on filter
  const getPlaceholderText = () => {
    switch(filterBy) {
      case 'pathId':
        return 'Enter path ID';
      case 'token':
      case 'counterpartToken':
        return 'Enter 0x...';
      case 'chainId':
      case 'counterpartChainId':
        return 'Enter chain ID';
      default:
        return 'Enter value';
    }
  }

  return (
    <Box width="100%" maxWidth="1400px">
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
              <RoutesIcon 
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
                Paths
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              View cross-chain network path information
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
              <InputLabel id="path-filter-by-label">Filter by</InputLabel>
              <Select
                labelId="path-filter-by-label"
                id="path-filter-by"
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
                <MenuItem value={'chainId'}>Chain ID</MenuItem>
                <MenuItem value={'counterpartChainId'}>Counterpart Chain ID</MenuItem>
                <MenuItem value={'token'}>Token</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              placeholder={getPlaceholderText()}
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
