import React, { useState } from 'react'
import { lightTheme, darkTheme } from './_theme'

export function useTheme() {
  const dark = true
  const theme = dark ? darkTheme : lightTheme

  return {
    dark,
    theme
  }
}
