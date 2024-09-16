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
import tokenListJson from './tokenlist.json'

function generateTokenListFromJson(tokenListJson: any) {
  // Parse the tokens from the provided JSON input
  const tokens = tokenListJson.tokens.map((token: any) => ({
    chainId: token.chainId,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logoURI,
  }));

  return tokens;
}

const tokenList = generateTokenListFromJson(tokenListJson);

export const TokenListModal = ({ onTokenSelect }: { onTokenSelect: (token: any) => void }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredTokens, setFilteredTokens] = useState(tokenList)
  const [chainFilter, setChainFilter] = useState('') // Chain ID filter

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Function to handle the search and filtering logic
  useEffect(() => {
    const searchLower = search.toLowerCase()
    const filtered = tokenList.filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(searchLower) ||
        token.symbol.toLowerCase().includes(searchLower) ||
        token.address.toLowerCase().includes(searchLower)

      const matchesChain = chainFilter ? token.chainId === parseInt(chainFilter) : true

      return matchesSearch && matchesChain
    })
    setFilteredTokens(filtered)
  }, [search, chainFilter])

  const handleChainFilterChange = (event: any) => {
    setChainFilter(event.target.value as string)
  }

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Select Token
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Select a Token</DialogTitle>
        <DialogContent>
          <Box mb={2} display="flex">
            <TextField
              fullWidth
              variant="outlined"
              label="Search Tokens"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, symbol, or address"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Select
                      value={chainFilter}
                      onChange={handleChainFilterChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Chain ID Filter' }}
                      variant="outlined"
                    >
                      <MenuItem value="">All Chains</MenuItem>
                      <MenuItem value="42069">42069</MenuItem>
                      <MenuItem value="11155111">11155111</MenuItem>
                      {/* Add more chainIds as needed */}
                    </Select>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <List>
            {filteredTokens.map((token) => (
              <ListItem
                button
                key={token.address}
                onClick={() => {
                  onTokenSelect(token)
                  handleClose()
                }}
              >
                <ListItemAvatar>
                  <Avatar src={token.logoURI} alt={token.symbol} />
                </ListItemAvatar>
                <ListItemText primary={token.name} secondary={`${token.symbol} (Chain ID: ${token.chainId})`} />
              </ListItem>
            ))}
          </List>
          {filteredTokens.length === 0 && (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                No tokens found.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
