import React, { useEffect, useState } from 'react'
import { Link, useTheme } from '@material-ui/core'
import Button from 'src/components/buttons/Button'
import { Div, Flex } from 'src/components/ui'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Alert from 'src/components/alert/Alert'

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
    delegate,
    setStep,
    error,
    setError
  } = props
  const theme = useTheme()

  return (
    <>
      <Div
        px={[3, 5]}
        py={4}
        maxWidth={step === 1 ? '900px' : '520px'}
        minWidth={[0, '520px']}
        mx={[0, 4]}
        borderRadius={30}
        boxShadow={isDarkMode ? 'innerDark' : 'innerLight'}
        mt={mt}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" textAlign="center" p={6}>
            <CircularProgress size={24} />
            <Box ml={2}>
              <Typography variant="body1">
                Loading...
              </Typography>
            </Box>
          </Box>
        ) : (
        <>
        {warning ? (
          <Box m={4}>
            <Typography variant="body1">
              {warning}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" width="100%" textAlign="center">
              <Typography variant="h4">
                  {title}
              </Typography>
            </Box>
            {children}
          </Box>
        )}
        </>
        )}
      </Div>

      {(step > 0 && step < 4) && (
        <Box display="flex" maxWidth={"400px"} mt={4} justifyContent="center" width="100%" px={[1, 5]}>
          <Button onClick={prevStep} disabled={claiming}>Go Back</Button>
        </Box>
      )}

      {step === 4 && (
        <Box display="flex" maxWidth={"400px"} mt={4} justifyContent="center" width="100%" px={[1, 5]}>
          <Link href="/" onClick={() => setStep(0)}>
            <Button highlighted disabled={!delegate?.address}>Go Home</Button>
          </Link>
        </Box>
      )}

      {!!error && (
        <Box mt={4} display="flex" justifyContent="center" alignItems="center">
          <Alert severity="error" text={error} onClose={() => setError('')} />
        </Box>
      )}
    </>
  )
}
