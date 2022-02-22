import React, { FC, ReactNode } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'

type LargeTextFieldProps = {
  units?: string | ReactNode
  centerAlign?: boolean | undefined
  leftAlign?: boolean | undefined
  defaultShadow?: boolean | undefined
  loadingValue?: boolean | undefined
  smallFontSize?: boolean
} & TextFieldProps

interface StyleProps {
  centerAlign: boolean
  leftAlign: boolean
  defaultShadow: boolean
  hideShadow: boolean
  loadingValue: boolean
  smallFontSize: boolean
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  adornment: {
    width: 'auto',
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.subtitle1.fontSize,
    },
  },
}))

const useInputStyles = makeStyles(theme => ({
  '@global': {
    '@keyframes loadingEffect': {
      '0%': {
        opacity: 0.9,
      },
      '50%': {
        opacity: 0.3,
      },
      '100%': {
        opacity: 0.9,
      },
    },
  },
  root: ({ defaultShadow, hideShadow }: StyleProps) => ({
    padding: '0.8rem 0',
    marginLeft: '.7rem',
    transition: 'all 0.15s ease-out',
    borderRadius: '1.5rem',
    width: '100%',
    boxShadow: defaultShadow ? theme.boxShadow.input.normal : 'none',
    '&:hover': {
      boxShadow: () => {
        if (hideShadow) {
          return 'none'
        } else if (defaultShadow) {
          return theme.boxShadow.input.bold
        } else {
          return theme.boxShadow.input.normal
        }
      },
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: '.5rem .6rem',
      fontSize: theme.typography.subtitle2.fontSize,
    },
  }),
  input: ({ centerAlign, leftAlign, loadingValue, smallFontSize }: StyleProps) => ({
    textAlign: leftAlign ? 'left' : centerAlign ? 'center' : 'right',
    fontSize: smallFontSize ? '1.6rem' : theme.typography.h4.fontSize,
    fontWeight: smallFontSize ? 'normal' : theme.typography.h4.fontWeight,
    color: theme.palette.text.primary,
    textOverflow: 'clip',
    padding: `6px ${theme.padding.extraLight} 7px ${theme.padding.extraLight}`,
    animation: loadingValue
      ? `loadingEffect 1s ${theme.transitions.easing.sharp} infinite`
      : 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: smallFontSize ? '1.6rem' : theme.typography.subtitle2.fontSize,
      padding: '.5rem',
    },
  }),
  focused: {
    borderRadius: '1.5rem',
    boxShadow: theme.boxShadow.input.normal,
  },
}))

const TextField: FC<LargeTextFieldProps> = props => {
  const {
    units,
    centerAlign = false,
    leftAlign = false,
    defaultShadow = false,
    loadingValue = false,
    smallFontSize = false,
    ...textFieldProps
  } = props
  const styles = useStyles()
  const inputStyles = useInputStyles({
    centerAlign,
    leftAlign,
    defaultShadow,
    hideShadow: textFieldProps.disabled ?? false,
    loadingValue,
    smallFontSize,
  })

  return (
    <MuiTextField
      className={styles.root}
      InputProps={{
        classes: inputStyles,
        disableUnderline: true,
        endAdornment: units ? (
          <InputAdornment position="end">
            <Typography variant="h4" color="textPrimary" className={styles.adornment}>
              {units}
            </Typography>
          </InputAdornment>
        ) : null,
      }}
      {...textFieldProps}
    />
  )
}

export default TextField
