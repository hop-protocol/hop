import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import SelectOption from 'src/components/selects/SelectOption'

function SendHeader(props: any) {
  const { styles, bridges, selectedBridge, handleBridgeChange } = props

  return (
    <div className={styles.header}>
      <Box display="flex" alignItems="center" className={styles.sendSelect}>
        <Typography variant="h4" className={styles.sendLabel}>
          Send
        </Typography>
        <RaisedSelect value={selectedBridge?.getTokenSymbol()} onChange={handleBridgeChange}>
          {bridges.map((bridge: any) => (
            <MenuItem value={bridge.getTokenSymbol()} key={bridge.getTokenSymbol()}>
              <SelectOption
                value={bridge.getTokenSymbol()}
                icon={bridge.getTokenImage()}
                label={bridge.getTokenSymbol()}
              />
            </MenuItem>
          ))}
        </RaisedSelect>
      </Box>
    </div>
  )
}

export default SendHeader
