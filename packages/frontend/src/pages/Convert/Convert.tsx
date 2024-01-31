import Box from '@mui/material/Box'
import ConvertContent from 'src/pages/Convert/ConvertContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import React, { FC, useEffect } from 'react'
import SelectOption from 'src/components/selects/SelectOption'
import Typography from '@mui/material/Typography'
import { InfoTooltip } from 'src/components/InfoTooltip'
import { findMatchingBridge } from 'src/utils'
import { l2Networks } from 'src/config/networks'
import { makeStyles } from '@mui/styles'
import { useApp } from 'src/contexts/AppContext'
import { useConvert } from 'src/pages/Convert/ConvertContext'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem',
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
  const { via } = useParams()

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
