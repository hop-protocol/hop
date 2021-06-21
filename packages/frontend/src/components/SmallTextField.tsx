import React, { FC, ReactNode } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'

type LargeTextFieldProps = {
  units?: string | ReactNode
  centerAlign?: boolean | undefined
} & TextFieldProps

interface StyleProps {
  centerAlign: boolean
}

const useStyles = makeStyles(theme => ({
  root: {},
  adornment: {
    marginRight: '0',
    fontSize: '1.4rem'
  }
}))

const normalShadow = `
  inset -3px -3px 6px rgba(255, 255, 255, 0.5),
  inset 3px 3px 6px rgba(174, 174, 192, 0.16)
`

const useInputStyles = makeStyles(theme => ({
  root: (props: StyleProps) => ({
    padding: '0.1rem 0.4rem',
    borderRadius: '2rem',
    boxShadow: normalShadow,
    '&:hover': {},
    '&.Mui-focused': {}
  }),
  input: ({ centerAlign }: StyleProps) => ({
    textAlign: centerAlign ? 'center' : 'right',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis'
  }),
  focused: {
    borderRadius: '2rem',
    boxShadow: normalShadow
  }
}))

const TextField: FC<LargeTextFieldProps> = props => {
  const { units, centerAlign = false, ...textFieldProps } = props
  const styles = useStyles()
  const inputStyles = useInputStyles({ centerAlign })

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
    ></MuiTextField>
  )
}

export default TextField
