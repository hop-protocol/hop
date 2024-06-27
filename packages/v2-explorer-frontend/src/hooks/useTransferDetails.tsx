import { useMemo } from 'react';
import { Hop } from '@hop-protocol/v2-sdk';
import { utils } from 'ethers';
import { useLocation } from 'react-router-dom';
import { useEvents } from './useEvents';
import { networkSlug } from '../config';
import PendingIcon from '@mui/icons-material/Pending'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'

export const useTransferDetails = () => {
  const location = useLocation();
  const parts = location.pathname.split('/');
  const transferId = parts[2];
  const sdk = useMemo(() => new Hop({ network: networkSlug }), []);

  const filter = { transferId };
  const { events, loading: isFetching } = useEvents('explorer', filter);
  const event = events[0];
  const bondedEvent = event?.transferBondedEvent;
  const token = event?.token;
  const context = event?.context;
  const destinationContext = event?.transferBondedEvent?.context;

  const tokenDecimals = token?.decimals;
  const tokenSymbol = token?.symbol;
  const tokenName = token?.name;

  const isBonded = !!bondedEvent;
  const status = isBonded ? (
    <Chip icon={<CheckIcon style={{ color: '#fff' }} />} label="Bonded" style={{ backgroundColor: '#74d56e', color: '#fff' }} />
  ) : (
    <Chip icon={<PendingIcon />} label="Pending" color="secondary" />
  );

  const formatValue = (value: string, decimals: number, suffix = '') => value ? `${utils.formatUnits(value, decimals)} ${suffix}` : null;
  const formatEtherValue = (value: string) => value ? `${utils.formatEther(value)} ETH` : null;

  // const sourceTxValueDisplay = formatEtherValue(context?.value);
  // const sourceTxGasPriceDisplay = formatValue(context?.gasPrice, 9, 'gwei');
  // const destinationAmountOutDisplay = formatValue(bondedEvent?.amountOut, tokenDecimals, tokenSymbol);

  const counterpartToken = event?.counterpartToken

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
  const sourceTxChainImageUrl = context?.chainImageUrl
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
  const destinationChainImageUrl = event?.toChainImageUrl
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

  return {
    transferId,
    status,
    token,
    context,
    destinationContext,
    tokenName,
    tokenSymbol,
    transferAmount,
    transferAmountFormatted,
    transferAmountDisplay,
    checkpointTotalSent,
    checkpointTotalSentFormatted,
    checkpointTotalSentDisplay,
    transferRecipient,
    transferRecipientExplorerUrl,
    attestationFeeDisplay,
    checkpoint,
    transferNonce,
    pathId,
    sourceTxValue,
    sourceTxValueFormatted,
    sourceTxValueDisplay,
    sourceTxTransactionHash,
    sourceTxTransactionExplorerUrl,
    sourceTxGasLimit,
    sourceTxNonce,
    sourceTxGasUsed,
    sourceTxGasPrice,
    sourceTxGasPriceFormatted,
    sourceTxGasPriceDisplay,
    sourceTxStatus,
    sourceTxFrom,
    sourceTxChainId,
    sourceTxChainDisplay,
    sourceTxChainImageUrl,
    sourceTxFromExplorerUrl,
    sourceTxTo,
    sourceTxToExplorerUrl,
    sourceTokenAddress,
    sourceTokenDisplay,
    sourceTokenExplorerUrl,
    sourceTxStatusDisplay,
    sourceTxBlockTimestamp,
    sourceTxBlockTimestampRelative,
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
    destinationTokenAddress,
    destinationTokenDisplay,
    destinationTokenExplorerUrl,
    destinationTxData,
    loading,
  };
};
