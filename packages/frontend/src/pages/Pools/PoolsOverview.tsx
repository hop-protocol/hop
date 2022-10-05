import React from 'react'
import { usePools } from './usePools'
import Box from '@material-ui/core/Box'
import { PoolRow } from './PoolRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  box: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    borderRadius: '3rem'
  },
  table: {
    width: '100%'
  }
}))

export function PoolsOverview () {
  const styles = useStyles()
  const { pools, userPools } = usePools()

  return (
    <Box maxWidth={"800px"} m={"0 auto"}>
      {userPools.length > 0 && (
        <Box className={styles.box} p={4} mb={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" pb={2}>
            <Box p={1} textAlign="left">
              <Typography variant="h5">
                My Pools
              </Typography>
            </Box>
          </Box>
          <Box overflow="auto">
            <table className={styles.table}>
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
                    My Liquidity
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box p={1} textAlign="left">
                    <Typography variant="subtitle2" color="secondary">
                    TVL
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box p={1} textAlign="left">
                    <Typography variant="subtitle2" color="secondary">
                    Total APR
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box p={1} textAlign="left">
                    <Typography variant="subtitle2" color="secondary">
                    Action
                    </Typography>
                  </Box>
                </th>
              </tr>
              {userPools.map((data: any) => {
                return (
                  <PoolRow data={data} />
                )
              })}
            </table>
          </Box>
        </Box>
      )}
      <Box className={styles.box} p={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" pb={2}>
          <Box p={1} textAlign="left">
            <Typography variant="h5">
              All Pools
            </Typography>
          </Box>
          <Box display="flex">
            <Box>
              Tokens:
            </Box>
            <Box>
              Networks:
            </Box>
          </Box>
        </Box>
        <Box overflow="auto">
          <table className={styles.table}>
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
                   My Liquidity
                  </Typography>
                </Box>
              </th>
              <th>
                <Box p={1} textAlign="left">
                  <Typography variant="subtitle2" color="secondary">
                   TVL
                  </Typography>
                </Box>
              </th>
              <th>
                <Box p={1} textAlign="left">
                  <Typography variant="subtitle2" color="secondary">
                   Total APR
                  </Typography>
                </Box>
              </th>
              <th>
                <Box p={1} textAlign="left">
                  <Typography variant="subtitle2" color="secondary">
                   Action
                  </Typography>
                </Box>
              </th>
            </tr>
            {pools.map((data: any) => {
              return (
                <PoolRow data={data} />
              )
            })}
          </table>
        </Box>
      </Box>
    </Box>
  )
}
