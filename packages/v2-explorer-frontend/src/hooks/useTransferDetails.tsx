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
    <Chip icon={<PendingIcon />} label="Pending" />
  );

  const formatValue = (value: string, decimals: number, suffix = '') => value ? `${utils.formatUnits(value, decimals)} ${suffix}` : null;
  const formatEtherValue = (value: string) => value ? `${utils.formatEther(value)} ETH` : null;

  const sourceTxValueDisplay = formatEtherValue(context?.value);
  const sourceTxGasPriceDisplay = formatValue(context?.gasPrice, 9, 'gwei');
  const destinationAmountOutDisplay = formatValue(bondedEvent?.amountOut, tokenDecimals, tokenSymbol);

  return {
    transferId,
    status,
    token,
    context,
    destinationContext,
    tokenName,
    tokenSymbol,
    sourceTxValueDisplay,
    sourceTxGasPriceDisplay,
    destinationAmountOutDisplay,
    loading: !(!isFetching && event),
    sdk,
    event,
  };
};
