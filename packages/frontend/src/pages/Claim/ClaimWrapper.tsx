import React, { useEffect, useState } from 'react'
import { Link, Typography, useTheme } from '@material-ui/core'
import { BigNumber } from 'ethers'
import { StyledButton } from 'src/components/buttons/StyledButton'
import { Div, Flex, Input } from 'src/components/ui'

const respMaxWidths = [350, 824, 824, 1024]

export function ClaimWrapper(props: any) {
  const {
    children,
    isDarkMode,
    mt,
    title,
    warning,
    step,
    claiming,
    prevStep,
    nextStep,
    handleClaimTokens,
    delegate,
    claimableTokens,
    inputValue,
    setInputValue,
    setStep,
  } = props
  const [canTryAgain, setCanTryAgain] = useState(false)

  useEffect(() => {
    const cta = BigNumber.from(claimableTokens).gt(0) && !!delegate?.ensName

    if (!claiming && cta) {
      return setCanTryAgain(true)
    }

    setCanTryAgain(false)
  }, [claimableTokens, claiming, delegate])

  const theme = useTheme()

  return (
    <>
      <Div
        p={['18px 24px', '36px 46px']}
        fontWeight="600"
        maxWidth={step === 1 ? respMaxWidths : step === 2 ? [350, 420, 650] : [350, 420, 500]}
        width={step === 2 ? [350, 650] : 'auto'}
        mx={[0, 4]}
        borderRadius={30}
        boxShadow={isDarkMode ? 'innerDark' : 'innerLight'}
        mt={mt}
      >
        {warning ? (
          <Div m={4} fontSize={16} bold color="text.primary">
            {warning}
          </Div>
        ) : (
          <>
            <Flex column>
              <Flex justifyBetween fullWidth alignCenter>
                <Typography variant="h4">{title}</Typography>
                {step === 1 && (
                  <Input
                    width={[150, 300, 440]}
                    value={inputValue}
                    placeholder="Enter ENS or address"
                    onChange={e => setInputValue(e.target.value)}
                    bg="background.default"
                    boxShadow={theme.boxShadow.inner}
                    color="text.secondary"
                    fontSize={[0, 1, 2]}
                    border={inputValue && `1px solid ${theme.palette.primary.main}`}
                  />
                )}
              </Flex>
            </Flex>
            {children}
          </>
        )}
      </Div>

      {step === 1 && ( // Choose Delegate
        <Div maxWidth={respMaxWidths} mt={4} fullWidth>
          <Flex justifyBetween fullWidth px={[1, 5]}>
            <StyledButton onClick={prevStep}>Go Back </StyledButton>
            <StyledButton onClick={nextStep} highlighted disabled={!delegate?.ensName}>
              Next
            </StyledButton>
          </Flex>
        </Div>
      )}

      {step === 3 && ( // Claiming
        <Div mt={4}>
          <Flex justifyBetween fullWidth px={[1, 5]}>
            <StyledButton onClick={prevStep} disabled={claiming || !canTryAgain}>
              Back
            </StyledButton>
            <StyledButton
              onClick={handleClaimTokens}
              highlighted
              disabled={claiming || !canTryAgain}
            >
              Try again
            </StyledButton>
          </Flex>
        </Div>
      )}

      {step === 4 && ( // Claimed
        <Div maxWidth={respMaxWidths} mt={4} fullWidth>
          <Flex justifyCenter fullWidth px={[1, 5]}>
            {/* TODO: change to <Link to='/send' />  */}
            <Link href="/">
              <StyledButton highlighted disabled={!delegate?.ensName}>
                Dashboard
              </StyledButton>
            </Link>
          </Flex>
        </Div>
      )}
    </>
  )
}
