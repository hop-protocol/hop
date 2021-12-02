import { paletteDark as palette } from './palette'
import { overrides } from './light'

export const boxShadows = {
  inner: `
    inset -8px -8px 60px -5px rgba(21, 20, 29, 0.6),
    inset 4px -4px 3px rgba(102, 96, 119, 0.5),
    inset -7px 7px 5px -4px #161222`,
  card: `
    8px 8px 30px rgba(174, 174, 192, 0.35)`,
  button: {
    default: `
      10px -10px 30px rgba(79, 74, 94, 0.3),
      -10px 10px 30px rgba(11, 9, 30, 0.48),
      inset -8px 4px 10px rgba(11, 9, 30, 0.1)`,
    disabled: `
      10px -10px 30px #FFFFFF,
      -10px 10px 30px #D8D5DC,
      inset -8px 4px 10px rgba(102, 96, 119, 0.04)`,
    highlighted: `
      10px -10px 30px rgba(79, 74, 94, 0.3),
      -10px 10px 30px rgba(11, 9, 30, 0.48),
      inset -8px 4px 10px rgba(11, 9, 30, 0.1)`,
  },
  select: `
    -6px 6px 12px rgba(11, 9, 30, 0.5),
    5px -5px 12px rgba(79, 74, 94, 0.3),
    inset -6px 6px 12px rgba(11, 9, 30, 0.24),
    inset -5px -5px 20px rgba(102, 96, 119, 0.2)`,
}

export const overridesDark = {
  ...overrides,
  MuiCard: {
    root: {
      padding: '2.8rem',
      borderRadius: '3.0rem',
      // boxShadow: boxShadows.card,
    },
  },
  MuiPaper: {
    root: {
      backgroundColor: '#272332',
    },
  },
  MuiButton: {
    root: {
      margin: 'inherit',
      backgroundColor: '#272332',
      boxShadow: boxShadows.button.default,
      color: palette.primary.main,
      '&:disabled': {
        background: '#272332',
        boxShadow: boxShadows.button.default,
        color: '#6660777f',
      },
    },
  },
  MuiTab: {
    root: {
      '&.MuiTab-root': {
        color: palette.text.secondary,
        minWidth: 0,
        borderRadius: '3rem',
      },
      '&$selected': {
        color: palette.primary.main,
      },
      '&:hover:not($selected)': {
        color: palette.text.primary,
      },
    },
  },
  MuiTypography: {
    root: {
      color: '#E3DDF1',
    },
  },
  MuiListItem: {
    root: {
      '&$selected': {
        backgroundColor: '#b32eff19',
        color: palette.text.primary,
        '&:hover': {
          backgroundColor: '#b32eff1e',
        },
      },
    },
    button: {
      '&:hover': {
        backgroundColor: palette.action.hover,
      },
    },
  },
  MuiPopover: {
    paper: {
      borderRadius: '3.0rem',
      boxShadow: `
          0px 5px 15px -3px rgba(0,0,0,0.1),
          0px 8px 20px 1px rgba(0,0,0,0.07),
          0px 3px 24px 2px rgba(0,0,0,0.06);
        `,
    },
  },
  MuiSelect: {
    root: {
      backgroundColor: '#66607738',
      // boxShadow: boxShadows.select,
    },
  },
}
