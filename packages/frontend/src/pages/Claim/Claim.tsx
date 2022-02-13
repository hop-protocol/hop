import React, { useState } from 'react'
import { Claiming, Claimed } from 'src/pages/Claim'
import { Div, Flex, Text } from 'src/components/ui'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { Loading } from 'src/components/Loading'
import { ChooseDelegate } from './ChooseDelegate'
import { ReviewClaim } from './ReviewClaim'
import { ClaimTokens } from './ClaimTokens'
import { useClaim } from './useClaim'
import { ClaimWrapper } from './ClaimWrapper'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { correctClaimChain } from 'src/utils/claims'

export function Claim() {
  const { isDarkMode } = useThemeMode()
  const { connectedNetworkId } = useWeb3Context()
  const [step, setStep] = useState(0)
  const nextStep = () => setStep(val => val + 1)
  const prevStep = () => setStep(val => val - 1)
  const {
    claimableTokens,
    loading,
    warning,
    sendClaimTokens,
    claiming,
    inputValue,
    setInputValue,
    claimTokensTx,
    delegate,
    setDelegate,
  } = useClaim()

  async function claimTokens() {
    try {
      const res = await sendClaimTokens()
      console.log(`res:`, res)
      if (res?.status === 1) {
        nextStep()
      }
    } catch (error) {
      // no-op
    }
  }

  const steps = [
    <ClaimTokens
      key="Claim your tokens"
      claimableTokens={claimableTokens}
      nextStep={nextStep}
      isDarkMode={isDarkMode}
    />,
    <ChooseDelegate
      key="Choose a delegate"
      setInputValue={setInputValue}
      inputValue={inputValue}
      delegate={delegate}
      selectDelegate={setDelegate}
    />,
    <ReviewClaim
      key="Review your claim"
      claimableTokens={claimableTokens}
      prevStep={prevStep}
      delegate={delegate}
      isDarkMode={isDarkMode}
      handleClaimTokens={() => {
        nextStep()
        claimTokens()
      }}
    />,
    <Claiming
      key="Confirm with wallet"
      claiming={claiming}
      isDarkMode={isDarkMode}
      tx={claimTokensTx}
      delegate={delegate}
    />,
    <Claimed key="Claim successful!" />,
  ]

  return (
    <Flex column justifyCenter alignCenter>
      <Div>
        {loading ? (
          <Flex column alignCenter p={6}>
            <Loading size={78} load />
            <Text mt={5} fontSize={4} secondary>
              Loading...
            </Text>
          </Flex>
        ) : (
          <ClaimWrapper
            isDarkMode={isDarkMode}
            connectedNetworkId={connectedNetworkId}
            correctClaimChain={correctClaimChain}
            claimableTokens={claimableTokens}
            title={steps[step].key}
            warning={warning}
            step={step}
            prevStep={prevStep}
            nextStep={nextStep}
            handleClaimTokens={claimTokens}
            delegate={delegate}
            claiming={claiming}
            inputValue={inputValue}
            setInputValue={setInputValue}
            setStep={setStep}
          >
            {steps[step]}
          </ClaimWrapper>
        )}
      </Div>
    </Flex>
  )
}
