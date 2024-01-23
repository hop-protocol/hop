import { CSSProperties } from 'react'
import createBreakpoints from '@mui/system/createTheme/createBreakpoints';
import { SkeletonClassKey } from '@mui/lab/Skeleton'
import {
  boxShadowsLight,
  boxShadowsDark,
  bgGradients,
  overridesLight,
  overridesDark,
} from 'src/theme/overrides'
import { typographyOptions } from 'src/theme/typography'

import { createTheme } from '@mui/material/styles';
import { palette as paletteLight } from 'src/theme/light'
import { palette as paletteDark } from 'src/theme/dark'

// declare module '@mui/styles/createTheme' {
//   interface Theme {
//     padding: {
//       thick: CSSProperties['paddingTop']
//       default: CSSProperties['paddingTop']
//       light: CSSProperties['paddingTop']
//       extraLight: CSSProperties['paddingTop']
//     }
//     boxShadow: {
//       input: {
//         bold: CSSProperties['boxShadow']
//         normal: CSSProperties['boxShadow']
//       }
//       inner: CSSProperties['boxShadow']
//       card: CSSProperties['boxShadow']
//       button: {
//         default: CSSProperties['boxShadow']
//         disabled: CSSProperties['boxShadow']
//         highlighted: CSSProperties['boxShadow']
//       }
//       select: CSSProperties['boxShadow']
//     }
//     bgGradient: {
//       main: CSSProperties['background']
//       flat: CSSProperties['background']
//     }
//   }

//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     padding?: {
//       thick?: CSSProperties['paddingTop']
//       default?: CSSProperties['paddingTop']
//       light?: CSSProperties['paddingTop']
//       extraLight?: CSSProperties['paddingTop']
//     }
//     boxShadow?: {
//       input?: {
//         bold?: CSSProperties['boxShadow']
//         normal?: CSSProperties['boxShadow']
//       }
//       inner?: CSSProperties['boxShadow']
//       card?: CSSProperties['boxShadow']
//       button?: {
//         default?: CSSProperties['boxShadow']
//         disabled?: CSSProperties['boxShadow']
//         highlighted?: CSSProperties['boxShadow']
//       }
//       select?: CSSProperties['boxShadow']
//     }
//     bgGradient?: {
//       main?: CSSProperties['background']
//       flat?: CSSProperties['background']
//     }
//   }
// }

const padding = {
  thick: '4.2rem',
  default: '2.8rem',
  light: '1.8rem',
  extraLight: '1.2rem',
}

const breakpoints = createBreakpoints({})

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...paletteLight,
  },
  padding,
  typography: typographyOptions,
  breakpoints,
  boxShadow: boxShadowsLight,
  bgGradient: bgGradients,
  components: {
    ...overridesLight,
    MuiTab: {
      ...overridesLight.MuiTab,
      styleOverrides: {
        root: {
          // ...overridesLight.MuiTab.styleOverrides.root,
          [breakpoints.down('sm')]: {
            fontSize: '1.5rem',
          },
        },
      },
    },
  },
} as any)

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...paletteDark,
  },
  padding,
  typography: typographyOptions,
  breakpoints,
  boxShadow: boxShadowsDark,
  bgGradient: bgGradients,
  components: {
    ...overridesDark,
    MuiTab: {
      ...overridesDark.MuiTab,
      styleOverrides: {
        root: {
          // ...overridesDark.MuiTab.styleOverrides.root,
          [breakpoints.down('sm')]: {
            fontSize: '1.5rem',
          },
        },
      }
    },
  },
} as any)

interface PaletteType {
  palette: {
    mode: 'dark' | 'light'
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

  return themeOrMode.palette.mode === ThemeMode.dark
}
