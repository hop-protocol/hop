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

const DebitWindowStats: FC = () => {
  const styles = useStyles()
  const { debitWindowStats, fetchingDebitWindowStats } = useStats()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Debit Window Stats
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" className={styles.box}>
        <Paper className={styles.paper}>
          <TableContainer>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <th>Token</th>
                  <th>Slot 0</th>
                  <th>Slot 1</th>
                  <th>Slot 2</th>
                  <th>Slot 3</th>
                  <th>Slot 4</th>
                  <th>Slot 5</th>
                  <th>Mins Remaining</th>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchingDebitWindowStats
                  ? Array(2)
                    .fill(null)
                    .map((x, i) => {
                      return (
                          <TableRow key={i}>
                            <TableCell colSpan={8}>
                              <Skeleton animation="wave" width={'100%'} />
                            </TableCell>
                          </TableRow>
                      )
                    })
                  : debitWindowStats?.map(item => {
                    return (
                        <TableRow key={item.id}>
                          <TableCell className={styles.cell}>
                            <div className={styles.flex}>
                              <span>{item.token.symbol}</span>
                            </div>
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.amountBonded[0])}
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.amountBonded[1])}
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.amountBonded[2])}
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.amountBonded[3])}
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.amountBonded[4])}
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.amountBonded[5])}
                          </TableCell>
                          <TableCell className={styles.cell}>
                            {commafy(item.remainingMin)}
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

export default DebitWindowStats
