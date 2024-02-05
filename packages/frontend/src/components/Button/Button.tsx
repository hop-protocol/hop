import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import React, { FC } from 'react'
import { makeStyles } from '@mui/styles'
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

const useStyles = makeStyles((theme: any) => ({
  root: ({ highlighted, large, flat, text, isDarkMode, fullWidth }: StyleProps) => ({
    borderRadius: '3.0rem',
    textTransform: 'none',
    padding: large ? '0.8rem 4.2rem' : '0.8rem 2.8rem',
    minHeight: large ? '5.5rem' : '4.0rem',
    fontSize: large ? '2.2rem' : '1.5rem',
    width: fullWidth ? '100%' : 'auto',
    color: `${text ? theme.palette.text.secondary : (highlighted ? 'white' : theme.palette.text.primary)} !important`,
    background: `${text ? 'none' : (highlighted
      ? theme.bgGradient?.main
      : isDarkMode
      ? '#3A3547'
      : flat
      ? '#E2E2E5'
      : 'none')} !important`,
    boxShadow: text ? 'none !important' : (highlighted ? theme.boxShadow?.button.highlighted : theme.boxShadow?.button.default),
    '&:hover': {
      color: text ? theme.palette.text.primary : (highlighted ? 'white !important' : theme.palette.text.primary),
      background: text ? 'rgba(15, 5, 36, 0.04) !important' : (highlighted
        ? theme.bgGradient?.main
        : flat
        ? theme.palette.secondary.light
        : '#ffffff33'),
    },
    '&:disabled': {
      // background: '#272332',
      // boxShadow: theme.boxShadow.button.default,
      // color: '#0202027f',
      color: `#6660777f !important`,
      background: `#FDF7F9 !important`,
      boxShadow: `${theme.boxShadow.button.default} !important`,
    },
  }),
  disabled: {
    //color: '#FDF7F9',
    color: `#6660777f !important`,
    background: `#FDF7F9 !important`,
    boxShadow: `${theme.boxShadow.button.default} !important`,
  },
  spinner: {
    display: 'inline-flex',
    marginLeft: '1rem',
  },
}))

export const Button: FC<ButtonProps> = props => {
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
    <Box display="flex" justifyContent="center" alignItems="center" borderRadius={borderRadius || '3.0rem'} width="100%">
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
    </Box>
  )
}
