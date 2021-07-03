import React, { FC, ChangeEvent } from 'react'
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
  useRouteMatch
} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import { useApp } from 'src/contexts/AppContext'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import SelectOption from 'src/components/selects/SelectOption'
import ConvertContent from 'src/pages/Convert/ConvertContent'
import Network from 'src/models/Network'
import { useConvert } from 'src/pages/Convert/ConvertContext'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem'
  },
  selects: {
    marginBottom: '4.4rem',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      textAlign: 'center'
    }
  },
  select: {
    display: 'block',
    marginLeft: '1rem',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0',
      marginBottom: '1rem'
    }
  },
  box: {
    marginBottom: '4.2rem'
  }
}))

const Convert: FC = () => {
  const styles = useStyles()
  const {
    bridges,
    selectedBridge,
    setSelectedBridge
  } = useApp()
  const {
    convertOptions,
    l2Networks,
    selectedNetwork,
    setSelectedNetwork
  } = useConvert()
  const { pathname, search } = useLocation()
  const { path } = useRouteMatch()
  const history = useHistory()

  const handleBridgeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const bridge = bridges.find(bridge => bridge.getTokenSymbol() === tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  const handleNetworkChange = (event: ChangeEvent<{ value: unknown }>) => {
    const slug = event.target.value as string
    const network = l2Networks.find((network: Network) => network.slug === slug)
    if (network) {
      setSelectedNetwork(network)
    }
  }

  const lastPathname = pathname.replace(path, '') || '/bridge'
  const handleTabChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string
    history.push({
      pathname: `${path}${value}`,
      search
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
          <RaisedSelect
            value={selectedNetwork?.slug}
            onChange={handleNetworkChange}
          >
            {l2Networks.map(network => (
              <MenuItem value={network.slug} key={network.slug}>
                <SelectOption
                  value={network.slug}
                  icon={network.imageUrl}
                  label={network.name}
                />
              </MenuItem>
            ))}
          </RaisedSelect>
        </div>
        <div className={styles.select}>
          <RaisedSelect
            value={selectedBridge?.getTokenSymbol()}
            onChange={handleBridgeChange}
          >
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
        </div>
      </Grid>
      <div className={styles.box}>
        <ConvertContent />
      </div>
    </Box>
  )
}

export default Convert
