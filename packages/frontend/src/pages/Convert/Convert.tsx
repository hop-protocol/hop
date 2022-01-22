import React, { FC, ChangeEvent } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import { useApp } from 'src/contexts/AppContext'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import SelectOption from 'src/components/selects/SelectOption'
import ConvertContent from 'src/pages/Convert/ConvertContent'
import InfoTooltip from 'src/components/infoTooltip'
import { useConvert } from 'src/pages/Convert/ConvertContext'
import useQueryParams from 'src/hooks/useQueryParams'
import { findMatchingBridge, findNetworkBySlug } from 'src/utils'
import { l2Networks } from 'src/config/networks'

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
  const { convertOptions, selectedNetwork, setSelectedNetwork } = useConvert()
  const { pathname, search } = useLocation()
  const { path } = useRouteMatch()
  const history = useHistory()
  const { updateQueryParams } = useQueryParams()

  const handleBridgeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string

    const bridge = findMatchingBridge(bridges, tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  const handleNetworkChange = (event: ChangeEvent<{ value: unknown }>) => {
    const slug = event.target.value as string
    const network = findNetworkBySlug(slug)
    if (network) {
      updateQueryParams({
        sourceNetwork: network.slug ?? '',
        destNetwork: network.slug ?? '',
      })
      setSelectedNetwork(network)
    }
  }

  const lastPathname = pathname.replace(path, '') || '/amm'
  const handleTabChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string
    history.push({
      pathname: `${path}${value}`,
      search,
    })
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
          <RaisedSelect value={selectedNetwork?.slug} onChange={handleNetworkChange}>
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
          <RaisedSelect value={lastPathname} onChange={handleTabChange}>
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
