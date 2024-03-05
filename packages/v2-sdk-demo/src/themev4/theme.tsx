import { CSSProperties } from 'react'
import { SkeletonClassKey } from '@mui/lab/Skeleton'
import {
  boxShadowsLight,
  boxShadowsDark,
  bgGradients,
  overridesLight,
  overridesDark,
} from './overrides'
import { typographyOptions } from './typography'

// https://stackoverflow.com/a/64135466/1439168
import { unstable_createMuiStrictModeTheme as createMuiTheme, createTheme } from '@mui/material/styles'
import { palette as paletteLight } from './light'
import { palette as paletteDark } from './dark'

declare module '@mui/material/styles/overrides' {
  export interface ComponentNameToClassKey {
    MuiSkeleton: SkeletonClassKey
  }
}

declare module '@mui/material/styles/createTheme' {
  interface Theme {
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

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    padding?: {
      thick?: CSSProperties['paddingTop']
      default?: CSSProperties['paddingTop']
      light?: CSSProperties['paddingTop']
      extraLight?: CSSProperties['paddingTop']
    }
    boxShadow?: {
      input?: {
        bold?: CSSProperties['boxShadow']
        normal?: CSSProperties['boxShadow']
      }
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

export const lightTheme = createMuiTheme({
  palette: {
    ...paletteLight,
  },
  padding,
  typography: typographyOptions,
  boxShadow: boxShadowsLight,
  bgGradient: bgGradients,
  components: {
    ...overridesLight,
    MuiTab: {
      styleOverrides: {
        root: {
          ...overridesLight.MuiTab.styleOverrides.root,
        },
      }
    },
  },
})

export const darkTheme = createMuiTheme({
  palette: {
    ...paletteDark,
  },
  padding,
  typography: typographyOptions,
  boxShadow: boxShadowsDark,
  bgGradient: bgGradients,
  overrides: {
    ...overridesDark,
    MuiTab: {
      root: {
        ...overridesDark.MuiTab.root,
      },
    },
  },
} as any)

interface PaletteType {
  palette: {
    type: 'dark' | 'light'
  }
}

enum ThemeMode {
  dark = 'dark',
  light = 'light',
}

type ThemeOrMode = ThemeMode | PaletteType

export function isDarkMode(themeOrMode?: ThemeOrMode): boolean {
  if (themeOrMode == null) {
    return false
  }

  if (typeof themeOrMode === 'string') {
    return themeOrMode === 'dark'
  }

  return themeOrMode.palette.type === ThemeMode.dark
}
