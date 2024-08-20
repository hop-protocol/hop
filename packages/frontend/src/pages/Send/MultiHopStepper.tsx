import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DotIcon from '@mui/icons-material/FiberManualRecord'
import PlaceIcon from '@mui/icons-material/Place'
import { useV2 } from '#hooks/useV2.js'

export type Props = {
  steps: string[]
}

export function MultiHopStepper(props: Props) {
  const { steps } = props
  const { v2Sdk } = useV2()

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="center"><Typography variant="body1" color="secondary">Hops</Typography></Box>
      <Stepper alternativeLabel>
        {steps.map((chainId, index) => {
          const info = v2Sdk?.utils?.getChainInfo(chainId)
          const label = info?.name ?? ''
          const imageUrl = info?.imageUrl ?? ''

          return (
            <Step key={chainId}>
              <StepLabel
                icon={
                  index === 0 ? (
                    <DotIcon fontSize="large" />
                  ) : index === steps.length - 1 ? (
                    <PlaceIcon fontSize="large" />
                  ) : (
                    <ArrowForwardIcon fontSize="large" />
                  )
                }
              >
                <Box>
                  <Typography variant="body1">{label}</Typography>
                  {imageUrl && (
                    <img width={'16px'} src={imageUrl} alt={label} />
                  )}
                </Box>
              </StepLabel>
            </Step>
          )
        }
      )}
      </Stepper>
    </Box>
  )
}
