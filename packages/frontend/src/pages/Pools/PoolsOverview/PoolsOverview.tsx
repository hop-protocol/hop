import React, { ChangeEvent } from 'react'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import InfoTooltip from 'src/components/InfoTooltip'
import Skeleton from '@material-ui/lab/Skeleton'
import Typography from '@material-ui/core/Typography'
import { PoolRow } from './PoolRow'
import { StakingRewardsClaim } from '../PoolDetails/StakingRewardsClaim'
import { makeStyles } from '@material-ui/core/styles'
import { usePools } from './usePools'

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
  header: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
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
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '1rem'
  },
  chip: {
    padding: '0.5rem 1rem',
    background: theme.palette.type === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '1rem',
    cursor: 'pointer'
  },
  chipImage: {
    width: '18px'
  }
}))

function Chip(props: any) {
  const styles = useStyles()
  const { label, icon, onDelete } = props

  return (
    <Box mr={1} onClick={onDelete} display="flex" justifyContent="center" alignItems="center" className={styles.chip}>
      <Box mr={0.5} display="flex" justifyContent="center" alignItems="center">
        <img className={styles.chipImage} src={icon} alt={label} title={label} />
      </Box>
      <Box mr={0.5} display="flex" justifyContent="center" alignItems="center">
        <Typography variant="body1">
        {label}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="secondary">
          ×
        </Typography>
      </Box>
    </Box>
  )
}

export function PoolsOverview () {
  const styles = useStyles()
  const { pools, userPools, filterTokens, filterChains, toggleFilterToken, toggleFilterChain, toggleColumnSort, isAccountLoading } = usePools()

  function handleTokenToggleFilterFn (symbol: string) {
    return (event: ChangeEvent<{}>) => {
      event.preventDefault()
      toggleFilterToken(symbol)
    }
  }

  function handleChainToggleFilterFn (slug: string) {
    return (event: ChangeEvent<{}>) => {
      event.preventDefault()
      toggleFilterChain(slug)
    }
  }

  function handleColumnSortFn(column: string) {
    return (event: ChangeEvent<{}>) => {
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

      {(userPools.length > 0 || isAccountLoading) && (
        <Box className={styles.box} p={4} mb={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} className={styles.header}>
            <Box p={1} textAlign="left">
              <Typography variant="h5">
                <Box display="flex" alignItems="center">
                  My Pools <InfoTooltip title="The pools the connected account has deposited into" />
                </Box>
              </Typography>
            </Box>
            <StakingRewardsClaim
              claimAll={true}
            />
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
                        Total APR <InfoTooltip title="Total APR is AMM APR + highest staking rewards APR. Hover over row APR to see breakdown." />
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
                {(!userPools.length || isAccountLoading) && (
                    <>
                    <tr>
                      <td colSpan={2}>
                        <Skeleton animation="wave" width={'100%'} title="loading" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Skeleton animation="wave" width={'100%'} title="loading" />
                      </td>
                    </tr>
                    </>
                )}
                </tbody>
            </table>
          </Box>
          <Typography variant="body2" color="secondary">
            <Box display="flex" alignItems="left" justifyContent="left" marginTop="20px">
              * All APRs for ETH staking derivative pools include the underlying ETH staking APR.
            </Box>
          </Typography>
        </Box>
      )}
      <Box className={styles.box} p={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} overflow="auto" className={styles.header}>
          <Box p={1} textAlign="left">
            <Typography variant="h5">
              <Box display="flex" alignItems="center">
                All Pools <InfoTooltip title="All the pools you can deposit into" />
              </Box>
            </Typography>
          </Box>
          <Box display="flex" className={styles.filters}>
            <Box display="flex" className={styles.chips}>
              {filterTokens.filter((x: any) => !x.enabled).map((x: any, i: number) => {
                return (
                  <Chip
                      key={i}
                      label={x.symbol}
                      icon={x.imageUrl}
                      onDelete={handleTokenToggleFilterFn(x.symbol)}
                    />
                )
              })}
              {filterChains.filter((x: any) => !x.enabled).map((x: any, i: number) => {
                return (
                  <Chip
                      key={i}
                      label={x.name}
                      icon={x.imageUrl}
                      onDelete={handleChainToggleFilterFn(x.slug)}
                    />
                )
              })}
            </Box>
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
                {filterTokens.filter((x: any) => x.enabled).map((x: any, i: number) => {
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
                {filterChains.filter((x: any) => x.enabled).map((x: any, i: number) => {
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
                       Total APR <InfoTooltip title="Total APR is AMM APR + highest staking rewards APR. Hover over row APR to see breakdown." />
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
            {!pools.length && (
              <>
              <tr>
                <td colSpan={2}>
                  <Skeleton animation="wave" width={'100%'} title="loading" />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton animation="wave" width={'100%'} title="loading" />
                </td>
              </tr>
              </>
            )}
            </tbody>
          </table>
          <Typography variant="body2" color="secondary" title="Tokens in pool">
            <Box display="flex" alignItems="left" justifyContent="left" marginTop="20px">
              * All APRs for ETH staking derivative pools include the underlying ETH staking APR.
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
