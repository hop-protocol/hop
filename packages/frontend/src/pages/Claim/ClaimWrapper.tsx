import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Alert } from 'src/components/Alert'

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
  const navigate = useNavigate()

  return (
    <>
      <Box
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
      </Box>

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
