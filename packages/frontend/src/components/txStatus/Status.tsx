import React, { FC } from 'react'
import clsx from 'clsx'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepConnector from '@material-ui/core/StepConnector'
import Check from '@material-ui/icons/Check'
import CircularProgress from '@material-ui/core/CircularProgress'
import Zoom from '@material-ui/core/Zoom'
import { StepIconProps } from '@material-ui/core/StepIcon'
import { commafy } from 'src/utils'
import { useStatus } from './StatusContext'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem'
  },
  box: {
    marginBottom: '2rem',
    flexDirection: 'column'
  },
  stepLabel: {
    fontSize: '2rem'
  }
}))

const CustomStepConnector = withStyles({
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
    borderRadius: 1
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
  }
})

function StepIcon (props: StepIconProps) {
  const styles = useStepIconStyles()
  const { active, completed, icon } = props
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

type StatusProps = {}

const Status: FC<StatusProps> = (props: StatusProps) => {
  const styles = useStyles()
  let { steps, activeStep, fetching } = useStatus()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Status
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" className={styles.box}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<CustomStepConnector />}
        >
          {steps.map(label => (
            <Step key={label}>
              <StepLabel
                classes={{
                  label: styles.stepLabel
                }}
                StepIconComponent={StepIcon}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  )
}

export default Status
