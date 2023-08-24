import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@material-ui/core'
import Button from 'src/components/buttons/Button'
import { Div } from 'src/components/ui'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Alert from 'src/components/alert/Alert'

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
    canClaim,
    prevStep,
    delegate,
    setStep,
    error,
    setError,
    merkleRootSet
  } = props
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <>
      <Div
        px={[3, 5]}
        py={4}
        maxWidth={step === 1 ? '1100px' : '520px'}
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
        {(warning || !merkleRootSet) ? (
          <Box m={4}>
            <Typography variant="body1">
              {warning || 'Claiming is not open yet. Please wait until further announcement.'}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" width="100%" textAlign="left">
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

      {canClaim && step > 0 && step < 4 && (
        <Box display="flex" maxWidth={"400px"} mt={4} justifyContent="center" width="100%" px={[1, 5]}>
          <Button onClick={prevStep} disabled={claiming}>Go Back</Button>
        </Box>
      )}

      {canClaim && step === 4 && (
        <Box display="flex" maxWidth={"400px"} mt={4} justifyContent="center" width="100%" px={[1, 5]}>
          <Button highlighted disabled={!delegate?.address} onClick={() => {
              setStep(0)
              navigate('/')
            }}>Go Home</Button>
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
