import { Suspense } from 'react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { darkTheme, lightTheme } from '@/app/theme/theme'
import { useQueryParams } from '@/app/hooks/useQueryParams'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }: any) => {
  const { queryParams, updateQueryParams } = useQueryParams()

  const [dark, setDark] = useState(() => {
    try {
      if (queryParams.theme) {
        return queryParams.theme === 'dark'
      }
      const cached = localStorage.getItem('darkMode')
      if (typeof cached === 'string') {
        return cached === 'true'
      }
    } catch (err) {
      // console.error(err)
    }
    return false
  })

  const toggleTheme = () => {
    setDark((prevDark) => !prevDark)
  }

  useEffect(() => {
    try {
      updateQueryParams({ theme: dark ? 'dark' : 'light' })
      localStorage.setItem('darkMode', `${dark}`)
    } catch (err) {
      // console.error(err)
    }
  }, [dark])

  const theme = createTheme(dark ? darkTheme : lightTheme)

  return (
    <ThemeContext.Provider value={{ dark, theme, toggleTheme } as any}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}


export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
