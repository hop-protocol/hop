import { CSSProperties } from 'react'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
import { SkeletonClassKey } from '@material-ui/lab/Skeleton'
import {
  boxShadows,
  boxShadowsDark,
  bgGradients,
  bgGradientsDark,
  overrides,
  overridesDark,
} from './overrides'
import { typographyOptions } from './typography'

// https://stackoverflow.com/a/64135466/1439168
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'
import { palette, paletteDark } from './palette'

declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey {
    MuiSkeleton: SkeletonClassKey
  }
}

declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    padding: {
      thick: CSSProperties['paddingTop']
      default: CSSProperties['paddingTop']
      light: CSSProperties['paddingTop']
      extraLight: CSSProperties['paddingTop']
    }
    boxShadow: {
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

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    padding?: {
      thick?: CSSProperties['paddingTop']
      default?: CSSProperties['paddingTop']
      light?: CSSProperties['paddingTop']
      extraLight?: CSSProperties['paddingTop']
    }
    boxShadow?: {
      inner?: CSSProperties['boxShadow']
      card?: CSSProperties['boxShadow']
      button?: {
        default?: CSSProperties['boxShadow']
        disabled?: CSSProperties['boxShadow']
        highlighted?: CSSProperties['boxShadow']
      }
      select?: CSSProperties['boxShadow']
    }
    bgGradient?: {
      main?: CSSProperties['background']
      flat?: CSSProperties['background']
    }
  }
}

const padding = {
  thick: '4.2rem',
  default: '2.8rem',
  light: '1.8rem',
  extraLight: '1.2rem',
}

const breakpoints = createBreakpoints({})

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    ...palette,
  },
  padding,
  typography: typographyOptions,
  breakpoints,
  boxShadow: boxShadows,
  bgGradient: bgGradients,
  overrides: overrides,
})

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    ...paletteDark,
  },
  padding,
  typography: typographyOptions,
  breakpoints,
  boxShadow: boxShadowsDark,
  bgGradient: bgGradientsDark,
  overrides: overridesDark,
})

interface PaletteType {
  palette: {
    type: 'dark' | 'light'
  }
}

type ThemeOrMode = 'dark' | 'light' | PaletteType | string

export function isDarkMode(themeOrMode?: ThemeOrMode) {
  if (typeof themeOrMode === 'undefined') {
    return false
  }

  if (typeof themeOrMode === 'string') {
    return themeOrMode === 'dark'
  }

  return themeOrMode.palette.type === 'dark'
}
