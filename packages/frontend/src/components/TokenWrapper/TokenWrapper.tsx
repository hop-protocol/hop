import React, { FC, useEffect } from 'react'
import { constants } from 'ethers'
import { makeStyles } from '@material-ui/core/styles'
import Button from 'src/components/buttons/Button'
import Box from '@material-ui/core/Box'
import Alert from 'src/components/alert/Alert'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import { useTokenWrapper } from './TokenWrapperContext'
import Network from 'src/models/Network'
import Expandable from './Expandable'
import { Div, Flex } from '../ui'

const useStyles = makeStyles(theme => ({
  button: {
    margin: `0 ${theme.padding.light}`,
    minWidth: '11rem',
    transition: 'all 0.15s ease-out, box-shadow 4s ease-out',
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

  return (
    <Expandable title="Wrap/Unwrap">
      <Flex alignCenter my={1} justifyAround fullWidth>
        <Flex column alignCenter fullWidth>
          <AmountSelectorCard
            secondaryToken={canonicalToken}
            secondaryBalance={canonicalTokenBalance}
            loadingSecondaryBalance={loadingBalance}
            secondaryBalanceLabel={`${canonicalToken?.symbol}:`}
            value={amount}
            token={wrappedToken}
            onChange={setAmount}
            titleIconUrl={canonicalToken?.image}
            title={'Amount'}
            balance={wrappedTokenBalance}
            balanceLabel={`${wrappedToken?.symbol}:`}
            loadingBalance={loadingBalance}
            hideSymbol
            decimalPlaces={2}
            methodName="wrapToken"
            selectedNetwork={selectedNetwork}
          />

          <Flex my={3} fullWidth justifyAround alignCenter $wrap>
            <Div mb={[3]}>
              <Button
                className={styles.button}
                highlighted={hasNativeToken}
                disabled={isWrapping || !hasNativeToken}
                onClick={handleWrapClick}
                loading={isWrapping}
              >
                Wrap
              </Button>
            </Div>
            <Div mb={[3]}>
              <Button
                className={styles.button}
                highlighted={hasWrappedToken}
                disabled={isUnwrapping || !hasWrappedToken}
                onClick={handleUnwrapClick}
                loading={isUnwrapping}
              >
                Unwrap
              </Button>
            </Div>
          </Flex>

          <Flex alignCenter fullWidth>
            <Alert severity="error" onClose={() => setError(null)} text={error} />
          </Flex>
        </Flex>
      </Flex>
    </Expandable>
  )
}

export default TokenWrapper
