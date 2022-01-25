import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy } from 'src/utils'
import { IconStat } from './components/IconStat'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '2rem',
  },
  table: {
    width: '800px',
  },
  cell: {
    fontSize: '1.4rem',
  },
  flex: {
    display: 'flex',
  },
  title: {
    marginBottom: '4.2rem',
  },
  box: {
    marginBottom: '2rem',
    flexDirection: 'column',
  },
}))

function formatRatio(item) {
  const { reserve0, reserve1 } = item
  const div = reserve0 / reserve1
  return `${div.toString().slice(0, 6)}`
}

const PoolStats: FC = () => {
  const styles = useStyles()
  const { stats, fetching } = useStats()
  console.log(`stats:`, stats)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" className={styles.box}>
        <Paper className={styles.paper}>
          <TableContainer>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <th>AMM Pair</th>
                  <th>Pooled Token 0</th>
                  <th>Pooled Token 1</th>
                  <th>Ratio 0:1</th>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetching
                  ? Array(2)
                      .fill(null)
                      .map((x, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell colSpan={6}>
                              <Skeleton animation="wave" width={'100%'} />
                            </TableCell>
                          </TableRow>
                        )
                      })
                  : stats?.map(item => {
                      return (
                        <TableRow key={item.id}>
                          <TableCell className={styles.cell}>
                            <div className={styles.flex}>
                              <img
                                style={{
                                  display: 'inline-block',
                                  marginRight: '0.5em',
                                }}
                                src={item.network.imageUrl}
                                alt=""
                                width="16"
                              />
                              <span>
                                {item.token0.symbol}-{item.token1.symbol}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className={styles.cell}>
                            <IconStat
                              src={item.token0.imageUrl}
                              data={`${commafy(item.reserve0)} ${item.token0.symbol}`}
                            />
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.reserve1)} {item.token1.symbol}
                          </TableCell>
                          <TableCell className={styles.cell}>{formatRatio(item)}</TableCell>
                        </TableRow>
                      )
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  )
}

export default PoolStats
