import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiButton, {
  ButtonProps as MuiButtonProps
} from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

interface StyleProps {
  highlighted: boolean
  large: boolean
  flat: boolean
}

interface StateProps {
  loading: boolean
}

export type ButtonProps = Partial<StyleProps> &
  Partial<StateProps> &
  MuiButtonProps

const useStyles = makeStyles(theme => ({
  root: ({ highlighted, large, flat }: StyleProps) => ({
    borderRadius: '3.0rem',
    textTransform: 'none',
    padding: large ? '0.8rem 4.2rem' : '0.8rem 2.8rem',
    height: large ? '6.0rem' : '4.0rem',
    fontSize: large ? '2.2rem' : '1.6rem',
    color: highlighted ? 'white' : theme.palette.text.secondary,
    background: highlighted
      ? 'linear-gradient(99.85deg, #B32EFF -18.29%, #F2A498 109.86%)'
      : flat
        ? '#E2E2E5'
        : 'none',
    boxShadow: highlighted
      ? `
        -10px -10px 30px #FFFFFF,
        10px 10px 30px rgba(174, 174, 192, 0.4),
        inset -15px -15px 25px rgba(179, 46, 255, 0.15),
        inset 15px 15px 25px rgba(179, 46, 255, 0.1)
      `
      : flat
        ? 'none'
        : `
        -10px -10px 30px rgba(255, 255, 255, 0.95),
        10px 10px 30px rgba(174, 174, 192, 0.35)
      `,
    '&:hover': {
      background: highlighted
        ? 'linear-gradient(99.85deg, #c462fc -18.29%, #f7bdb5 109.86%)'
        : flat
          ? '#E5E6Ea'
          : 'rgba(255, 255, 255, 0.2)'
    },
    '&:disabled': {
      background: '#e2e2e8',
      boxShadow: 'none'
    }
  }),
  disabled: {
    color: '#46525C',
    background: 'none',
    boxShadow: `
      -10px -10px 30px rgba(255, 255, 255, 0.95),
      10px 10px 30px rgba(174, 174, 192, 0.35)
    `
  },
  spinner: {
    display: 'inline-flex',
    marginLeft: '1rem'
  }
}))

const LargeButton: FC<ButtonProps> = props => {
  const {
    className,
    children,
    highlighted = false,
    large = false,
    flat = false,
    disabled = false,
    loading = false,
    ...buttonProps
  } = props
  const styles = useStyles({ highlighted, large, flat })

  return (
    <MuiButton
      {...buttonProps}
      disabled={disabled || loading}
      className={`${styles.root} ${className}`}
      classes={{ disabled: styles.disabled }}
    >
      {children}
      {loading ? (
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
      ) : null}
    </MuiButton>
  )
}

export default LargeButton
