import React, { useEffect, useState } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { SiteWrapper } from '../components/SiteWrapper'
import { utils } from 'ethers'
// import { ExplorerEvents } from '../components/ExplorerEvents'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import PendingIcon from '@mui/icons-material/Pending'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useEvents } from '../hooks/useEvents'
import { useLocation } from 'react-router-dom'

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
  const transferId = parts[2]
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

  const filter = { transferId }
  const { events, loading: isFetching } = useEvents('explorer', filter)
  const event: any = events[0]
  const loading = !(!isFetching && gasLimit && gasUsed)

  let status :any = null
  const isBonded = !!event?.transferBondedEvent
  if (isBonded) {
    status = (
      <Chip icon={<CheckIcon style={{ color: '#fff' }} />} label="Bonded" style={{ backgroundColor: '#74d56e', color: '#fff' }} />
    )
  } else if (event && !event?.transferBondedEvent) {
    status = (
      <Chip icon={<PendingIcon />} label="Pending" />
    )
  }

  useEffect(() => {
    async function update() {
      if (event) {
        const sdk = new Hop({ network: 'sepolia' })
        const provider = sdk.getRpcProviderForChainId(event?.context?.chainId)
        const txHash = event?.context?.transactionHash
        const [tx, receipt] = await Promise.all([
          provider.getTransaction(txHash),
          provider.getTransactionReceipt(txHash)
        ])
        if (tx) {
          setTxValue(tx?.value?.toString())
          setTxValueFormatted(`${utils.formatEther(tx?.value?.toString())} ETH`)
          setGasLimit(tx?.gasLimit?.toString())
          setNonce(tx?.nonce?.toString())
          if (receipt) {
            setGasUsed(receipt?.gasUsed?.toString())
            setSourceTxStatus(receipt?.status?.toString() || '1')
            setSourceTxFrom(receipt?.from?.toString())
            setSourceTxTo(receipt?.to?.toString())
            if ((tx as any)?.gasPrice) {
              setGasPrice((tx as any)?.gasPrice?.toString())
              setGasPriceFormatted(`${utils.formatUnits((tx as any)?.gasPrice?.toString(), 9)} gwei`)
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
        <Typography variant="h5">Transfer details</Typography>
      </Box>

      <TableContainer>
        <Table width="100%">
          <TableBody>
            <TableRow className={styles.tableRow}>
              <TableCell>Transfer ID:</TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  transferId
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
              <TableCell>Token:</TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={200} height={20} />
                ) : (
                  <Link href={event?.token?.tokenExplorerUrl} target="_blank" rel="noreferrer">
                    {event?.token?.name} ({event?.token?.symbol})
                  </Link>
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
          Source Transaction Calldata:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  <Box maxWidth={'420px'} style={{
                    whiteSpace: 'break-spaces',
                    wordBreak: 'break-all'
                  }}>
                    {event?.context?.data}
                  </Box>
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
                Transfer Recipient
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  event?.to
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
                Transfer Amount
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  event?.amount
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
                Transfer Attestation Fee
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  event?.attestationFee
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>Transfer Checkpoint:</TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  event?.checkpoint
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
                Transfer Checkpoint Total Sent
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  event?.totalSent
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>Transfer Nonce:</TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  event?.nonce
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
                Path ID
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  event?.pathId
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
                  event?.transferBondedEvent
                  ? (
                    <Link href={event?.transferBondedEvent?.context?.transactionHashExplorerUrl} target="_blank" rel="noreferrer">
                      {event?.transferBondedEvent?.context?.transactionHash}
                    </Link>
                  ) : <Box>- <small><em>(Destination tx hash will be availabe once transfer is bonded)</em></small></Box>)
                }
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
                Destination Transfer Amount Out
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={350} height={20} />
                ) : (
                  event?.transferBondedEvent?.amountOut
                  ? (
                    event?.transferBondedEvent?.amountOut
                  ) : <Box>- <small><em>(Transfer amount out value will be availabe once transfer is bonded)</em></small></Box>
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
          Destination Transaction From Address (Bonder):
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  event?.transferBondedEvent?.context?.from
                  ? (
                    event?.transferBondedEvent?.context?.from
                  ) : <Box>- <small><em>(Destination transaction from address will be availabe once transfer is bonded)</em></small></Box>
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
          Destination Transaction To Address:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  event?.transferBondedEvent?.context?.to
                  ? (
                    event?.transferBondedEvent?.context?.to
                  ) : <Box>- <small><em>(Destination transaction to address will be availabe once transfer is bonded)</em></small></Box>
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>
          Destination Transaction Calldata:
              </TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={500} height={20} />
                ) : (
                  <Box maxWidth={'420px'} style={{
                    whiteSpace: 'break-spaces',
                    wordBreak: 'break-all'
                  }}>
                    {
                    event?.transferBondedEvent?.context?.data
                    ? (
                      event?.transferBondedEvent?.context?.data
                    ) : <Box>- <small><em>(Destination transaction calldata will be availabe once transfer is bonded)</em></small></Box>
                  }
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
