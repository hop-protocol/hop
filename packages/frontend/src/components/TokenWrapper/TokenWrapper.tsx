import Box from '@mui/material/Box'
import Expandable from '#components/TokenWrapper/Expandable.js'
import Network from '#models/Network.js'
import React, { FC, useEffect } from 'react'
import { Alert } from '#components/Alert/index.js'
import { AmountSelectorCard } from '#components/AmountSelectorCard/index.js'
import { Button } from '#components/Button/index.js'
import { constants } from 'ethers'
import { makeStyles } from '@mui/styles'
import { useTokenWrapper } from './TokenWrapperContext.js'
import { TokenSymbol } from '@hop-protocol/sdk'

const useStyles = makeStyles(theme => ({
  button: {
    margin: `0 ${theme.padding.light}`,
    minWidth: '11rem'
  },
  warning: {
    marginBottom: theme.padding.default,
  },
}))

export type Props = {
  network: Network | undefined
}

const TokenWrapper: FC<Props> = (props: Props) => {
  const styles = useStyles()
  const {
    selectedNetwork,
    setSelectedNetwork,
    canonicalToken,
    wrappedToken,
    amount,
    setAmount,
    wrap,
    unwrap,
    canonicalTokenBalance,
    wrappedTokenBalance,
    isWrapping,
    isUnwrapping,
    error,
    setError,
    isNativeToken,
  } = useTokenWrapper()

  useEffect(() => {
    if (props.network) {
      setSelectedNetwork(props.network)
    }
  }, [props.network])

  const handleWrapClick = (event: any) => {
    event.preventDefault()
    wrap()
  }

  const handleUnwrapClick = (event: any) => {
    event.preventDefault()
    unwrap()
  }

  const isWrappedTokenValid = wrappedToken?.address !== constants.AddressZero
  const hasWrappedToken = wrappedTokenBalance?.gt(0)
  const hasNativeToken = canonicalTokenBalance?.gt(0)
  const loadingBalance = !(canonicalTokenBalance && wrappedTokenBalance)

  if (!isNativeToken || !isWrappedTokenValid) {
    return null
  }

  let canonicalTokenSymbol = canonicalToken?.symbol ?? ''
  let wrappedTokenSymbol = wrappedToken?.symbol ?? ''
  if (canonicalTokenSymbol === TokenSymbol.MATIC) {
    canonicalTokenSymbol = canonicalTokenSymbol?.startsWith('W') ? 'WPOL' : 'POL'
    wrappedTokenSymbol = wrappedTokenSymbol?.startsWith('W') ? 'WPOL' : 'POL'
  }

  return (
    <Expandable title={`Click here to Wrap or Unwrap ${canonicalTokenSymbol}`}>
      <Box display="flex" alignItems="center" my={1} justifyContent="space-around" width="100%">
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          <AmountSelectorCard
            secondaryToken={canonicalToken}
            secondaryBalance={canonicalTokenBalance}
            loadingSecondaryBalance={loadingBalance}
            secondaryBalanceLabel={`${canonicalTokenSymbol}:`}
            value={amount}
            token={wrappedToken}
            onChange={setAmount}
            titleIconUrl={canonicalToken?.image}
            title={'Amount'}
            balance={wrappedTokenBalance}
            balanceLabel={`${wrappedTokenSymbol}:`}
            loadingBalance={loadingBalance}
            hideSymbol
            decimalPlaces={4}
            methodName="wrapToken"
            selectedNetwork={selectedNetwork}
            maxButtonLeaveSmallAmount={true}
          />

          <Box display="flex" my={3} width="100%" justifyContent="space-around" alignItems="center" flexWrap="wrap">
            <Box mb={[3]}>
              <Button
                className={styles.button}
                highlighted={hasNativeToken}
                disabled={isWrapping || !hasNativeToken}
                onClick={handleWrapClick}
                loading={isWrapping}
              >
                Wrap
              </Button>
            </Box>
            <Box mb={3}>
              <Button
                className={styles.button}
                highlighted={hasWrappedToken}
                disabled={isUnwrapping || !hasWrappedToken}
                onClick={handleUnwrapClick}
                loading={isUnwrapping}
              >
                Unwrap
              </Button>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" width="100%">
            <Alert severity="error" onClose={() => setError(null)} text={error} />
          </Box>
        </Box>
      </Box>
    </Expandable>
  )
}

export default TokenWrapper
