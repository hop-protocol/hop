import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `-0.8rem -${theme.padding.extraLight}`
  },
  adornment: {
    marginRight: theme.padding.extraLight
  }
}))

const useInputStyles = makeStyles((theme) => ({
  root: {
    padding: `0.8rem 0`,
    transition: 'box-shadow 0.3s ease-in-out',
    borderRadius: '1.5rem',
    '&:hover': {
      borderRadius: '1.5rem',
      boxShadow: `
        inset -3px -3px 6px rgba(255, 255, 255, 0.5),
        inset 3px 3px 6px rgba(174, 174, 192, 0.16)
      `
    }
  },
  input: {
    textAlign: 'right',
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.palette.text.primary,
  },
  focused: {
    borderRadius: '1.5rem',
    boxShadow: `
      inset -3px -3px 6px rgba(255, 255, 255, 0.5),
      inset 3px 3px 6px rgba(174, 174, 192, 0.16)
    `
  },
}))

const TextField: FC<TextFieldProps> = (props) => {
  const styles = useStyles()
  const inputStyles = useInputStyles()

  return (
    <MuiTextField
      className={styles.root}
      InputProps={{
        classes: inputStyles,
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position="end">
            <Typography variant="h4" color="textPrimary" className={styles.adornment}>
              ETH
            </Typography>
          </InputAdornment>
        ),
      }}
      {...props}
    >
    </MuiTextField>
  )
}

export default TextField