import React, { FC } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'

const ThemeProvider: FC = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  )
}

export default ThemeProvider


