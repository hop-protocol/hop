import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
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
import range from 'lodash/range'
import { IconStat } from './components/IconStat'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { getTokenImage } from 'src/utils/tokens'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '2rem',
  },
  table: {
    // width: '800px',
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

const BalanceStats: FC = () => {
  const styles = useStyles()
  const { balances, fetchingBalances } = useStats()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" className={styles.box}>
        <Paper className={styles.paper}>
          <TableContainer>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <th>Network</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>ETH Balance</th>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchingBalances
                  ? range(2).map((x, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell colSpan={4}>
                            <Skeleton animation="wave" width={'100%'} />
                          </TableCell>
                        </TableRow>
                      )
                    })
                  : balances?.map(item => {
                      return (
                        <TableRow key={item.address}>
                          <TableCell className={styles.cell}>
                            <IconStat src={item.network.imageUrl} data={item.network.slug} />
                          </TableCell>
                          <TableCell className={styles.cell}>
                            <IconStat src={item.tokenImageUrl} data={item.name} />
                          </TableCell>
                          {/* <TableCell className={styles.cell}>{item.name}</TableCell> */}
                          <TableCell className={styles.cell}>
                            <CopyEthAddress value={item.address} />
                          </TableCell>
                          <TableCell className={styles.cell}>
                            <IconStat src={getTokenImage('ETH')} data={commafy(item.balance)} />
                          </TableCell>
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

export default BalanceStats
