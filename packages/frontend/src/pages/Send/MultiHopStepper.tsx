import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DotIcon from '@mui/icons-material/FiberManualRecord'
import PlaceIcon from '@mui/icons-material/Place'
import Link from '@mui/material/Link'
import { useV2 } from '#hooks/useV2.js'
import { getTruncatedHash } from '#utils/index.js'

export type Props = {
  steps: string[]
  transferStatus: any
}

export function MultiHopStepper(props: Props) {
  const { steps, transferStatus } = props
  const { v2Sdk } = useV2()

  const items = steps.map((chainId: string, i: number) => {
    const obj: any = {}

    if (i === 0) {
      if (transferStatus?.transferSentEvent) {
        obj.label = 'Send Tx'
        obj.transactionHash = transferStatus?.transferSentEvent?.transactionHash
        obj.transactionHashExplorerUrl = transferStatus?.transferSentEvent?.transactionHashExplorerUrl
        obj.transactionHashTruncated = getTruncatedHash(transferStatus?.transferSentEvent?.transactionHash)
      }
    } else {
      const bondEvent = transferStatus?.transferBondedEvents?.find((event: any) => {
        return event.context.chainId.toString() === chainId.toString()
      })
      if (bondEvent) {
        obj.label = 'Bond Tx'
        obj.transactionHash = bondEvent.transactionHash
        obj.transactionHashExplorerUrl = bondEvent.transactionHashExplorerUrl
        obj.transactionHashTruncated = getTruncatedHash(bondEvent.transactionHash)
      }
    }

    return {
      chainId,
      ...obj
    }
  })

  let firstPulsateSet = false

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="center"><Typography variant="body1" color="secondary">Hops</Typography></Box>
      <Stepper alternativeLabel>
        {items.map((item, index) => {
          const { chainId, transactionHash, transactionHashTruncated, transactionHashExplorerUrl, label } = item
          const info = v2Sdk?.utils?.getChainInfo(chainId)
          const chainName = info?.name ?? ''
          const imageUrl = info?.imageUrl ?? ''
          const pulsate = !transactionHash && !firstPulsateSet
          if (!transactionHash && !firstPulsateSet) {
            firstPulsateSet = true
          }

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
                  <Typography variant="body1">{chainName}</Typography>

                  {imageUrl && (
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        width: 20,
                        height: 20,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          transform: 'translate(-50%, -50%)',
                          ...(pulsate && {
                            backgroundColor: 'rgb(223 128 198 / 50%)',
                            animation: 'pulse 1.5s infinite',
                          }),
                        },
                      }}
                    >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                      <style>
                        {`
                          @keyframes pulse {
                            0% {
                              transform: translate(-50%, -50%) scale(1);
                              opacity: 1;
                            }
                            100% {
                              transform: translate(-50%, -50%) scale(1.5);
                              opacity: 0;
                            }
                          }
                        `}
                      </style>
                    </Box>
                  )}

                  <Box>
                    {(transactionHashTruncated && transactionHashExplorerUrl) && (
                      <Box display="flex" alignItems="center">
                        <Typography sx={{ whiteSpace: 'nowrap' }} variant="body2" mr={1}>{label}:</Typography>
                        <Typography variant="body2">
                          <Link href={transactionHashExplorerUrl} target="_blank" sx={{ whiteSpace: 'nowrap' }}>
                            {transactionHashTruncated} ↗
                          </Link>
                        </Typography>
                      </Box>
                    )}
                  </Box>
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
