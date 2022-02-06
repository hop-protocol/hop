import React from 'react'
import { Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { Div, Flex } from 'src/components/ui'
import { toTokenDisplay } from 'src/utils'
import Network from 'src/models/Network'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons'

interface Props {
  amount?: BigNumber
  destNetwork?: Network
  destToken?: Token
  estimatedReceivedDisplay?: string
  l1CanonicalBridge?: CanonicalBridge
  sendL1CanonicalBridge?: () => void
  setUl1cb: (u: boolean) => void
  usingL1CanonicalBridge?: boolean
}

function L1CanonicalBridgeOption(props: Props) {
  const {
    amount,
    destNetwork,
    destToken,
    estimatedReceivedDisplay,
    l1CanonicalBridge,
    setUl1cb,
    usingL1CanonicalBridge,
  } = props

  return (
    <Flex width={'50rem'} mt={3} pointer color='text.secondary'>
      {l1CanonicalBridge && (
        <Div fullWidth>
          <Flex fullWidth justifyBetween px={4} onClick={() => setUl1cb(false)}>
            <Flex alignCenter>
              <Flex mr={2}>
                {usingL1CanonicalBridge ? <RadioButtonUnchecked /> : <RadioButtonChecked />}
              </Flex>
              <Flex>Hop Bridge</Flex>
            </Flex>
            <Flex>{estimatedReceivedDisplay}</Flex>
          </Flex>
          <Flex fullWidth justifyBetween px={4} onClick={() => setUl1cb(true)}>
            <Flex alignCenter>
              <Flex mr={2}>
                {usingL1CanonicalBridge ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
              </Flex>
              <Flex>Native {destNetwork?.name} Bridge</Flex>
            </Flex>
            <Flex>{toTokenDisplay(amount, destToken?.decimals, destToken?.symbol)}</Flex>
          </Flex>
        </Div>
      )}
    </Flex>
  )
}

export default L1CanonicalBridgeOption
