import { Suspense } from 'react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles'
import { darkTheme, lightTheme } from '@/app/theme/theme'
import { useQueryParams } from '@/app/hooks/useQueryParams'

interface ThemeContextType {
  dark: boolean
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function setCookie(name: string, value: string, days?: number): void {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim()
    if (c.startsWith(nameEQ)) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

export const ThemeProvider = ({ children, initialTheme }: any) => {
  const { queryParams, updateQueryParams } = useQueryParams()

  const [dark, setDark] = useState(() => {
    try {
      if (queryParams.theme) {
        return queryParams.theme === 'dark'
      }
      if (initialTheme) {
        return initialTheme === 'dark'
      }
      const cookie = getCookie('theme')
      if (cookie) {
        return cookie === 'dark'
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
      const cookie = getCookie('theme')
      if (cookie) {
        setDark(cookie === 'dark')
      }
      // updateQueryParams({ theme: undefined })
  }, [])

  useEffect(() => {
    try {
      setCookie('theme', dark ? 'dark' : 'light', 7)
      // localStorage.setItem('darkMode', `${dark}`)
      // updateQueryParams({ theme: dark ? 'dark' : 'light' })
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
