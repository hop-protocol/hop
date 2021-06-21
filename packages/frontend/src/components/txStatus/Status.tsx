import React, { FC, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepConnector from '@material-ui/core/StepConnector'
import Check from '@material-ui/icons/Check'
import CircularProgress from '@material-ui/core/CircularProgress'
import Zoom from '@material-ui/core/Zoom'
import { StepIconProps } from '@material-ui/core/StepIcon'
import CloseIcon from '@material-ui/icons/Close'
import WarningIcon from '@material-ui/icons/Warning'
import Transaction from 'src/models/Transaction'
import Alert from 'src/components/alert/Alert'
import { useStatus } from './StatusContext'

const useStyles = makeStyles(theme => ({
  normal: {},
  mini: {
    transform: 'scale(0.6)',
    transformOrigin: 'top left',
    height: '60px'
  },
  title: {
    marginBottom: '4.2rem'
  },
  box: {
    marginBottom: '2rem',
    flexDirection: 'column'
  },
  stepLabelRoot: {
    width: '9rem',
  },
  stepLabel: {
    fontSize: '2rem'
  },
  stepLink: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  notice: {
    marginBottom: '2rem'
  }
}))

const CustomStepConnector = withStyles({
  root: {},
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)'
  },
  active: {
    '& $line': {
      borderColor: '#B32EFF'
    }
  },
  completed: {
    '& $line': {
      borderColor: '#B32EFF'
    }
  },
  line: {
    borderColor: '#dbdbe8',
    borderTopWidth: 3,
    borderRadius: 1,
  }
})(StepConnector)

const useStepIconStyles = makeStyles({
  root: {
    color: '#dbdbe8',
    display: 'flex',
    height: 22,
    alignItems: 'center'
  },
  active: {
    color: '#B32EFF'
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  },
  bg: {
    background: '#f0f0f3',
    zIndex: 1
  },
  completed: {
    color: '#B32EFF',
    zIndex: 1,
    fontSize: '4rem'
  },
  failure: {
    color: '#ff00a7',
    zIndex: 1,
    fontSize: '4rem'
  },
  warning: {
    color: '#ffb47c',
    zIndex: 1,
    fontSize: '4rem'
  }
})

function StepIcon (props: StepIconProps) {
  const styles = useStepIconStyles()
  const { active, completed } = props
  const loader = active && !completed

  return (
    <div
      className={clsx(styles.root, {
        [styles.active]: active
      })}
    >
      <div className={styles.bg}>
        {completed ? (
          <Zoom in={true} style={{ transitionDelay: '0ms' }}>
            <Check className={styles.completed} />
          </Zoom>
        ) : loader ? (
          <CircularProgress size={24} thickness={5} />
        ) : (
          <div className={styles.circle} />
        )}
      </div>
    </div>
  )
}

function StepFailIcon (props: StepIconProps) {
  const styles = useStepIconStyles()
  return (
    <div
      className={clsx(styles.root, {
        [styles.active]: true
      })}
    >
      <div className={styles.bg}>
        <Zoom in={true} style={{ transitionDelay: '0ms' }}>
          <CloseIcon className={styles.failure} />
        </Zoom>
      </div>
    </div>
  )
}

function StepWarningIcon (props: StepIconProps) {
  const styles = useStepIconStyles()
  return (
    <div
      className={clsx(styles.root, {
        [styles.active]: true
      })}
    >
      <div className={styles.bg}>
        <Zoom in={true} style={{ transitionDelay: '0ms' }}>
          <WarningIcon className={styles.warning} />
        </Zoom>
      </div>
    </div>
  )
}

export type StatusProps = {
  tx: Transaction
  variant?: string
}

const Status: FC<StatusProps> = (props: StatusProps) => {
  const { tx, variant } = props
  const styles = useStyles()
  const { steps, activeStep, setTx, receivedHToken } = useStatus()

  useEffect(() => {
    setTx(tx)
  }, [tx])

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={variant === 'mini' ? styles.mini : styles.normal}
    >
      {variant !== 'mini' ? (
        <Box display="flex" alignItems="center">
          <Typography variant="h4" className={styles.title}>
            Status
          </Typography>
        </Box>
      ) : null}
      <Box display="flex" alignItems="center" className={styles.box}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<CustomStepConnector />}
        >
          {steps.map(step => {
            let icon = StepIcon
            if (step.warning) {
              icon = StepWarningIcon
            } else if (step.error) {
              icon = StepFailIcon
            }
            return (
            <Step key={step.text}>
              <StepLabel
                classes={{
                  root: styles.stepLabelRoot,
                  label: styles.stepLabel
                }}
                StepIconComponent={icon}
              >
                {step.url ? (
                  <a
                    className={styles.stepLink}
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {step.text}
                  </a>
                ) : (
                  step.text
                )}
              </StepLabel>
            </Step>
        )
        })}
        </Stepper>
      </Box>
      {variant !== 'mini' && tx?.token && receivedHToken ? <>
        <Box display="flex" alignItems="center" className={styles.notice}>
      <Alert severity="warning">
          Destination token swap did not fully complete possibly due to short deadline. You may swap h{tx.token.symbol} for {tx.token.symbol} tokens on the <Link href="/convert/amm">Convert</Link> page.
      </Alert>
      </Box>
      </>
      : null}
    </Box>
  )
}

export default Status
