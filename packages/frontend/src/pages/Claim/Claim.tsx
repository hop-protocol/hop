import Box from '@mui/material/Box'
import React, { useEffect, useState } from 'react'
import { ChooseDelegate } from 'src/pages/Claim/ChooseDelegate'
import { ClaimReview } from 'src/pages/Claim/ClaimReview'
import { ClaimStart } from 'src/pages/Claim/ClaimStart'
import { ClaimWrapper } from 'src/pages/Claim/ClaimWrapper'
import { Claimed, Claiming } from 'src/pages/Claim'
import { correctClaimChain } from 'src/pages/Claim/claims'
import { formatError } from 'src/utils/format'
import { useClaim } from 'src/pages/Claim/useClaim'
import { useQueryParams } from 'src/hooks'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { useWeb3Context } from 'src/contexts/Web3Context'

export function Claim() {
  const { isDarkMode } = useThemeMode()
  const { connectedNetworkId } = useWeb3Context()
  const [step, setStep] = useState(0)
  const [showTryAgain, setShowTryAgain] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [showInfoModal, setShowInfoModal] = useState<any>(false)
  const nextStep = () => setStep(val => val + 1)
  const prevStep = () => setStep(val => val - 1)
  const { queryParams } = useQueryParams()
  const {
    claimableTokens,
    canClaim,
    loading,
    warning,
    sendClaimTokens,
    claiming,
    inputValue,
    setInputValue,
    claimTokensTx,
    delegate,
    setDelegate,
    error,
    setError,
    hasManyVotes,
    hasAlreadyClaimed,
    setClaiming,
    merkleRootSet,
    checkNetwork
  } = useClaim()

  useEffect(() => {
    if (hasAlreadyClaimed) {
      setStep(4)
    } else if (step === 4) {
      setStep(0)
    }
  }, [hasAlreadyClaimed])

  async function claimTokens() {
    try {
      if (queryParams.demo === 'true') {
        setClaiming(true)
        setError('')
        setShowTryAgain(false)
        setTimeout(() => {
          nextStep()
        }, 2 * 1000)
        return
      }

      setError('')
      setShowTryAgain(false)
      const res = await sendClaimTokens()
      if (res?.status === 1) {
        setShowTryAgain(false)
        nextStep()
      } else {
        setShowTryAgain(true)
      }
    } catch (err) {
      console.error(err)
      setError(formatError(err))
      setShowTryAgain(true)
    }
  }

  function handleDelegateConfirm(confirmed: boolean) {
    setShowConfirmModal(false)
    if (confirmed) {
      nextStep()
    }
  }

  async function handleStartClaim() {
    try {
      await checkNetwork()
    } catch (err) { }
    nextStep()
  }

  const steps = [
    <ClaimStart
      key="Claim HOP"
      claimableTokens={claimableTokens}
      nextStep={handleStartClaim}
      isDarkMode={isDarkMode}
    />,
    <ChooseDelegate
      key="Choose a Delegate"
      setInputValue={setInputValue}
      inputValue={inputValue}
      delegate={delegate}
      showConfirmModal={showConfirmModal}
      setShowConfirmModal={setShowConfirmModal}
      showInfoModal={showInfoModal}
      setShowInfoModal={setShowInfoModal}
      handleDelegateConfirm={handleDelegateConfirm}
      onContinue={async () => {
        const tooMany = await hasManyVotes(delegate)
        if (tooMany) {
          setShowConfirmModal(true)
        } else {
          nextStep()
        }
      }}
      selectDelegate={setDelegate}
    />,
    <ClaimReview
      key="Review your Claim"
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
      key="Confirm with Wallet"
      claiming={claiming}
      isDarkMode={isDarkMode}
      tx={claimTokensTx}
      delegate={delegate}
      claimableTokens={claimableTokens}
      showTryAgain={showTryAgain}
      handleClaimTokens={() => {
        claimTokens()
      }}
    />,
    <Claimed key="" />,
  ]

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" textAlign="center">
      <ClaimWrapper
        loading={loading}
        isDarkMode={isDarkMode}
        connectedNetworkId={connectedNetworkId}
        correctClaimChain={correctClaimChain}
        claimableTokens={claimableTokens}
        canClaim={canClaim}
        merkleRootSet={merkleRootSet}
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
        error={error}
        setError={setError}
      >
        {steps[step]}
      </ClaimWrapper>
    </Box>
  )
}
