import React, { useEffect, useState, useMemo } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { SiteWrapper } from '../components/SiteWrapper'
import { utils } from 'ethers'
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
import { networkSlug } from '../config'

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
  const sdk = useMemo(() => new Hop({ network: networkSlug }), [])

  const filter = { transferId }
  const { events, loading: isFetching } = useEvents('explorer', filter)
  const event: any = events[0]
  const bondedEvent = event?.transferBondedEvent
  const token = event?.token
  const tokenDecimals = token?.decimals
  const tokenSymbol = token?.symbol
  const tokenName = token?.name
  const counterpartToken = event?.counterpartToken
  const context = event?.context
  const destinationContext = event?.transferBondedEvent?.context

  let status :any = null
  const isBonded = !!bondedEvent
  if (isBonded) {
    status = (
      <Chip icon={<CheckIcon style={{ color: '#fff' }} />} label="Bonded" style={{ backgroundColor: '#74d56e', color: '#fff' }} />
    )
  } else if (event && !isBonded) {
    status = (
      <Chip icon={<PendingIcon />} label="Pending" />
    )
  }

  const transferAmount = event?.amount
  const transferAmountFormatted = transferAmount ? utils.formatUnits(transferAmount, tokenDecimals) : null
  const transferAmountDisplay = transferAmount ? `${transferAmount} (${transferAmountFormatted} ${tokenSymbol})` : null
  const checkpointTotalSent = event?.totalSent
  const checkpointTotalSentFormatted = checkpointTotalSent ? utils.formatUnits(checkpointTotalSent, tokenDecimals) : null
  const checkpointTotalSentDisplay = checkpointTotalSent ? `${checkpointTotalSent} (${checkpointTotalSentFormatted} ${tokenSymbol})` : null
  const transferRecipient = event?.to
  const transferRecipientExplorerUrl = event?.toExplorerUrl
  const attestationFeeDisplay = event?.attestationFee ? `${event?.attestationFee} (${utils.formatUnits(event?.attestationFee, 18)} ETH)` : null
  const checkpoint = event?.checkpoint
  const transferNonce = event?.nonce
  const pathId = event?.pathId
  const sourceTxValue = context?.value
  const sourceTxValueFormatted = event ? `${utils.formatEther(sourceTxValue)} ETH` : ''
  const sourceTxValueDisplay = sourceTxValue ? `${sourceTxValue} (${sourceTxValueFormatted})` : null
  const sourceTxTransactionHash = context?.transactionHash
  const sourceTxTransactionExplorerUrl = context?.transactionHashExplorerUrl
  const sourceTxGasLimit = context?.gasLimit
  const sourceTxNonce = context?.nonce
  const sourceTxGasUsed = context?.gasUsed
  const sourceTxGasPrice = context?.gasPrice
  const sourceTxGasPriceFormatted = event ? `${utils.formatUnits(sourceTxGasPrice, 9)} gwei` : ''
  const sourceTxGasPriceDisplay = sourceTxGasPrice ? `${sourceTxGasPrice} (${sourceTxGasPriceFormatted})` : null
  const sourceTxStatus = context?.status?.toString() ?? '-'
  const sourceTxFrom = context?.from
  const sourceTxChainId = context?.chainId
  const sourceTxChainDisplay = context?.chainLabel
  const sourceTxFromExplorerUrl = event ? sdk.utils.getAddressExplorerUrl(sourceTxFrom, sourceTxChainId) : ''
  const sourceTxTo = context?.to
  const sourceTxToExplorerUrl = event ? sdk.utils.getAddressExplorerUrl(sourceTxTo, sourceTxChainId) : ''
  const sourceTokenAddress = token?.address
  const sourceTokenDisplay = token ? `${tokenName} (${tokenSymbol})` : null
  const sourceTokenExplorerUrl = token?.tokenExplorerUrl
  const sourceTxStatusDisplay = sourceTxStatus ? `${sourceTxStatus} (${sourceTxStatus === '1' ? 'Success' : sourceTxStatus === '0' ? 'Failure' : 'Unknown'})` : null
  const sourceTxBlockTimestamp = context?.blockTimestamp
  const sourceTxBlockTimestampRelative = context?.blockTimestampRelative
  const sourceTxTimestampDisplay = sourceTxBlockTimestamp ? `${sourceTxBlockTimestamp} ${event ? `(${sourceTxBlockTimestampRelative})` : ''}` : null
  const sourceTxBlockNumber = context?.blockNumber
  const sourceTxData = context?.data
  const destinationChainDisplay = event?.toChainLabel
  const destinationTransactionHash = destinationContext?.transactionHash
  const destinationTransactionExplorerUrl = destinationContext?.transactionHashExplorerUrl
  const destinationAmountOutDisplay = bondedEvent?.amountOut ? `${bondedEvent?.amountOut} (${utils.formatUnits(bondedEvent?.amountOut, tokenDecimals)} ${tokenSymbol})` : null
  const destinationTxFromDisplay = destinationContext?.from
  const destinationTxFromExplorerUrl = destinationContext?.fromExplorerUrl
  const destinationTxToDisplay = destinationContext?.to
  const destinationTxToExplorerUrl = destinationContext?.toExplorerUrl
  const destinationTokenAddress = counterpartToken?.address
  const destinationTokenDisplay = counterpartToken ? `${tokenName} (${tokenSymbol})` : null
  const destinationTokenExplorerUrl = counterpartToken?.tokenExplorerUrl
  const destinationTxData = destinationContext?.data
  const loading = !(!isFetching && event)

  return (
    <SiteWrapper>
      <Box mb={4} width="100%" display="flex" justifyContent="flex-start">
        <Typography variant="h5" color="textPrimary">Transfer details</Typography>
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
                  <CopyToClipboardText text={sourceTxChainDisplay} />
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
                <CopyToClipboardText text={sourceTxTransactionHash}>
                  <Link href={sourceTxTransactionExplorerUrl} target="_blank" rel="noreferrer">
                    {sourceTxTransactionHash}
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
                  sourceTxGasLimit ? (
                    <CopyToClipboardText text={sourceTxGasLimit} />
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
                  sourceTxGasUsed ? (
                    <CopyToClipboardText text={sourceTxGasUsed} />
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
                  sourceTxGasPriceDisplay ? (
                    <CopyToClipboardText text={sourceTxGasPriceDisplay} />
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
                  sourceTxNonce ? (
                    <CopyToClipboardText text={sourceTxNonce} />
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
                  <CopyToClipboardText text={sourceTxBlockNumber} />
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
                    {sourceTxData}
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
                  <CopyToClipboardText text={checkpointTotalSentDisplay} />
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
                  destinationTransactionHash
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
                    destinationTxData
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
