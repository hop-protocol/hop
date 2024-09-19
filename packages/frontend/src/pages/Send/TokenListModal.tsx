import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckIcon from '@mui/icons-material/Check'
import ListItemIcon from '@mui/material/ListItemIcon'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import StarIcon from '@mui/icons-material/Star'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTokenList } from './useTokenList'
import { CustomTokenListManager } from './CustomTokenListManager'

export const TokenListModal = ({ onTokenSelect, selectedChainId = '' }: { onTokenSelect: (token: any) => void, selectedChainId: string }) => {
  const {
    open,
    search,
    filteredTokens,
    chainFilter,
    handleOpen,
    handleClose,
    setSearch,
    handleChainFilterChange,
    customTokenListUrl,
  } = useTokenList(selectedChainId)

  const [showManager, setShowManager] = useState(false)  // Toggle between token list UI and manager

  const networkOptions = [
    { value: '', label: 'All Chains', logo: 'https://gist.github.com/user-attachments/assets/7d344fcb-6463-4ae1-a311-c89af12a99ba' },
    { value: '42069', label: 'Hop Hub Sepolia', logo: 'https://assets.hop.exchange/logos/hop.svg' },
    { value: '11155111', label: 'Ethereum Sepolia', logo: 'https://assets.hop.exchange/logos/ethereum.svg' },
    { value: '84532', label: 'Base Sepolia', logo: 'https://assets.hop.exchange/logos/base.svg' },
  ]

  return (
    <>
      <Button variant="outlined" onClick={handleOpen} endIcon={<KeyboardArrowDownIcon />}>
        Select Token
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '24px',
            maxWidth: '400px',
            minHeight: '300px',
            maxHeight: '700px'
          }
        }}
      >
        <DialogTitle>
          {showManager ? 'Manage Token List' : 'Select a Token'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {showManager ? (
            <CustomTokenListManager />
          ) : (
            <>
              <Box mb={2} display="flex" sx={{ padding: '0 2rem', flexShrink: 0 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, symbol, or address"
                  InputLabelProps={{ shrink: false }}
                  InputProps={{
                    sx: {
                      padding: '1.5rem',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '24px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={chainFilter}
                          onChange={handleChainFilterChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Chain ID Filter' }}
                          variant="outlined"
                          sx={{
                            backgroundColor: '#f0f0f0',
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '&.MuiSelect-root': {
                              padding: 0,
                            },
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                          renderValue={(selected) => {
                            const selectedOption:any = networkOptions.find((option) => option.value === selected) || {}
                            return (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                {selectedOption.logo && (
                                  <Avatar src={selectedOption.logo} style={{ marginRight: '8px', width: 24, height: 24 }} />
                                )}
                              </div>
                            )
                          }}
                        >
                          {networkOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <ListItemIcon>
                                {option.logo && <Avatar src={option.logo} style={{ width: 24, height: 24 }} />}
                              </ListItemIcon>
                              <ListItemText primary={option.label} />
                              {chainFilter === option.value && <CheckIcon style={{ marginLeft: 'auto' }} />}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" sx={{ padding: '0 2rem', flexShrink: 0 }}>
                <Typography variant="body1" color="secondary" fontWeight="bold" alignItems="center" display="flex">
                  {search ? <><SearchIcon style={{ marginRight: '0.5rem' }} /> Search results</> : <><StarIcon style={{ marginRight: '0.5rem' }} /> Tokens</>}
                </Typography>
              </Box>

              <DialogContent sx={{ padding: 0, overflowY: 'auto', flexGrow: 1, maxHeight: '500px' }}>
                <List>
                  {filteredTokens.map((token) => {
                    const chainLogo = networkOptions.find(option => option.value === token.chainId.toString())?.logo
                    return (
                      <ListItem
                        button
                        key={`${token.address}-${token.chainId}`}
                        onClick={() => {
                          onTokenSelect(token)
                          handleClose()
                        }}
                        sx={{ justifyContent: 'space-between', width: '100%' }}
                      >
                        <Box display="flex" alignItems="center" position="relative">
                          <ListItemAvatar>
                            <Box position="relative" width="46px">
                              <Avatar src={token.logoURI} alt={token.symbol} sx={{ background: 'white' }} />
                              {chainLogo && (
                                <Avatar
                                  src={chainLogo}
                                  alt="Chain Logo"
                                  sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: 16,
                                    height: 16,
                                    border: '2px solid white',
                                    background: 'white'
                                  }}
                                />
                              )}
                            </Box>
                          </ListItemAvatar>

                          <ListItemText
                            primary={token.name}
                            secondary={`${token.symbol} (Chain ID: ${token.chainId})`}
                          />
                        </Box>

                        <Box textAlign="right">
                          <Typography variant="body1">
                            {`$${(token.usdValue || 0).toFixed(2)}`}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {`${(token.balance || 0).toFixed(4)}`}
                          </Typography>
                        </Box>
                      </ListItem>
                    )
                  })}

                  {filteredTokens.length === 0 && (
                    <Box mt={2} sx={{ padding: '0 2rem' }} display="flex" justifyContent="center">
                      <Typography variant="body1" color="textSecondary">
                        No results found for <strong>{search}</strong>
                      </Typography>
                    </Box>
                  )}
                </List>
              </DialogContent>
            </>
          )}
        </DialogContent>

        <DialogActions>
          {showManager ? (
            <Button onClick={() => setShowManager(false)} startIcon={<ArrowBackIcon />}>
              Back to Token List
            </Button>
          ) : (
            <Button onClick={() => setShowManager(true)} sx={{ fontSize: '1.2rem' }}>
              Manage Token List
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

