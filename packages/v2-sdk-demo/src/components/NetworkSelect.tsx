import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export function NetworkSelect({ network, setNetwork }) {
  const handleChange = (event) => {
    setNetwork(event.target.value)
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="network-select-label">Network</InputLabel>
      <Select
        labelId="network-select-label"
        id="network-select"
        value={network}
        label="Network"
        onChange={handleChange}
      >
        <MenuItem value="sepolia">Sepolia</MenuItem>
        <MenuItem value="mainnet" disabled={true}>Mainnet</MenuItem>
      </Select>
    </FormControl>
  )
}
