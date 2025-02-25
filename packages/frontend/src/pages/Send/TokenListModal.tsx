import React, { useState, useEffect } from 'react'
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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { useTokenList } from './useTokenList.js'
import { CustomTokenListManager } from './CustomTokenListManager.js'

type Props = {
  onTokenSelect: (token: any) => void
  value?: any
  selectedChainId?: string
  excludeChainId?: string
  selectedTokenSymbol?: string
  clear?: boolean
  selectLabel?: string
}

export const TokenListModal = ({ onTokenSelect, selectedChainId, excludeChainId, selectedTokenSymbol, clear, value, selectLabel }: Props) => {
  let {
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

  if (selectedTokenSymbol) {
    filteredTokens = filteredTokens.filter(item => {
      return item.symbol === selectedTokenSymbol
    })
  }

  if (excludeChainId) {
    filteredTokens = filteredTokens.filter(item => {
      return item.chainId?.toString() !== excludeChainId?.toString()
    })
  }

  const [showManager, setShowManager] = useState(false)  // Toggle between token list UI and manager
  const [selectedToken, setSelectedToken] = useState<any>(null)

  useEffect(() => {
    if (value) {
      setSelectedToken(value)
    }
  }, [value])

  useEffect(() => {
    if (clear) {
      setSelectedToken(null)
    }
  }, [clear])

  const networkOptions = [
    { value: '', label: 'All Chains', logo: 'https://gist.github.com/user-attachments/assets/7d344fcb-6463-4ae1-a311-c89af12a99ba' },
    // { value: '42069', label: 'Hop Hub Sepolia', logo: 'https://assets.hop.exchange/logos/hop.svg' },
    { value: '11155111', label: 'Ethereum Sepolia', logo: 'https://assets.hop.exchange/logos/ethereum.svg' },
    { value: '84532', label: 'Base Sepolia', logo: 'https://assets.hop.exchange/logos/base.svg' },
    { value: '11155420', label: 'Optimism Sepolia', logo: 'https://assets.hop.exchange/logos/optimism.svg' },
  ]

  const selectedTokenChainLogo = selectedToken && networkOptions.find(option => option.value === selectedToken?.chainId?.toString())?.logo

  function renderTokenList(list: any[]) {
      return list.map((token) => {
        const chainLogo = networkOptions.find(option => option.value === token.chainId?.toString())?.logo
        return (
          <ListItem
            button
            key={`${token.address}-${token.chainId}-${token.balanceUsd}`}
            onClick={() => {
              onTokenSelect(token)
              setSelectedToken(token)
              handleClose()
            }}
            sx={{ justifyContent: 'space-between', width: '100%' }}
          >
            <Box display="flex" alignItems="center" position="relative">
              <ListItemAvatar>
                <Box position="relative" width="46px">
                  <Avatar src={token.logoURI} alt={token.symbol} sx={{ background: 'white' }} />
                  {(chainLogo && token.chainSlug !== 'ethereum') && (
                    <Avatar
                      src={chainLogo}
                      alt="Chain Logo"
                      title={`Chain ID: ${token.chainId}`}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 22,
                        height: 22,
                        background: token.chainPrimaryColor || 'white',
                        borderRadius: '4px'
                      }}
                    />
                  )}
                </Box>
              </ListItemAvatar>

              <ListItemText
                primary={token.name}
                secondary={`${token.symbol} on ${token.chainName}`}
              />
            </Box>

            {!!token.balanceFormatted && (
              <Box textAlign="right">
                <Typography variant="body1">
                  {token.balanceUsdDisplay}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {token.balanceFormatted}
                </Typography>
              </Box>
            )}
          </ListItem>
        )
      })
  }

  return (
    <>
      <Button onClick={handleOpen} endIcon={<KeyboardArrowDownIcon />} sx={{
        background: selectedToken ? 'rgb(255, 255, 255)' : 'linear-gradient(99.85deg, rgb(179, 46, 255) -18.29%, rgb(242, 164, 152) 109.86%) !important',
        border: '1px solid 1px solid rgba(34, 34, 34, 0.07)',
        color: selectedToken ? 'black' : 'white',
        justifyContent: 'space-between',
        padding: '1rem 3rem'
      }}>
        {selectedToken ? (
        <Box display="flex" alignItems="center">
          <Box position="relative" width="32px">
            <Avatar src={selectedToken.logoURI} alt={selectedToken.symbol} sx={{ height: '24px', width: '24px', background: 'white' }} />
            {(selectedTokenChainLogo && selectedToken.chainSlug !== 'ethereum') && (
              <Avatar
                src={selectedTokenChainLogo}
                alt="Chain Logo"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 4,
                  width: 14,
                  height: 14,
                  border: '1px solid white',
                  background: selectedToken.chainPrimaryColor || 'white',
                  borderRadius: '4px'
                }}
              />
            )}
          </Box>
          <Typography variant="body1" sx={{ color: 'black' }}>{selectedToken.symbol}</Typography>
        </Box>
        ) : (
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>{selectLabel ?? 'Select token'}</Typography>
        )}
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '24px',
            maxWidth: '450px',
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
              <Box mb={2} display="flex" sx={{
                padding: '0 2rem',
                position: 'sticky',
                top: 0, // Keep it at the top
                zIndex: 10,
              }}>
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

              <DialogContent sx={{ padding: 0, overflowY: 'auto', flexGrow: 1, maxHeight: '475px' }}>

                {!!search && (
                  <Box display="flex" alignItems="center" sx={{ padding: '0 2rem', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#FDF7F9' }} className="sticky">
                    <Typography variant="body1" color="secondary" fontWeight="bold" alignItems="center" display="flex">
                      <><SearchIcon style={{ marginRight: '0.5rem' }} /> Search results</>
                    </Typography>
                  </Box>
                )}

                {!search && filteredTokens.filter((item: any) => item.balanceUsd).length > 0 && (
                  <>
                  <Box display="flex" alignItems="center" sx={{ padding: '0 2rem', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#FDF7F9' }} className="sticky">
                    <Typography variant="body1" color="secondary" fontWeight="bold" alignItems="center" display="flex">
                      <><MonetizationOnIcon style={{ marginRight: '0.5rem' }} /> Your tokens</>
                    </Typography>
                  </Box>
                  </>
                )}

                <List>
                  {renderTokenList(filteredTokens.filter((item: any) => item.balanceUsd))}
                </List>

                {!search && filteredTokens.filter((item: any) => !item.balanceUsd).length > 0 && (
                  <>
                  <Box display="flex" alignItems="center" sx={{ padding: '0 2rem', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#FDF7F9' }} className="sticky">
                    <Typography variant="body1" color="secondary" fontWeight="bold" alignItems="center" display="flex">
                      <><StarIcon style={{ marginRight: '0.5rem' }} /> Tokens</>
                    </Typography>
                  </Box>

                  </>
                )}

                <List>
                  {renderTokenList(filteredTokens.filter((item: any) => !item.balanceUsd))}
                </List>

                <List>
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

