import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { SiteWrapper } from '../components/SiteWrapper'
import { Hop } from '@hop-protocol/v2-sdk'
import { formatEther, formatUnits } from 'ethers/lib/utils'
// import { ExplorerEvents } from '../components/ExplorerEvents'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEvents } from '../hooks/useEvents'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'
import PendingIcon from '@mui/icons-material/Pending'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableFooter from '@mui/material/TableFooter'
import Skeleton from '@mui/material/Skeleton'
import Link from '@mui/material/Link'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: any) => ({
  tableRow: {
    wordBreak: 'break-all',
    '& td:first-child': {
      [theme.breakpoints.down('md')]: {
        borderBottom: 'none',
        paddingBottom: 0
      }
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex !important',
      flexDirection: 'column'
    }
  }
}))

export function Details () {
  const styles = useStyles()
  const location = useLocation()
  const parts = location.pathname.split('/')
  const messageId = parts[2]
  const [txValue, setTxValue] = useState('')
  const [txValueFormatted, setTxValueFormatted] = useState('')
  const [gasLimit, setGasLimit] = useState('')
  const [gasUsed, setGasUsed] = useState('')
  const [gasPrice, setGasPrice] = useState('')
  const [gasPriceFormatted, setGasPriceFormatted] = useState('')
  const [nonce, setNonce] = useState('')
  const [sourceTxStatus, setSourceTxStatus] = useState('')
  const [sourceTxFrom, setSourceTxFrom] = useState('')
  const [sourceTxTo, setSourceTxTo] = useState('')

  const filter = { messageId: messageId }
  const { events, loading: isFetching } = useEvents('explorer', filter)
  const event: any = events[0]
  const loading = !(!isFetching && gasLimit && gasUsed)

  let status :any = null
  const isRelayed = !!event?.messageRelayedEvent
  if (isRelayed) {
    status = (
      <Chip icon={<CheckIcon style={{ color: '#fff' }} />} label="Relayed" style={{ backgroundColor: '#74d56e', color: '#fff' }} />
    )
  } else if (event && !event?.messageRelayedEvent) {
    status = (
      <Chip icon={<PendingIcon />} label="Pending" />
    )
  }

  useEffect(() => {
    async function update() {
      if (event) {
        const sdk = new Hop('goerli')
        const provider = sdk.getRpcProvider(event?.context?.chainId)
        const txHash = event?.context?.transactionHash
        const [tx, receipt] = await Promise.all([
          provider.getTransaction(txHash),
          provider.getTransactionReceipt(txHash)
        ])
        if (tx) {
          setTxValue(tx?.value?.toString())
          setTxValueFormatted(`${formatEther(tx?.value?.toString())} ETH`)
          setGasLimit(tx?.gasLimit?.toString())
          setNonce(tx?.nonce?.toString())
          if (receipt) {
            setGasUsed(receipt?.gasUsed?.toString())
            setSourceTxStatus(receipt?.status?.toString() || '1')
            setSourceTxFrom(receipt?.from?.toString())
            setSourceTxTo(receipt?.to?.toString())
            if ((tx as any)?.gasPrice) {
              setGasPrice((tx as any)?.gasPrice?.toString())
              setGasPriceFormatted(`${formatUnits((tx as any)?.gasPrice?.toString(), 9)} gwei`)
            }
          }
        }
      }
    }

    update().catch(console.error)
  }, [event])

  return (
    <SiteWrapper>
      <Box mb={4} width="100%" display="flex" justifyContent="flex-start">
        <Typography variant="h5">Message details</Typography>
      </Box>

      <TableContainer>
        <Table width="100%">
          <TableBody>
            <TableRow className={styles.tableRow}>
              <TableCell>Message ID:</TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  messageId
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>Status:</TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={200} height={20} />
                ) : (
                  status
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>Created:</TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  <Box>{event?.context?.blockTimestamp} {event ? <>({event?.context?.blockTimestampRelative})</> : null}</Box>
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Chain:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  event?.context?.chainLabel
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
Source Transaction Hash:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                <Link href={event?.context?.transactionHashExplorerUrl} target="_blank" rel="noreferrer">
                  {event?.context?.transactionHash}
                </Link>
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Transaction Status:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  sourceTxStatus || <Skeleton variant="rectangular" width={350} height={20} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Transaction From Address:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  sourceTxFrom || <Skeleton variant="rectangular" width={350} height={20} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Transaction To Address:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  sourceTxTo || <Skeleton variant="rectangular" width={350} height={20} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Transaction Value:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  txValue ? (`${txValue} (${txValueFormatted})`) : <Skeleton variant="rectangular" width={350} height={20} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Transaction Gas Limit:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={200} height={20} />
                ) : (
                  gasLimit || <Skeleton variant="rectangular" width={200} height={20} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Transaction Gas Used:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={200} height={20} />
                ) : (
                  gasUsed || <Skeleton variant="rectangular" width={200} height={20} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Transaction Gas Price:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={200} height={20} />
                ) : (
                  gasPrice ? `${gasPrice} (${gasPriceFormatted})` : <Skeleton variant="rectangular" width={200} height={20} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Source Transaction Nonce:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={200} height={20} />
                ) : (
                  nonce || <Skeleton variant="rectangular" width={200}
                  height={20} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
Source Transaction Block Number:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={200} height={20} />
                ) : (
                  event?.context?.blockNumber
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
Destination Chain:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
event?.toChainLabel
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
        Message Sender:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  event?.from
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
Destination Transaction Hash:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  event?.messageRelayedEvent
                  ? (
                    <Link href={event?.messageRelayedEvent?.context?.transactionHashExplorerUrl} target="_blank" rel="noreferrer">
                      {event?.messageRelayedEvent?.context?.transactionHash}
                    </Link>
                  ) : <Box>- <small><em>(Destination tx hash wil be availabe once message is relayed)</em></small></Box>)
                }
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
          Destination call address:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  event?.to
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
          Destination calldata:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  <Box maxWidth={'400px'} style={{
                    whiteSpace: 'break-spaces',
                    wordBreak: 'break-all'
                  }}>
                    {event?.data}
                  </Box>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </SiteWrapper>
  )
}
