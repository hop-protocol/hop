import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { CustomSelect } from './CustomSelect.js'
import { CustomMenuItem } from './CustomMenuItem.js'

export function NetworkSelect({ network, setNetwork }) {
  const handleChange = (event) => {
    setNetwork(event.target.value)
  }

  return (
    <FormControl fullWidth>
      <InputLabel 
        id="network-select-label"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper,
          paddingLeft: '4px',
          paddingRight: '4px',
          borderRadius: '4px',
          fontSize: '0.9rem',
          transform: 'translate(10px, -9px) scale(0.75)',
          '&.Mui-focused': {
            color: theme.palette.primary.main
          }
        })}
      >
        Network
      </InputLabel>
      <CustomSelect
        labelId="network-select-label"
        id="network-select"
        value={network}
        label="Network"
        onChange={handleChange}
      >
        <CustomMenuItem value="sepolia">Sepolia</CustomMenuItem>
        <CustomMenuItem value="mainnet" disabled={true}>Mainnet</CustomMenuItem>
      </CustomSelect>
    </FormControl>
  )
}
