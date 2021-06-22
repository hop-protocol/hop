import React, { FC, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import SettingsIcon from '@material-ui/icons/Settings'
import { useApp } from 'src/contexts/AppContext'
import SmallTextField from 'src/components/SmallTextField'
import InfoTooltip from 'src/components/infoTooltip'
import Alert from 'src/components/alert/Alert'
import { normalizeNumberInput } from 'src/utils'

const useStyles = makeStyles(theme => ({
  root: {
    padding: `0 ${theme.padding.extraLight}`
  },
  header: {
    fontSize: '1.7rem',
    fontWeight: 'bold'
  },
  box: {
    marginBottom: '2rem'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'left',
  },
  inlineLabel: {
    marginLeft: '0.5rem'
  },
  settingsContent: {
    padding: '3rem',
    width: '300px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      width: 'auto',
    }
  },
  slippageTolerance: {
    justifyContent: 'center'
  },
  settingsIcon: {
    fontSize: '2rem'
  },
  warningBox: {
    marginTop: '1rem'
  }
}))

const Settings: FC = () => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const { settings } = useApp()
  const {
    slippageTolerance,
    setSlippageTolerance,
    deadlineMinutes,
    setDeadlineMinutes
  } = settings
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handleClick = (event: any) => {
    setOpen(true)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const handleDeadlineMinutes = (event: any) => {
    const value = normalizeNumberInput(event.target.value)
    if (!value) {
      setDeadlineMinutes('')
      return
    }

    const num = Number(value)
    if (num > 999 || num < 0) {
      return
    }
    setDeadlineMinutes(num.toString())
  }

  const handleSlippageToleranceChange = (event: any) => {
    const value = normalizeNumberInput(event.target.value)
    if (!value) {
      setSlippageTolerance('')
      return
    }

    const num = Number(value)
    if (num >= 50 || num < 0) {
      return
    }
    setSlippageTolerance(value)
  }

  const deadlineError = Number(deadlineMinutes) < 5

  return (
    <div className={styles.root}>
      <IconButton onClick={handleClick} color="secondary">
        <SettingsIcon className={styles.settingsIcon} />
      </IconButton>
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <div className={styles.settingsContent}>
          <Box display="flex" flexDirection="column" className={styles.box}>
            <Typography variant="h6" className={styles.header}>
              Transaction Settings
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" className={styles.box}>
            <Typography variant="body1" className={styles.label}>
              Slippage Tolerance{' '}
              <InfoTooltip title="Your transaction will revert if the price changes unfavorably by more than this percentage." />
            </Typography>
            <Box display="flex" alignItems="center" className={styles.slippageTolerance}>
              <IconButton
                color={slippageTolerance === 0.1 ? 'primary' : 'secondary'}
                onClick={() => setSlippageTolerance(0.1)}
              >
                0.1%
              </IconButton>
              <IconButton
                color={slippageTolerance === 0.5 ? 'primary' : 'secondary'}
                onClick={() => setSlippageTolerance(0.5)}
              >
                0.5%
              </IconButton>
              <IconButton
                color={slippageTolerance === 1 ? 'primary' : 'secondary'}
                onClick={() => setSlippageTolerance(1)}
              >
                1%
              </IconButton>
              <SmallTextField
                style={{ width: 80 }}
                value={slippageTolerance}
                units="%"
                onChange={handleSlippageToleranceChange}
                placeholder={slippageTolerance?.toString() || '1.00'}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" className={styles.box}>
            <Typography variant="body1" className={styles.label}>
              Transaction deadline{' '}
              <InfoTooltip title="Your transaction will revert if it is pending for more than this long." />
            </Typography>
            <Box display="flex" alignItems="center">
              <SmallTextField
                style={{ width: 80 }}
                value={deadlineMinutes}
                onChange={handleDeadlineMinutes}
                placeholder={'20'}
              />{' '}
              <span className={styles.inlineLabel}>minutes</span>
            </Box>
            <Box display="flex" alignItems="center" className={styles.warningBox}>
              {deadlineError
                ? <div><Alert severity="warning" text={'Cross-chain transactions take a few minutes. The deadline you set may be too short for the cross chain message to reach its destination.'} /></div> : null}
            </Box>
          </Box>
        </div>
      </Popover>
    </div>
  )
}

export default Settings
