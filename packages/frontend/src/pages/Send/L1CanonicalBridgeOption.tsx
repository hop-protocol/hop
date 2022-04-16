import React from 'react'
import { Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { Div, Flex } from 'src/components/ui'
import { toTokenDisplay } from 'src/utils'
import Chain from 'src/models/Chain'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons'

interface Props {
  amount?: BigNumber
  destinationChain?: Chain
  destToken?: Token
  estimatedReceivedDisplay?: string
  l1CanonicalBridge?: CanonicalBridge
  selectNativeBridge: (u: boolean) => void
  usingNativeBridge?: boolean
}

function L1CanonicalBridgeOption(props: Props) {
  const {
    amount,
    destinationChain,
    destToken,
    estimatedReceivedDisplay,
    l1CanonicalBridge,
    selectNativeBridge,
    usingNativeBridge,
  } = props

  return (
    <Flex width={'50rem'} mt={3} pointer color="text.secondary">
      {l1CanonicalBridge && (
        <Div fullWidth>
          <Flex fullWidth justifyBetween px={4} onClick={() => selectNativeBridge(false)}>
            <Flex alignCenter>
              <Flex mr={2}>
                {usingNativeBridge ? <RadioButtonUnchecked /> : <RadioButtonChecked />}
              </Flex>
              <Flex>Hop Bridge</Flex>
            </Flex>
            <Flex>{estimatedReceivedDisplay}</Flex>
          </Flex>
          <Flex fullWidth justifyBetween px={4} onClick={() => selectNativeBridge(true)}>
            <Flex alignCenter>
              <Flex mr={2}>
                {usingNativeBridge ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
              </Flex>
              <Flex>Native {destinationChain?.name} Bridge</Flex>
            </Flex>
            <Flex>{toTokenDisplay(amount, destToken?.decimals, destToken?.symbol)}</Flex>
          </Flex>
        </Div>
      )}
    </Flex>
  )
}

export default L1CanonicalBridgeOption
