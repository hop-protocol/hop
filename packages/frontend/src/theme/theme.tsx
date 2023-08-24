import { CSSProperties } from 'react'
import { SkeletonClassKey } from '@mui/material/Skeleton'
import { createTheme } from '@mui/material/styles'
import { Theme as EmotionTheme } from '@emotion/react'
import { PaletteOptions } from '@mui/material'
import { palette as paletteLight } from './light'
import { palette as paletteDark } from './dark'
import { boxShadowsLight, boxShadowsDark, bgGradients, overridesLight, overridesDark } from './overrides'
import { typographyOptions } from './typography'

export interface HopTheme extends EmotionTheme {
  palette: CustomPaletteOptions
  padding: {
    thick: CSSProperties['paddingTop']
    default: CSSProperties['paddingTop']
    light: CSSProperties['paddingTop']
    extraLight: CSSProperties['paddingTop']
  }
  boxShadow: {
    input: {
      bold: CSSProperties['boxShadow']
      normal: CSSProperties['boxShadow']
    }
    inner: CSSProperties['boxShadow']
    card: CSSProperties['boxShadow']
    button: {
      default: CSSProperties['boxShadow']
      disabled: CSSProperties['boxShadow']
      highlighted: CSSProperties['boxShadow']
    }
    select: CSSProperties['boxShadow']
  }
  bgGradient: {
    main: CSSProperties['background']
    flat: CSSProperties['background']
  }
}

declare module '@emotion/react' {
  interface Theme extends HopTheme {}
  interface ThemeOptions extends Theme {}
}

const padding = {
  thick: '4.2rem',
  default: '2.8rem',
  light: '1.8rem',
  extraLight: '1.2rem',
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...paletteLight,
  },
  padding,
  typography: typographyOptions,
  boxShadow: boxShadowsLight,
  bgGradient: bgGradients,
  components: overridesLight
})


export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...paletteDark,
  },
  padding,
  typography: typographyOptions,
  boxShadow: boxShadowsDark,
  bgGradient: bgGradients,
  overrides: overridesDark,
})

interface CustomPaletteOptions extends PaletteOptions {
  mode: 'dark' | 'light',
  text: {
    primary: string,
    secondary: string,
  }
  secondary: {
    light: string,
    dark: string,
  }
}

enum ThemeMode {
  dark = 'dark',
  light = 'light',
}

type ThemeOrMode = ThemeMode | CustomPaletteOptions

export function isDarkMode(themeOrMode?: ThemeOrMode): boolean {
  if (themeOrMode == null) {
    return false
  }

  if (typeof themeOrMode === 'string') {
    return themeOrMode === 'dark'
  }

  return themeOrMode.palette.mode === ThemeMode.dark
}
