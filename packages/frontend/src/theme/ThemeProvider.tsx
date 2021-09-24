import React, { FC } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import theme from './theme'

export const styledSystemTheme = {
  // 640px, 832px, 1024px, 1440px
  // '40em', '52em', '64em', '90em'
  breakpoints: ['640px', '832px', '1024px', '1440px'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 36, 48, 80, 96],
  fontWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5
  },
  fonts: ['Helvetica', 'sans-serif'],
  borders: [0, '1px solid black', '1px solid #00FFFF'],
  radii: [0, 2, 4, 16, 9999, '100%'],
  shadows: ['0px 5px 20px rgba(0, 0, 0, 0.1)', '0px 4px 10px #00000099'],
  sizes: [16, 32, 64, 128, 256],
  colors: {
    ...theme.palette
  }
}

const ThemeProvider: FC = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <SCThemeProvider theme={styledSystemTheme}>{children}</SCThemeProvider>
    </MuiThemeProvider>
  )
}

export default ThemeProvider
