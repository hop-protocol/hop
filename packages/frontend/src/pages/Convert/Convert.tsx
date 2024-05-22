import Box from '@mui/material/Box'
import ConvertContent from '#pages/Convert/ConvertContent.js'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import RaisedSelect from '#components/selects/RaisedSelect.js'
import React, { FC, useEffect } from 'react'
import SelectOption from '#components/selects/SelectOption.js'
import Typography from '@mui/material/Typography'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { findMatchingBridge } from '#utils/index.js'
import { l2Networks } from '#config/networks.js'
import { makeStyles } from '@mui/styles'
import { useApp } from '#contexts/AppContext/index.js'
import { useConvert } from '#pages/Convert/ConvertContext.js'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem !important',
  },
  selects: {
    marginBottom: '4.4rem',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  select: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 1rem 1rem',
  },
  help: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '1rem',
  },
  box: {
    marginBottom: '4.2rem',
  },
}))

const Convert: FC = () => {
  const styles = useStyles()
  const { bridges, selectedBridge, setSelectedBridge } = useApp()
  const { convertOptions, selectedNetwork, selectBothNetworks, viaParamValue, setViaParamValue } = useConvert()
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const { via } = useParams<{ via: string }>()

  useEffect(() => {
    if (!via) {
      navigate(`/convert/${viaParamValue}${search}`)
    }
  }, [viaParamValue, navigate])

  const handleBridgeChange = (event: any) => {
    const tokenSymbol = event.target.value as string

    const bridge = findMatchingBridge(bridges, tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  const handleTabChange = (event: any) => {
    const value = event.target.value as string
    setViaParamValue(value)
    navigate(`/convert/${value}${search}`)
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Convert
        </Typography>
      </Box>
      <Grid className={styles.selects}>
        <div className={styles.select}>
          <RaisedSelect value={selectedNetwork?.slug} onChange={selectBothNetworks}>
            {l2Networks.map(network => (
              <MenuItem value={network.slug} key={network.slug}>
                <SelectOption value={network.slug} icon={network.imageUrl} label={network.name} />
              </MenuItem>
            ))}
          </RaisedSelect>
        </div>

        <div className={styles.select}>
          <RaisedSelect value={selectedBridge?.getTokenSymbol()} onChange={handleBridgeChange}>
            {bridges.map(bridge => (
              <MenuItem value={bridge.getTokenSymbol()} key={bridge.getTokenSymbol()}>
                <SelectOption
                  value={bridge.getTokenSymbol()}
                  icon={bridge.getTokenImage()}
                  label={bridge.getTokenSymbol()}
                />
              </MenuItem>
            ))}
          </RaisedSelect>
        </div>

        <div className={styles.select}>
          <RaisedSelect value={viaParamValue} onChange={handleTabChange}>
            {convertOptions.map(_convertOption => (
              <MenuItem value={_convertOption.path} key={_convertOption.path}>
                via {_convertOption.name}
              </MenuItem>
            ))}
          </RaisedSelect>
          <div className={styles.help}>
            <InfoTooltip
              title={
                <>
                  <ul>
                    <li>Use "via AMM" to swap between the canonical token and hToken on L2.</li>
                    <li>
                      Use "via Hop Bridge" to send hToken from L2 to Ethereum to receive canonical
                      token on Ethereum, or to send canonical token from Ethereum and receive hToken
                      on L2.
                    </li>
                  </ul>
                </>
              }
            />
          </div>
        </div>
      </Grid>
      <div className={styles.box}>
        <ConvertContent />
      </div>
    </Box>
  )
}

export default Convert
