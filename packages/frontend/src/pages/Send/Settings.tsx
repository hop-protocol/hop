import React, {
  FC,
  useState,
  useMemo,
  useRef,
  useEffect,
  ChangeEvent
} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import SettingsIcon from '@material-ui/icons/Settings'
import SmallTextField from 'src/components/SmallTextField'
import { normalizeNumberInput } from 'src/utils'

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '1.7rem',
    fontWeight: 'bold'
  },
  box: {
    marginBottom: '2rem'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  inlineLabel: {
    marginLeft: '0.5rem'
  },
  settingsContent: {
    padding: '3rem'
  },
  settingsIcon: {
    fontSize: '2rem'
  }
}))

type Props = {
  onSlippageTolerance: (slippageTolerance: number) => void
  onTransactionDeadline: (deadline: number) => void
}

const Settings: FC<Props> = (props: Props) => {
  const { onSlippageTolerance, onTransactionDeadline } = props
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [slippageTolerance, setSlippageTolerance] = useState<string>(() => {
    return localStorage.getItem('slippageTolerance') || '0.5'
  })
  const [deadlineMinutes, setDeadlineMinutes] = useState<string>(() => {
    return localStorage.getItem('transactionDeadline') || '20'
  })
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

  useEffect(() => {
    onSlippageTolerance(Number(slippageTolerance))
    localStorage.setItem('slippageTolerance', slippageTolerance)
  }, [slippageTolerance])

  useEffect(() => {
    onTransactionDeadline(Number(deadlineMinutes))
    localStorage.setItem('transactionDeadline', deadlineMinutes)
  }, [deadlineMinutes])

  return (
    <div>
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
              Slippage Tolerance
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton
                color={slippageTolerance === '0.1' ? 'primary' : 'secondary'}
                onClick={() => setSlippageTolerance('0.1')}
              >
                0.1%
              </IconButton>
              <IconButton
                color={slippageTolerance === '0.5' ? 'primary' : 'secondary'}
                onClick={() => setSlippageTolerance('0.5')}
              >
                0.5%
              </IconButton>
              <IconButton
                color={slippageTolerance === '1' ? 'primary' : 'secondary'}
                onClick={() => setSlippageTolerance('1')}
              >
                1%
              </IconButton>
              <SmallTextField
                style={{ width: 80 }}
                value={slippageTolerance}
                units="%"
                onChange={handleSlippageToleranceChange}
                placeholder={slippageTolerance || '1.00'}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" className={styles.box}>
            <Typography variant="body1" className={styles.label}>
              Transaction deadline
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
          </Box>
        </div>
      </Popover>
    </div>
  )
}

export default Settings
