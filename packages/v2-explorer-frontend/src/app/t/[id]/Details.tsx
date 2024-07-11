'use client'
import React from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import { useTransferDetails } from '../../hooks/useTransferDetails'
import { CopyToClipboardText } from '../../components/CopyToClipboardText'
import { DetailRow } from './DetailRow'

export function Details(props: any) {
  const { initialEventDetails } = props
  const {
    transferId,
    statusDisplay,
    checkpointTotalSentDisplay,
    transferRecipient,
    transferRecipientExplorerUrl,
    attestationFeeDisplay,
    checkpoint,
    transferNonce,
    pathId,
    sourceTxValueDisplay,
    sourceTxTransactionHash,
    sourceTxTransactionExplorerUrl,
    sourceTxGasLimit,
    sourceTxNonce,
    sourceTxGasUsed,
    sourceTxGasPriceDisplay,
    sourceTxFrom,
    sourceTxChainDisplay,
    sourceTxChainImageUrl,
    sourceTxFromExplorerUrl,
    sourceTxTo,
    sourceTxToExplorerUrl,
    sourceTokenDisplay,
    sourceTokenExplorerUrl,
    sourceTxStatusDisplay,
    sourceTxTimestampDisplay,
    sourceTxBlockNumber,
    sourceTxData,
    destinationChainDisplay,
    destinationChainImageUrl,
    destinationTransactionHash,
    destinationTransactionExplorerUrl,
    destinationAmountOutDisplay,
    destinationTxFromDisplay,
    destinationTxFromExplorerUrl,
    destinationTxToDisplay,
    destinationTxToExplorerUrl,
    destinationTokenDisplay,
    destinationTokenExplorerUrl,
    destinationTxData,
    loading,
    destinationTxStatusDisplay,
    destinationTxValueDisplay,
    destinationTxGasLimit,
    destinationTxGasUsed,
    destinationTxGasPriceDisplay,
    destinationTxNonce,
    destinationTxBlockNumber,
    transferAmountDisplay,
    destinationTxTimestampDisplay
  } = useTransferDetails({ initialEventDetails })

  return (
    <Box>
      <Box mb={4} width="100%" display="flex" justifyContent="flex-start">
        <Typography variant="h5" color="textPrimary">Transfer Details</Typography>
      </Box>

      <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }} >
      <TableContainer>
        <Table width="100%">
          <TableBody>
              <DetailRow loading={loading} label="Transfer ID" value={transferId} />
              <DetailRow loading={loading} label="Status" value={statusDisplay} />
              <DetailRow loading={loading} label="Created" value={sourceTxTimestampDisplay} />
              <DetailRow loading={loading} label="Token" value={sourceTokenDisplay} link={sourceTokenExplorerUrl} />
              <DetailRow loading={loading} label="Origin Chain" value={sourceTxChainDisplay} imageUrl={sourceTxChainImageUrl} />
              <DetailRow loading={loading} label="Target Chain" value={destinationChainDisplay} imageUrl={destinationChainImageUrl} />
              <DetailRow loading={loading} label="Transfer Amount" value={transferAmountDisplay} />
              <DetailRow loading={loading} label="Transfer Nonce" value={transferNonce} />
              <DetailRow loading={loading} label="Transfer Recipient" value={transferRecipient} link={transferRecipientExplorerUrl} />
              <DetailRow loading={loading} label="Transfer Attestation Fee" value={attestationFeeDisplay} />
              <DetailRow loading={loading} label="Transfer Checkpoint" value={checkpoint} />
              <DetailRow loading={loading} label="Transfer Checkpoint Total Sent" value={checkpointTotalSentDisplay} />
              <DetailRow loading={loading} label="Path ID" value={pathId} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="h6" color="textPrimary" style={{ marginTop: 16 }}>Source Transaction</Typography>
      <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }}>
        <TableContainer>
          <Table width="100%">
            <TableBody>
              <DetailRow loading={loading} label="Source Chain" value={sourceTxChainDisplay} imageUrl={sourceTxChainImageUrl} />
              <DetailRow loading={loading} label="Source Transaction Hash" value={sourceTxTransactionHash} link={sourceTxTransactionExplorerUrl} />
              <DetailRow loading={loading} label="Source Transaction Status" value={sourceTxStatusDisplay} />
              <DetailRow loading={loading} label="Source Transaction From Address" value={sourceTxFrom} link={sourceTxFromExplorerUrl} />
              <DetailRow loading={loading} label="Source Transaction To Address" value={sourceTxTo} link={sourceTxToExplorerUrl} />
              <DetailRow loading={loading} label="Source Transaction Value" value={sourceTxValueDisplay} />
              <DetailRow loading={loading} label="Source Transaction Gas Limit" value={sourceTxGasLimit} />
              <DetailRow loading={loading} label="Source Transaction Gas Used" value={sourceTxGasUsed} />
              <DetailRow loading={loading} label="Source Transaction Gas Price" value={sourceTxGasPriceDisplay} />
              <DetailRow loading={loading} label="Source Transaction Nonce" value={sourceTxNonce} />
              <DetailRow loading={loading} label="Source Transaction Block Number" value={sourceTxBlockNumber} />
              <DetailRow loading={loading} label="Source Transaction Calldata" value={sourceTxData} maxWidth={300} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="h6" color="textPrimary" style={{ marginTop: 16 }}>Destination Transaction</Typography>
      <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }}>
        <TableContainer>
          <Table width="100%">
            <TableBody>
              <DetailRow loading={loading} label="Destination Chain" value={destinationChainDisplay} imageUrl={destinationChainImageUrl} />
              <DetailRow loading={loading} label="Destination Token" value={destinationTokenDisplay} link={destinationTokenExplorerUrl} />
              <DetailRow loading={loading} label="Destination Timestamp" value={destinationTxTimestampDisplay} />
              <DetailRow loading={loading} label="Destination Transfer Amount Out" value={destinationAmountOutDisplay} />
              <DetailRow loading={loading} label="Destination Transaction Hash" value={destinationTransactionHash} link={destinationTransactionExplorerUrl} />
              <DetailRow loading={loading} label="Destination Transaction Status" value={destinationTxStatusDisplay} />
              <DetailRow loading={loading} label="Destination Transaction From Address (Bonder)" value={destinationTxFromDisplay} link={destinationTxFromExplorerUrl} />
              <DetailRow loading={loading} label="Destination Transaction To Address" value={destinationTxToDisplay} link={destinationTxToExplorerUrl} />
              <DetailRow loading={loading} label="Destination Transaction Value" value={destinationTxValueDisplay} />
              <DetailRow loading={loading} label="Destination Transaction Gas Limit" value={destinationTxGasLimit} />
              <DetailRow loading={loading} label="Destination Transaction Gas Used" value={destinationTxGasUsed} />
              <DetailRow loading={loading} label="Destination Transaction Gas Price" value={destinationTxGasPriceDisplay} />
              <DetailRow loading={loading} label="Destination Transaction Nonce" value={destinationTxNonce} />
              <DetailRow loading={loading} label="Destination Transaction Block Number" value={destinationTxBlockNumber} />
              <DetailRow loading={loading} label="Destination Transaction Calldata" value={destinationTxData} maxWidth={300} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
