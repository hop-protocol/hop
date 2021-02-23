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
import RaisedSelect from 'src/components/selects/RaisedSelect'
import MenuItem from '@material-ui/core/MenuItem'
import ConvertViaHopBridge from 'src/pages/Convert/ConvertViaHopBridge'
import ConvertViaCanonicalBridge from 'src/pages/Convert/ConvertViaCanonicalBridge'
import ConvertViaUniswap from 'src/pages/Convert/ConvertViaUniswap'
import Token from 'src/models/Token'
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
    tokens,
    selectedToken,
    setSelectedToken,
    l2Networks,
    selectedNetwork,
    setSelectedNetwork
  } = useConvert()
  const { pathname } = useLocation()
  const { path } = useRouteMatch()
  const history = useHistory()

  const handleTokenChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const token = tokens.find((token: Token) => token.symbol === tokenSymbol)
    if (token) {
      setSelectedToken(token)

      if (!token?.supportedNetworks?.includes(selectedNetwork?.slug || '')) {
        const network = l2Networks.find((network: Network) =>
          token.supportedNetworks.includes(network.slug)
        )
        if (network) {
          setSelectedNetwork(network)
        }
      }
    }
  }

  const handleNetworkChange = (event: ChangeEvent<{ value: unknown }>) => {
    const slug = event.target.value as string
    const network = l2Networks.find((network: Network) => network.slug === slug)
    if (network) {
      setSelectedNetwork(network)

      if (!selectedToken?.supportedNetworks?.includes(network?.slug || '')) {
        const token = tokens.find((token: Token) =>
          token.supportedNetworks.includes(network.slug)
        )
        if (token) {
          setSelectedToken(token)
        }
      }
    }
  }

  const lastPathname = pathname.replace(path, '') || '/bridge'
  const handleTabChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string
    history.push(`${path}${value}`)
  }

  const tabs = [
    { label: 'via Hop Bridge', value: '/hop' },
    { label: 'via Canonical Bridge', value: '/bridge' },
    { label: 'via Uniswap', value: '/uniswap' }
  ]

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
            value={selectedToken?.symbol}
            onChange={handleTokenChange}
          >
            {tokens.map(token => (
              <MenuItem value={token.symbol} key={token.symbol}>
                {token.symbol}
              </MenuItem>
            ))}
          </RaisedSelect>
        </div>
        <div className={styles.select}>
          <RaisedSelect value={lastPathname} onChange={handleTabChange}>
            {tabs.map(tab => (
              <MenuItem value={tab.value} key={tab.value}>
                {tab.label}
              </MenuItem>
            ))}
          </RaisedSelect>
        </div>
        <div className={styles.select}>
          <RaisedSelect
            value={selectedNetwork?.slug}
            onChange={handleNetworkChange}
          >
            {l2Networks.map(network => (
              <MenuItem value={network.slug} key={network.slug}>
                on {network.name}
              </MenuItem>
            ))}
          </RaisedSelect>
        </div>
      </Grid>
      <Switch>
        <Route path={`${path}/hop`}>
          <div className={styles.box}>
            <ConvertViaHopBridge />
          </div>
        </Route>
        <Route path={`${path}/bridge`}>
          <div className={styles.box}>
            <ConvertViaCanonicalBridge />
          </div>
        </Route>
        <Route path={`${path}/uniswap`}>
          <div className={styles.box}>
            <ConvertViaUniswap />
          </div>
        </Route>
        <Redirect to={`${path}/hop`} />
      </Switch>
    </Box>
  )
}

export default Convert
