import React from 'react'
import { usePools } from './usePools'
import Box from '@material-ui/core/Box'
import { PoolRow } from './PoolRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import InfoTooltip from 'src/components/InfoTooltip'

export const useStyles = makeStyles(theme => ({
  box: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    borderRadius: '3rem',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '1rem',
      paddingRight: '1rem'
    },
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  thLink: {
    cursor: 'pointer',
    textDecoration: 'none'
  },
  filters: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  filterImageContainer: {

  },
  filterImage: {
    width: '18px',
    '&[data-disabled="true"]': {
       filter: 'grayscale(0.8)'
    }
  },
  hideMobile: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  }
}))

export function PoolsOverview () {
  const styles = useStyles()
  const { pools, userPools, filterTokens, filterChains, toggleFilterToken, toggleFilterChain, toggleColumnSort } = usePools()

  function handleTokenToggleFilterFn (symbol: string) {
    return (event: any) => {
      event.preventDefault()
      toggleFilterToken(symbol)
    }
  }

  function handleChainToggleFilterFn (slug: string) {
    return (event: any) => {
      event.preventDefault()
      toggleFilterChain(slug)
    }
  }

  function handleColumnSortFn(column: string) {
    return (event: any) => {
      event.preventDefault()
      toggleColumnSort(column)
    }
  }

  return (
    <Box maxWidth={"900px"} m={"0 auto"}>
      <Box mb={4} p={1} textAlign="left">
        <Typography variant="h4">
          Add liquidity to earn trading fees and rewards.
        </Typography>
      </Box>
      {userPools.length > 0 && (
        <Box className={styles.box} p={4} mb={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box p={1} textAlign="left">
              <Typography variant="h5">
                <Box display="flex" alignItems="center">
                  My Pools <InfoTooltip title="The pools the connected account has deposited into" />
                </Box>
              </Typography>
            </Box>
          </Box>
          <Box overflow="auto">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <Box p={1} textAlign="left">
                      <Typography variant="subtitle2" color="secondary">
                        Pool
                      </Typography>
                    </Box>
                  </th>
                  <th>
                    <Box p={1} textAlign="left">
                      <Typography variant="subtitle2" color="secondary">
                      <Box display="flex" alignItems="center">
                        My Liquidity <InfoTooltip title="Your pool position value in USD" />
                      </Box>
                      </Typography>
                    </Box>
                  </th>
                  <th className={styles.hideMobile}>
                    <Box p={1} textAlign="left">
                      <Typography variant="subtitle2" color="secondary">
                      <Box display="flex" alignItems="center">
                        TVL <InfoTooltip title="Total Value Locked; the total number of tokens that are in the pool, shown in USD" />
                      </Box>
                      </Typography>
                    </Box>
                  </th>
                  <th className={styles.hideMobile}>
                    <Box p={1} textAlign="left">
                      <Typography variant="subtitle2" color="secondary">
                      <Box display="flex" alignItems="center">
                        Total APR <InfoTooltip title="Total APR is AMM APR + any staking rewards APR" />
                      </Box>
                      </Typography>
                    </Box>
                  </th>
                  <th>
                    <Box p={1} textAlign="left">
                      <Typography variant="subtitle2" color="secondary">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        Action <InfoTooltip title="Deposit into pool or withdraw from pool" />
                      </Box>
                      </Typography>
                    </Box>
                  </th>
                </tr>
                </thead>
                <tbody>
                {userPools.map((data: any, i: number) => {
                  return (
                    <PoolRow key={i} data={data} />
                  )
                })}
                </tbody>
            </table>
          </Box>
        </Box>
      )}
      <Box className={styles.box} p={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} overflow="auto">
          <Box p={1} textAlign="left">
            <Typography variant="h5">
              <Box display="flex" alignItems="center">
                All Pools <InfoTooltip title="All the pools you can deposit into" />
              </Box>
            </Typography>
          </Box>
          <Box display="flex" className={styles.filters}>
            <Box display="flex" alignItems="center" mr={2}>
              <Box display="flex" alignItems="center" mr={1}>
                <Box display="flex" alignItems="center">
                  <InfoTooltip title="Filter table by selected tokens" />
                </Box>
                <Typography variant="subtitle2">
                  Tokens:
                </Typography>
              </Box>
              <Box display="flex">
                {filterTokens.map((x, i: number) => {
                  return (
                    <Box key={i} display="flex" className={styles.filterImageContainer}>
                      <IconButton onClick={handleTokenToggleFilterFn(x.symbol)} size="small" >
                        <img className={styles.filterImage} src={x.imageUrl} alt={x.symbol} data-disabled={!x.enabled} title={x.symbol} />
                      </IconButton>
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center">
                <Box display="flex" alignItems="center">
                  <InfoTooltip title="Filter table by selected networks" />
                </Box>
                <Typography variant="subtitle2">
                  Networks:
                </Typography>
              </Box>
              <Box display="flex">
                {filterChains.map((x: any, i: number) => {
                  return (
                    <Box key={i} display="flex" className={styles.filterImageContainer}>
                      <IconButton onClick={handleChainToggleFilterFn(x.slug)} size="small">
                        <img className={styles.filterImage} src={x.imageUrl} alt={x.name} data-disabled={!x.enabled} title={x.name} />
                      </IconButton>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box overflow="auto">
          <table className={styles.table}>
            <thead>
            <tr>
              <th>
                <Box p={1} textAlign="left">
                  <Typography variant="subtitle2" color="secondary">
                    Pool
                  </Typography>
                </Box>
              </th>
              <th className={styles.hideMobile}>
                <Box p={1} textAlign="left">
                  <a className={styles.thLink} onClick={handleColumnSortFn('userBalance')}>
                    <Typography variant="subtitle2" color="secondary">
                     <Box display="flex" alignItems="center">
                       My Liquidity <InfoTooltip title="Your pool position value in USD" />
                     </Box>
                    </Typography>
                  </a>
                </Box>
              </th>
              <th className={styles.hideMobile}>
                <Box p={1} textAlign="left">
                  <a className={styles.thLink} onClick={handleColumnSortFn('tvl')}>
                    <Typography variant="subtitle2" color="secondary">
                     <Box display="flex" alignItems="center">
                      TVL <InfoTooltip title="Total Value Locked; the total number of tokens that are in the pool, shown in USD" />
                     </Box>
                    </Typography>
                  </a>
                </Box>
              </th>
              <th>
                <Box p={1} textAlign="left">
                  <a className={styles.thLink} onClick={handleColumnSortFn('totalApr')}>
                    <Typography variant="subtitle2" color="secondary">
                     <Box display="flex" alignItems="center">
                       Total APR <InfoTooltip title="Total APR is AMM APR + any staking rewards APR" />
                     </Box>
                    </Typography>
                  </a>
                </Box>
              </th>
              <th>
                <Box p={1} textAlign="left">
                  <Typography variant="subtitle2" color="secondary">
                    <Box display="flex" alignItems="center" justifyContent="center">
                     Action <InfoTooltip title="Deposit into pool" />
                    </Box>
                  </Typography>
                </Box>
              </th>
            </tr>
            </thead>
            <tbody>
            {pools.map((data: any, i: number) => {
              return (
                <PoolRow key={i} data={data} isAllPools />
              )
            })}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  )
}
