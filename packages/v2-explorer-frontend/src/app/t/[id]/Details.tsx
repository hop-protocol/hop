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
import { useTransferDetails } from '@/app/hooks/useTransferDetails'
import { CopyToClipboardText } from '@/app/components/CopyToClipboardText'
import { DecodedSendDataTable } from '@/app/components/DecodedData/DecodedSendDataTable'
import { DecodedBondDataTable } from '@/app/components/DecodedData/DecodedBondDataTable'
import { DetailRow } from './DetailRow'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from 'next/navigation'

export function Details(props: any) {
  const { initialEventDetails } = props
  console.log(initialEventDetails)
  const {
    transferId,
    statusDisplay,
    transferRecipient,
    transferRecipientExplorerUrl,
    pathId,
    hops,
    sourceTx,
    destinationChainDisplay,
    destinationChainImageUrl,
    loading,
    transferAmountDisplay,
    sourcePoolDisplay,
    sourceTokenAddress,
    sourceTokenDisplay,
    sourceTokenExplorerUrl,
    sourceTokenImageUrl,
    destinationTxs
  } = useTransferDetails({ initialEventDetails })
  const router = useRouter()
  function navigateBack() {
    router.push('/')
  }

  return (
    <Box width="100%" maxWidth="1200px">
      <Box mb={4} ml={0} width="100%" display="flex" justifyContent="flex-start">
        <IconButton onClick={navigateBack} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" color="textPrimary">Transfer Details</Typography>
      </Box>

      <Paper elevation={0} style={{ padding: 8, marginBottom: 16, background: 'transparent' }}
      >
        <TableContainer>
          <Table width="100%">
            <TableBody>
              <DetailRow loading={loading} label="Transfer ID" value={transferId} />
              <DetailRow loading={loading} label="Status" value={statusDisplay} />
              <DetailRow loading={loading} label="Created" value={sourceTx.timestampDisplay} />
              <DetailRow loading={loading} label="Token" value={sourceTokenDisplay} link={sourceTokenExplorerUrl} imageUrl={sourceTokenImageUrl} />
              <DetailRow loading={loading} label="Origin Chain" value={sourceTx.chainDisplay} imageUrl={sourceTx.chainImageUrl} />
              <DetailRow loading={loading} label="Target Chain" value={destinationChainDisplay} imageUrl={destinationChainImageUrl} />
              <DetailRow loading={loading} label="Transfer Recipient" value={transferRecipient} link={transferRecipientExplorerUrl} />
              <DetailRow loading={loading} label="Path ID" value={pathId} link={`/p/${pathId}`} />
              <DetailRow loading={loading} label="Amount" value={transferAmountDisplay} />
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2} mb={2}>
          <Typography variant="subtitle1" color="textPrimary">Hops</Typography>
        </Box>

        {hops.map((hop: any, i: number) => {
          const { pathId, maxBonderFeeDisplay, maxTotalSentDisplay, attestedClaimId} = hop
          return (
            <Box ml={2} mb={4} key={i}>
              <TableContainer>
                <Table width="100%">
                  <TableBody>
                    <DetailRow label={`Hop #${i+1}`} value=" " />
                    <DetailRow label="Path ID" value={pathId} link={`/p/${pathId}`} />
                    <DetailRow label="Max Bonder Fee" value={maxBonderFeeDisplay} />
                    <DetailRow label="Max Total Sent" value={maxTotalSentDisplay} />
                    <DetailRow label="Attested Claim ID" value={attestedClaimId} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )
        })}
      </Paper>

      <Typography variant="h6" color="textPrimary" style={{ marginTop: 16 }}>Source Transaction</Typography>
      <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }}>
        <TableContainer>
          <Table width="100%">
            <TableBody>
              <DetailRow loading={loading} label="Chain" value={sourceTx.chainDisplay} imageUrl={sourceTx.chainImageUrl} />
              <DetailRow loading={loading} label="Hash" value={sourceTx.transactionHash} link={sourceTx.transactionExplorerUrl} />
              <DetailRow loading={loading} label="Status" value={sourceTx.statusDisplay} />
              <DetailRow loading={loading} label="From Address" value={sourceTx.from} link={sourceTx.fromExplorerUrl} />
              <DetailRow loading={loading} label="To Address" value={sourceTx.to} link={sourceTx.toExplorerUrl} />
              <DetailRow loading={loading} label="Value" value={sourceTx.valueDisplay} />
              <DetailRow loading={loading} label="Gas Limit" value={sourceTx.gasLimit} />
              <DetailRow loading={loading} label="Gas Used" value={sourceTx.gasUsed} />
              <DetailRow loading={loading} label="Gas Price" value={sourceTx.gasPriceDisplay} />
              <DetailRow loading={loading} label="Nonce" value={sourceTx.nonce} />
              <DetailRow loading={loading} label="Block Number" value={sourceTx.blockNumber} />
              <DetailRow loading={loading} label="Calldata" value={sourceTx.data} maxWidth={600} />
              {!!sourceTx.dataDecoded && (
                <DetailRow loading={loading} label="Decoded Calldata" value={
                  <DecodedSendDataTable data={sourceTx.dataDecoded} />
                } />
              )}
              <DetailRow loading={loading} label="Event Source Pool" value={sourcePoolDisplay} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

    {destinationTxs.map((destinationTx: any, i: number) => {

      const {
        data,
        dataDecoded,
        blockTimestamp,
        blockTimestampRelative,
        timestampDisplay,
        status,
        statusDisplay,
        value,
        valueDisplay,
        gasLimit,
        gasUsed,
        gasPrice,
        gasPriceDisplay,
        nonce,
        blockNumber,
        fromDisplay,
        fromExplorerUrl,
        txTo,
        txToExplorerUrl,
        tokenAddress,
        tokenDisplay,
        claimId,
        chainDisplay,
        chainImageUrl,
        tokenExplorerUrl,
        amountDisplay,
        bonderFeeDisplay,
        to,
        toExplorerUrl,
        pathId,
        transactionHash,
        transactionExplorerUrl,
      } = destinationTx

        return (
          <Box ml={2} mb={4} key={i}>
            <Typography variant="h6" color="textPrimary" style={{ marginTop: 16 }}>Destination Transaction <small>(Hop #{i + 1})</small></Typography>
            <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }}>
              <TableContainer>
                <Table width="100%">
                  <TableBody>
                    <DetailRow loading={loading} label="Claim ID" value={claimId} />
                    <DetailRow loading={loading} label="Chain" value={chainDisplay} imageUrl={chainImageUrl} />
                    <DetailRow loading={loading} label="Token" value={tokenDisplay} link={tokenExplorerUrl} />
                    <DetailRow loading={loading} label="Timestamp" value={timestampDisplay} />
                    <DetailRow loading={loading} label="Transfer Amount" value={amountDisplay} />
                    <DetailRow loading={loading} label="Bonder Fee" value={bonderFeeDisplay} />
                    <DetailRow loading={loading} label="Recipient" value={to} link={toExplorerUrl} />
                    <DetailRow loading={loading} label="Path ID" value={pathId} link={`/p/${pathId}`} />
                    <DetailRow loading={loading} label="Hash" value={transactionHash} link={transactionExplorerUrl} />
                    <DetailRow loading={loading} label="Status" value={statusDisplay} />
                    <DetailRow loading={loading} label="From Address (Bonder)" value={fromDisplay} link={fromExplorerUrl} />
                    <DetailRow loading={loading} label="To Address" value={txTo} link={txToExplorerUrl} />
                    <DetailRow loading={loading} label="Value" value={valueDisplay} />
                    <DetailRow loading={loading} label="Gas Limit" value={gasLimit} />
                    <DetailRow loading={loading} label="Gas Used" value={gasUsed} />
                    <DetailRow loading={loading} label="Gas Price" value={gasPriceDisplay} />
                    <DetailRow loading={loading} label="Nonce" value={nonce} />
                    <DetailRow loading={loading} label="Block Number" value={blockNumber} />
                    <DetailRow loading={loading} label="Calldata" value={data} maxWidth={600} />
                    {!!dataDecoded && (
                      <DetailRow loading={loading} label="Decoded Calldata" value={
                        <DecodedBondDataTable data={dataDecoded} />
                      } />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )
      })}
    </Box>
  )
}
