import { CSSProperties } from 'react'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
import { TypographyOptions } from '@material-ui/core/styles/createTypography'
import { SkeletonClassKey } from '@material-ui/lab/Skeleton'

// https://stackoverflow.com/a/64135466/1439168
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey {
    MuiSkeleton: SkeletonClassKey
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    padding: {
      thick: CSSProperties['paddingTop']
      default: CSSProperties['paddingTop']
      light: CSSProperties['paddingTop']
      extraLight: CSSProperties['paddingTop']
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
  }
}

export const palette = {
  primary: {
    light: '#c462fc',
    main: '#B32EFF',
    dark: '#7213a8',
    contrastText: 'white'
  },
  background: {
    default: '#F0F0F3',
    paper: '#F0F0F3'
  },
  action: {
    active: '#B32EFF',
    hover: '#c462fc',
    selected: '#B32EFF',
    disabled: 'rgba(5, 21, 36, 0.2)'
  },
  secondary: {
    main: 'rgba(70, 82, 92)',
    light: 'rgba(70, 82, 92, 0.2)'
  },
  success: {
    main: 'rgba(0, 167, 47)',
    light: 'rgba(0, 167, 47, 0.2)'
  },
  error: {
    main: 'rgba(197, 6, 2)',
    light: 'rgba(197, 6, 2, 0.12)'
  },
  info: {
    main: 'rgba(33, 114, 229)',
    light: 'rgba(33, 114, 229, 0.12)'
  },
  text: {
    primary: '#051524',
    secondary: '#46525C',
    disabled: 'rgba(5, 21, 36, 0.2)'
  }
}

const typography: TypographyOptions = {
  fontFamily: [
    'Nunito',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  h1: {
    fontSize: '8.2rem',
    fontWeight: 300
  },
  h2: {
    fontSize: '6.0rem',
    fontWeight: 300
  },
  h3: {
    fontSize: '4.1rem',
    fontWeight: 400
  },
  h4: {
    fontSize: '2.7rem',
    fontWeight: 700
  },
  h5: {
    fontSize: '2.4rem',
    fontWeight: 700
  },
  h6: {
    fontSize: '2.0rem',
    fontWeight: 700
  },
  subtitle1: {
    fontSize: '1.8rem',
    fontWeight: 700
  },
  subtitle2: {
    fontSize: '1.6rem',
    fontWeight: 700
  },
  body1: {
    fontSize: '1.4rem',
    fontWeight: 400
  },
  body2: {
    fontSize: '1.2rem',
    fontWeight: 400
  },
  button: {
    fontSize: '1.8rem',
    fontWeight: 700,
    textTransform: 'capitalize'
  }
}

const padding = {
  thick: '4.2rem',
  default: '2.8rem',
  light: '1.8rem',
  extraLight: '1.2rem'
}

const breakpoints = createBreakpoints({})

const theme = createMuiTheme({
  palette,
  padding,
  typography,
  breakpoints,
  overrides: {
    MuiCard: {
      root: {
        padding: '2.8rem',
        borderRadius: '3.0rem',
        boxShadow: `
          -8px -8px 30px rgba(255, 255, 255, 0.95),
          8px 8px 30px rgba(174, 174, 192, 0.35),
          inset -8px -8px 12px rgba(255, 255, 255, 0.15),
          inset 8px 8px 8px rgba(174, 174, 192, 0.04);
        `
      }
    },
    MuiButton: {
      root: {
        margin: 'inherit'
      }
    },
    MuiTabs: {
      indicator: {
        display: 'none'
      }
    },
    MuiTab: {
      root: {
        '&.MuiTab-root': {
          color: palette.text.secondary,
          minWidth: 0,
          borderRadius: '3rem'
        },
        '&$selected': {
          color: palette.primary.main
        }
      }
    },
    MuiListItem: {
      root: {
        '&$selected': {
          backgroundColor: 'rgba(179, 46, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(179, 46, 255, 0.12)'
          }
        }
      },
      button: {
        '&:hover': {
          backgroundColor: 'rgba(179, 46, 255, 0.05)'
        }
      }
    },
    MuiMenuItem: {
      root: {
        fontWeight: 700,
        fontSize: '1.8rem'
      }
    },
    MuiPopover: {
      paper: {
        borderRadius: '3.0rem',
        boxShadow:
          '0px 5px 15px -3px rgba(0,0,0,0.1), 0px 8px 20px 1px rgba(0,0,0,0.07), 0px 3px 24px 2px rgba(0,0,0,0.06);'
      }
    },
    MuiTooltip: {
      tooltip: {
        fontSize: '1.6rem'
      }
    },
    MuiSlider: {
      root: {
        height: 3
      },
      thumb: {
        height: 14,
        width: 14
      },
      track: {
        height: 3,
        borderRadius: 8
      },
      rail: {
        height: 3,
        borderRadius: 8
      },
      mark: {
        height: 3
      },
      valueLabel: {
        fontSize: '1.4rem'
      }
    }
  }
})

export default theme
