import { palette } from './palette'

export const boxShadows = {
  inner: `
    inset 4px -4px 3px #FFFFFF,
    inset 8px -8px 60px -5px #F1E9EC,
    inset -7px 7px 5px -4px rgba(174, 174, 192, 0.4)`,
  card: `
    8px 8px 30px rgba(174, 174, 192, 0.35),
    inset -8px -8px 12px rgba(255, 255, 255, 0.15),
    inset 8px 8px 8px rgba(174, 174, 192, 0.04)`,
  button: {
    default: `
      10px -10px 30px #FFFFFF,
      -10px 10px 30px #D8D5DC,
      inset -8px 4px 10px rgba(102, 96, 119, 0.04)`,
    disabled: `
      10px -10px 30px #FFFFFF,
      -10px 10px 30px #D8D5DC,
      inset -8px 4px 10px rgba(102, 96, 119, 0.04)`,
    highlighted: `
    10px -10px 30px #FFFFFF,
    -10px 10px 30px rgba(216, 213, 220, 0.8)`,
  },
  select: `
    -6px 6px 12px #D8D5DC,
    5px -5px 12px #FFFFFF,
    inset -6px 6px 12px rgba(233, 229, 232, 0.4),
    inset -5px -5px 14px rgba(255, 255, 255, 0.15)`,
}

export const overrides = {
  MuiCard: {
    root: {
      padding: '2.8rem',
      borderRadius: '3.0rem',
      boxShadow: boxShadows.card,
    },
  },
  MuiPaper: {
    root: {
      backgroundColor: '#FDF7F9',
    },
  },
  MuiButton: {
    root: {
      margin: 'inherit',
      backgroundColor: 'transparent',
      boxShadow: boxShadows.button.default,
      color: palette.primary.main,
      '&:disabled': {
        background: '#FDF7F9',
        boxShadow: boxShadows.button.default,
        color: palette.text.disabled,
      },
    },
  },
  MuiTabs: {
    indicator: {
      display: 'none',
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
      color: '#0F0524',
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
  MuiMenuItem: {
    root: {
      fontWeight: 700,
      fontSize: '1.8rem',
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
  MuiTooltip: {
    tooltip: {
      fontSize: '1.6rem',
    },
  },
  MuiSlider: {
    root: {
      height: 3,
    },
    thumb: {
      height: 14,
      width: 14,
    },
    track: {
      height: 3,
      borderRadius: 8,
    },
    rail: {
      height: 3,
      borderRadius: 8,
    },
    mark: {
      height: 3,
    },
    valueLabel: {
      fontSize: '1.4rem',
    },
  },
  MuiSelect: {
    root: {
      backgroundColor: 'white',
      // boxShadow: boxShadows.select,
    },
  },
}
