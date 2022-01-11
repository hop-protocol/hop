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
}

export type ButtonProps = Partial<StyleProps> &
  MuiButtonProps & { boxShadow?: any; minWidth?: string }

const useStyles = makeStyles(theme => ({
  root: ({ highlighted, large, flat, isDarkMode }: StyleProps) => ({
    borderRadius: '3.0rem',
    textTransform: 'none',
    padding: large ? '0.8rem 4.2rem' : '0.8rem 2.8rem',
    height: large ? '5.5rem' : '4.0rem',
    fontSize: large ? '2.2rem' : '1.5rem',
    color: highlighted ? 'white' : theme.palette.text.primary,
    background: highlighted
      ? theme.bgGradient.main
      : isDarkMode
      ? '#3A3547'
      : flat
      ? '#E2E2E5'
      : 'none',
    boxShadow: highlighted ? theme.boxShadow.button.highlighted : theme.boxShadow.button.default,
    '&:hover': {
      background: highlighted
        ? theme.bgGradient.main
        : flat
        ? theme.palette.secondary.light
        : '#ffffff33',
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
    marginLeft: '1rem',
  },
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
    size = 40,
    boxShadow,
    minWidth,
    borderRadius,
    ...buttonProps
  } = props
  const { isDarkMode } = useThemeMode()
  const styles = useStyles({ highlighted, large, flat, isDarkMode })

  return (
    <Flex justifyCenter alignCenter borderRadius={borderRadius || '3.0rem'}>
      <MuiButton
        {...buttonProps}
        disabled={disabled || loading}
        className={`${styles.root} ${className}`}
        classes={{ disabled: styles.disabled }}
      >
        {children}
        {loading ? (
          <div className={styles.spinner}>
            <CircularProgress size={large ? '2rem' : size} />
          </div>
        ) : null}
      </MuiButton>
    </Flex>
  )
}

export default LargeButton
