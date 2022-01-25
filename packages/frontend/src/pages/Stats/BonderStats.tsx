import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { IconStat } from './components'
import { getTokenImage } from 'src/utils/tokens'
import { Loading } from 'src/components/Loading'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '2rem',
  },
  cell: {
    fontSize: '1.4rem',
  },
  flex: {
    display: 'flex',
  },
  box: {
    marginBottom: '2rem',
    flexDirection: 'column',
  },
}))
const BonderStats: FC = () => {
  const styles = useStyles()
  const { bonderStats, fetchingBonderStats } = useStats()
  console.log(`bonderStats:`, bonderStats)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" className={styles.box}>
        <Paper className={styles.paper}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <th>Bridge</th>
                  <th>Bonder</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>Available Liquidity</th>
                  <th>Pending Amount</th>
                  <th>Virtual Debt</th>
                  <th>Total Amount</th>
                  <th>Available ETH</th>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchingBonderStats ? (
                  <Loading />
                ) : (
                  bonderStats?.map(item => {
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
                              {item.network.slug}.{item.token.symbol}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className={styles.cell}>
                          <CopyEthAddress value={item.bonder} />
                        </TableCell>
                        <TableCell className={styles.cell}>{commafy(item.credit)}</TableCell>
                        <TableCell className={styles.cell}>{commafy(item.debit)}</TableCell>
                        <TableCell className={styles.cell}>
                          {commafy(item.availableLiquidity)}
                        </TableCell>
                        <TableCell className={styles.cell}>{commafy(item.pendingAmount)}</TableCell>
                        <TableCell className={styles.cell}>{commafy(item.virtualDebt)}</TableCell>
                        <TableCell className={styles.cell}>
                          <IconStat src={item.token.imageUrl} data={commafy(item.totalAmount)} />
                        </TableCell>
                        <TableCell className={styles.cell}>
                          <IconStat src={getTokenImage()} data={commafy(item.availableEth)} />
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  )
}

export default BonderStats
