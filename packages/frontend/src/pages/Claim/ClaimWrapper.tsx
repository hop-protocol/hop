import React, { useEffect, useState } from 'react'
import { Link, useTheme } from '@material-ui/core'
import { BigNumber } from 'ethers'
import Button from 'src/components/buttons/Button'
import { Circle, Div, Flex, Icon, Input } from 'src/components/ui'
import { Loading } from 'src/components/Loading'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const respMaxWidths = [350, 824, 824, 1024]

export function ClaimWrapper(props: any) {
  const {
    children,
    loading,
    isDarkMode,
    mt,
    title,
    warning,
    step,
    claiming,
    prevStep,
    nextStep,
    delegate,
    claimableTokens,
    setStep,
  } = props
  const [canTryAgain, setCanTryAgain] = useState(false)

  useEffect(() => {
    const cta = claimableTokens.gt(0) && !!delegate?.ensName

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
        maxWidth={step === 1 ? respMaxWidths : step === 2 ? [350, 420, 750] : [350, 420, 500]}
        width={step === 2 ? [350, 690] : 'auto'}
        mx={[0, 4]}
        borderRadius={30}
        boxShadow={isDarkMode ? 'innerDark' : 'innerLight'}
        mt={mt}
      >
        {loading ? (
          <Flex column alignCenter p={6}>
            <Loading size={40} load />
            <Box my={4}>
              <Typography variant="subtitle2">
                Loading...
              </Typography>
            </Box>
          </Flex>
        ) : (
        <>
        {warning ? (
          <Div m={4} fontSize={16} bold color="text.primary">
            {warning}
          </Div>
        ) : (
          <Div>
            <Flex column fullWidth>
              <Box display="flex" flexDirection="column" justifyContent="space-between" width="100%" textAlign="center">
                <Div fontSize={[18, 4, 5]} color="text.primary">
                  {title}
                </Div>
              </Box>
            </Flex>
            {children}
          </Div>
        )}
        </>
        )}
      </Div>

      {step === 1 && ( // Choose Delegate
        <Box display="flex" maxWidth={"400px"} mt={4} width="100%" justifyContent="space-between" px={[1, 5]}>
          <Button onClick={prevStep}>Go Back </Button>
          <Button onClick={nextStep} highlighted disabled={!delegate?.address}>
            Continue
          </Button>
        </Box>
      )}

      {step === 2 && ( // Review
        <Box display="flex" maxWidth={"400px"} mt={4} justifyContent="center" width="100%" px={[1, 5]}>
          <Button onClick={prevStep}>Go Back </Button>
        </Box>
      )}

      {step === 3 && ( // Claiming
        <Box display="flex" maxWidth={"400px"} mt={4} justifyContent="center" width="100%" px={[1, 5]}>
          <Button onClick={prevStep} disabled={claiming || !canTryAgain}>
            Back
          </Button>
        </Box>
      )}

      {step === 4 && ( // Claimed
        <Div maxWidth={respMaxWidths} mt={4} fullWidth>
          <Flex justifyCenter fullWidth px={[1, 5]}>
            <Link href="/" onClick={() => setStep(0)}>
              <Button highlighted disabled={!delegate?.address}>
                Go Home
              </Button>
            </Link>
          </Flex>
        </Div>
      )}
    </>
  )
}
