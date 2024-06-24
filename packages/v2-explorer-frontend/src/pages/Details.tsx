import React, { useEffect, useState, useMemo } from 'react'
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
import { CopyToClipboardText } from '../components/CopyToClipboardText'

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
  const sdk = useMemo(() => new Hop({ network: 'sepolia' }), [])

  const filter = { transferId }
  const { events, loading: isFetching } = useEvents('explorer', filter)
  const event: any = events[0]

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

  const transferAmount = event?.amount
  const transferAmountFormatted = transferAmount ? utils.formatUnits(transferAmount, event?.token?.decimals) : null
  const transferAmountDisplay = transferAmount ? `${transferAmount} (${transferAmountFormatted} ${event?.token?.symbol})` : null

  const totalSent = event?.totalSent
  const totalSentFormatted = totalSent ? utils.formatUnits(totalSent, event?.token?.decimals) : null
  const totalSentDisplay = totalSent ? `${totalSent} (${totalSentFormatted} ${event?.token?.symbol})` : null

  const txValue = event?.context?.value?.toString()
  const txValueFormatted = event ? `${utils.formatEther(event?.context?.value?.toString())} ETH` : ''
  const gasLimit = event?.context?.gasLimit?.toString()
  const nonce = event?.context?.nonce?.toString()
  const gasUsed = event?.context?.gasUsed?.toString()
  const sourceTxStatus = event?.context?.status?.toString() ?? '-'
  const sourceTxFrom = event?.context?.from?.toString()
  const sourceTxFromExplorerUrl = event ? sdk.utils.getAddressExplorerUrl(event?.context?.from?.toString(), event?.context?.chainId) : ''
  const sourceTxTo = event?.context?.to?.toString()
  const sourceTxToExplorerUrl = event ? sdk.utils.getAddressExplorerUrl(event?.context?.to?.toString(), event?.context?.chainId) : ''
  const gasPrice = event?.context?.gasPrice?.toString()
  const gasPriceFormatted = event ? `${utils.formatUnits(event?.context?.gasPrice?.toString(), 9)} gwei` : ''

  const loading = !(!isFetching && event)

  const sourceTokenAddress = event?.token?.address
  const sourceTokenDisplay = event?.token ? `${event?.token?.name} (${event?.token?.symbol})` : null
  const sourceTokenExplorerUrl = event?.token?.tokenExplorerUrl
  const sourceTxStatusDisplay = sourceTxStatus ? `${sourceTxStatus} (${sourceTxStatus === 1 ? 'Success' : sourceTxStatus === 0 ? 'Failure' : 'Unknown'})` : null
  const sourceChainDisplay = event?.context?.chainLabel
  const sourceTransactionHash = event?.context?.transactionHash
  const sourceTxValueDisplay = txValue ? `${txValue} (${txValueFormatted})` : null
  const sourceTxTimestampDisplay = event?.context?.blockTimestamp ? `${event?.context?.blockTimestamp} ${event ? `(${event?.context?.blockTimestampRelative})` : ''}` : null
  const sourceGasPriceDisplay = gasPrice ? `${gasPrice} (${gasPriceFormatted})` : null
  const sourceBlockNumber = event?.context?.blockNumber

  const destinationChainDisplay = event?.toChainLabel
  const transferRecipient = event?.to
  const transferRecipientExplorerUrl = event?.toExplorerUrl
  const attestationFeeDisplay = event?.attestationFee ? `${event?.attestationFee} (${utils.formatUnits(event?.attestationFee, 18)} ETH)` : null
  const checkpoint = event?.checkpoint
  const transferNonce = event?.nonce
  const pathId = event?.pathId
  const destinationTransactionHash = event?.transferBondedEvent?.context?.transactionHash
  const destinationTransactionExplorerUrl = event?.transferBondedEvent?.context?.transactionHashExplorerUrl
  const destinationAmountOutDisplay = event?.transferBondedEvent?.amountOut ? `${event?.transferBondedEvent?.amountOut} (${utils.formatUnits(event?.transferBondedEvent?.amountOut, event?.token?.decimals)} ${event?.token?.symbol})` : null
  const destinationTxFromDisplay = event?.transferBondedEvent?.context?.from
  const destinationTxFromExplorerUrl = event?.transferBondedEvent?.context?.fromExplorerUrl
  const destinationTxToDisplay = event?.transferBondedEvent?.context?.to
  const destinationTxToExplorerUrl = event?.transferBondedEvent?.context?.toExplorerUrl
  const destinationTokenAddress = event?.counterpartToken?.address
  const destinationTokenDisplay = event?.counterpartToken ? `${event?.counterpartToken?.name} (${event?.counterpartToken?.symbol})` : null
  const destinationTokenExplorerUrl = event?.counterpartToken?.tokenExplorerUrl

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
                  <CopyToClipboardText text={transferId} />
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
                  <CopyToClipboardText text={sourceTokenAddress}>
                    <Link href={sourceTokenExplorerUrl} target="_blank" rel="noreferrer">
                      {sourceTokenDisplay}
                    </Link>
                  </CopyToClipboardText>
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
                  <CopyToClipboardText text={sourceTxTimestampDisplay} />
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
                  <CopyToClipboardText text={sourceChainDisplay} />
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
                <CopyToClipboardText text={sourceTransactionHash}>
                  <Link href={event?.context?.transactionHashExplorerUrl} target="_blank" rel="noreferrer">
                    {sourceTransactionHash}
                  </Link>
                </CopyToClipboardText>
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
                  sourceTxStatusDisplay ? sourceTxStatusDisplay : <Skeleton variant="rectangular" width={350} height={20} />
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
                  sourceTxFrom ? (
                    <CopyToClipboardText text={sourceTxFrom}>
                      <Link href={sourceTxFromExplorerUrl} target="_blank" rel="noreferrer">
                        {sourceTxFrom}
                      </Link>
                    </CopyToClipboardText>
                  ) : <Skeleton variant="rectangular" width={350} height={20} />
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
                  sourceTxTo ? (
                    <CopyToClipboardText text={sourceTxTo}>
                      <Link href={sourceTxToExplorerUrl} target="_blank" rel="noreferrer">
                        {sourceTxTo}
                      </Link>
                    </CopyToClipboardText>
                  ) : <Skeleton variant="rectangular" width={350} height={20} />
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
                  sourceTxValueDisplay ? (
                    <CopyToClipboardText text={sourceTxValueDisplay} />
                  ) : <Skeleton variant="rectangular" width={350} height={20} />
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
                  gasLimit ? (
                    <CopyToClipboardText text={gasLimit} />
                  ) : <Skeleton variant="rectangular" width={200} height={20} />
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
                  gasUsed ? (
                    <CopyToClipboardText text={gasUsed} />
                  ) : <Skeleton variant="rectangular" width={200} height={20} />
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
                  sourceGasPriceDisplay ? (
                    <CopyToClipboardText text={sourceTxTimestampDisplay} />
                  ) : <Skeleton variant="rectangular" width={200} height={20} />
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
                  nonce ? (
                    <CopyToClipboardText text={nonce} />
                  ) : <Skeleton variant="rectangular" width={200} height={20} />
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
                  <CopyToClipboardText text={sourceBlockNumber} />
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
                  <CopyToClipboardText text={destinationChainDisplay} />
                )}
              </TableCell>
            </TableRow>
            <TableRow className={styles.tableRow}>
              <TableCell>Destination Token:</TableCell>
              <TableCell>
                {loading
                ? (
                  <Skeleton variant="rectangular" width={200} height={20} />
                ) : (
                  <CopyToClipboardText text={destinationTokenAddress}>
                    <Link href={destinationTokenExplorerUrl} target="_blank" rel="noreferrer">
                      {destinationTokenDisplay}
                    </Link>
                  </CopyToClipboardText>
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
                  <CopyToClipboardText text={transferRecipient}>
                    <Link href={transferRecipientExplorerUrl} target="_blank" rel="noreferrer">
                      {transferRecipient}
                    </Link>
                  </CopyToClipboardText>
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
                  <CopyToClipboardText text={transferAmountDisplay} />
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
                  <CopyToClipboardText text={attestationFeeDisplay} />
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
                  <CopyToClipboardText text={checkpoint} />
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
                  <CopyToClipboardText text={totalSentDisplay} />
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
                  <CopyToClipboardText text={transferNonce} />
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
                  <CopyToClipboardText text={pathId} />
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
                    <CopyToClipboardText text={destinationTransactionHash}>
                      <Link href={destinationTransactionExplorerUrl} target="_blank" rel="noreferrer">
                        {destinationTransactionHash}
                      </Link>
                    </CopyToClipboardText>
                  ) : <Box>- <small><em>(Destination tx hash wil be available once message is bonded)</em></small></Box>)
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
                  destinationAmountOutDisplay
                  ? (
                    <CopyToClipboardText text={destinationAmountOutDisplay} />
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
                  destinationTxFromDisplay
                  ? (
                    <CopyToClipboardText text={destinationTxFromDisplay}>
                      <Link href={destinationTxFromExplorerUrl} target="_blank" rel="noreferrer">
                        {destinationTxFromDisplay}
                      </Link>
                    </CopyToClipboardText>
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
                  destinationTxToDisplay
                  ? (
                    <CopyToClipboardText text={destinationTxToDisplay}>
                      <Link href={destinationTxToExplorerUrl} target="_blank" rel="noreferrer">
                        {destinationTxToDisplay}
                      </Link>
                    </CopyToClipboardText>
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
