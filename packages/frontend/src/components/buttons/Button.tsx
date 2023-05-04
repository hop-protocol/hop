import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiButton, { ButtonProps as MuiButtonProps } from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Flex } from '../ui'
import { useThemeMode } from 'src/theme/ThemeProvider'

interface StyleProps {
  highlighted: boolean
  large: boolean
  flat: boolean
  size?: number | string
  borderRadius?: any
  children?: any
  onClick?: any
  loading?: boolean
  isDarkMode?: boolean
  fullWidth?: boolean
  target?: string
  rel?: string
  text?: boolean
}

export type ButtonProps = Partial<StyleProps> &
  MuiButtonProps & { boxShadow?: any; minWidth?: string }

const useStyles = makeStyles(theme => ({
  root: ({ highlighted, large, flat, text, isDarkMode, fullWidth }: StyleProps) => ({
    borderRadius: '16px',
    textTransform: 'none',
    padding: large ? '8px 42px' : '8px 28px',
    minHeight: large ? '54px' : '40px',
    fontSize: large ? '20px' : '16px',
    width: fullWidth ? '100%' : 'auto',
    color: text ? theme.palette.text.secondary : (highlighted ? 'white' : theme.palette.text.primary),
    background: text ? 'none' : (highlighted
      ? theme.bgGradient.main
      : isDarkMode
      ? '#3A3547'
      : flat
      ? '#E2E2E5'
      : 'none'),
    boxShadow: text ? 'none' : (highlighted ? theme.boxShadow.button.highlighted : theme.boxShadow.button.default),
    '&:hover': {
      color: text ? theme.palette.text.primary : (highlighted ? 'white' : theme.palette.text.primary),
      background: text ? 'none' : (highlighted
        ? theme.bgGradient.main
        : flat
        ? theme.palette.secondary.light
        : '#ffffff33'),
    },
    transition: 'background-color 0.15s ease-out, box-shadow 0.15s ease-out',
    '&:disabled': {
      // background: '#272332',
      // boxShadow: theme.boxShadow.button.default,
      // color: '#0202027f',
    },
  }),
  disabled: {
    color: '#FDF7F9',
    background: 'none',
  },
  spinner: {
    display: 'inline-flex',
    marginLeft: '10px',
  },
}))

const LargeButton: FC<ButtonProps> = props => {
  const {
    className,
    children,
    highlighted = false,
    large = false,
    flat = false,
    text = false,
    disabled = false,
    loading = false,
    size = 40,
    boxShadow,
    minWidth,
    borderRadius,
    fullWidth = false,
    ...buttonProps
  } = props
  const { isDarkMode } = useThemeMode()
  const styles = useStyles({ highlighted, large, flat, text, isDarkMode, fullWidth })

  return (
    <Flex justifyCenter alignCenter borderRadius={borderRadius || '16px'} fullWidth>
      <MuiButton
        {...buttonProps}
        disabled={disabled || loading}
        className={`${styles.root} ${className}`}
        classes={{ disabled: styles.disabled }}
      >
        {children}
        {loading ? (
          <div className={styles.spinner}>
            <CircularProgress size={large ? '20px' : size} />
          </div>
        ) : null}
      </MuiButton>
    </Flex>
  )
}

export default LargeButton
