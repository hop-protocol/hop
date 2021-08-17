import React, { FC, ReactNode } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'

type LargeTextFieldProps = {
  units?: string | ReactNode
  centerAlign?: boolean | undefined
  defaultShadow?: boolean | undefined
  loadingValue?: boolean | undefined
} & TextFieldProps

interface StyleProps {
  centerAlign: boolean
  defaultShadow: boolean
  hideShadow: boolean
  loadingValue: boolean
}

const normalShadow = `
  inset -3px -3px 6px rgba(255, 255, 255, 0.5),
  inset 3px 3px 6px rgba(174, 174, 192, 0.16)
`

const boldShadow = `
  inset -12px -12px 24px rgba(255, 255, 255, 0.5),
  inset 12px 12px 24px rgba(174, 174, 192, 0.16)
`

const useStyles = makeStyles(theme => ({
  root: {
    margin: `-0.8rem -${theme.padding.extraLight} -0.8rem 0`
  },
  adornment: {
    marginLeft: '-0.8rem',
    marginRight: theme.padding.extraLight,
    width: 'auto',
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.h6.fontSize
    }
  }
}))

const useInputStyles = makeStyles(theme => ({
  '@global': {
    '@keyframes loadingEffect': {
      '0%': {
        opacity: 0.9
      },
      '50%': {
        opacity: 0.3
      },
      '100%': {
        opacity: 0.9
      }
    }
  },
  root: ({ defaultShadow, hideShadow }: StyleProps) => ({
    padding: '0.8rem 0',
    transition: 'box-shadow 0.3s ease-in-out',
    borderRadius: '1.5rem',
    boxShadow: defaultShadow ? normalShadow : 'none',
    '&:hover': {
      boxShadow: () => {
        if (hideShadow) {
          return 'none'
        } else if (defaultShadow) {
          return boldShadow
        } else {
          return normalShadow
        }
      }
    }
  }),
  input: ({ centerAlign, loadingValue }: StyleProps) => ({
    textAlign: centerAlign ? 'center' : 'right',
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.palette.text.primary,
    textOverflow: 'clip',
    padding: `6px ${theme.padding.extraLight} 7px ${theme.padding.extraLight}`,
    animation: loadingValue
      ? `loadingEffect 1200ms ${theme.transitions.easing.sharp} infinite`
      : 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.h6.fontSize
    }
  }),
  focused: {
    borderRadius: '1.5rem',
    boxShadow: normalShadow
  }
}))

const TextField: FC<LargeTextFieldProps> = props => {
  const {
    units,
    centerAlign = false,
    defaultShadow = false,
    loadingValue = false,
    ...textFieldProps
  } = props
  const styles = useStyles()
  const inputStyles = useInputStyles({
    centerAlign,
    defaultShadow,
    hideShadow: textFieldProps.disabled ?? false,
    loadingValue
  })

  return (
    <MuiTextField
      className={styles.root}
      InputProps={{
        classes: inputStyles,
        disableUnderline: true,
        endAdornment: units ? (
          <InputAdornment position="end">
            <Typography
              variant="h4"
              color="textPrimary"
              className={styles.adornment}
            >
              {units}
            </Typography>
          </InputAdornment>
        ) : null
      }}
      {...textFieldProps}
    />
  )
}

export default TextField
