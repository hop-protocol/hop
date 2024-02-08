import React, { useState, useEffect } from 'react'
import { lightTheme, darkTheme } from './_theme'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const cached = localStorage.getItem('darkMode')
      if (typeof cached === 'string') {
        return cached === 'true'
      }
    } catch (err: any) {}
    return true
  })

  function toggleTheme () {
    setDark(!dark)
  }

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', `${dark}`)
    } catch (err: any) {}
  }, [dark])

  const theme = dark ? darkTheme : lightTheme

  return {
    dark,
    theme,
    toggleTheme
  }
}
