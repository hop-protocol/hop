import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import Link from '@material-ui/core/Link'
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

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '2rem'
  },
  table: {
    width: '800px'
  },
  cell: {
    fontSize: '1.4rem'
  },
  flex: {
    display: 'flex'
  },
  title: {
    marginBottom: '4.2rem'
  },
  box: {
    marginBottom: '2rem',
    flexDirection: 'column'
  }
}))

const PoolStats: FC = () => {
  const styles = useStyles()
  const { pendingAmounts, fetchingPendingAmounts } = useStats()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" className={styles.box}>
        <Paper className={styles.paper}>
          <TableContainer>
            <Table className={styles.table}>
              <TableHead>
                <th>Source</th>
                <th>Destination</th>
                <th>Pending Amount</th>
              </TableHead>
              <TableBody>
                {fetchingPendingAmounts
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
                  : pendingAmounts?.map(item => {
                    return (
                        <TableRow key={item.id}>
                          <TableCell className={styles.cell}>
                            <img
                              style={{
                                display: 'inline-block',
                                marginRight: '0.5em'
                              }}
                              src={item.sourceNetwork.imageUrl}
                              alt=""
                              width="16"
                            />
                            {item.sourceNetwork.name}
                          </TableCell>
                          <TableCell className={styles.cell}>
                            <img
                              style={{
                                display: 'inline-block',
                                marginRight: '0.5em'
                              }}
                              src={item.destinationNetwork.imageUrl}
                              alt=""
                              width="16"
                            />
                            {item.destinationNetwork.name}
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.pendingAmount)} {item.token.symbol}
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

export default PoolStats
