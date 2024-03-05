export const defaultTransition = 'all 0.15s ease-out'

export const palette = {
  primary: {
    light: '#c462fc',
    main: '#B32EFF',
    dark: '#7213a8',
    contrastText: 'white',
  },
  background: {
    default: '#272332',
    paper: '#272332',
    contrast: '#1F1E23',
  },
  action: {
    active: '#B32EFF',
    hover: '#af64c5',
    selected: '#B32EFF',
    disabled: '#66607738',
  },
  secondary: {
    main: '#968FA8',
    light: '#968FA87f',
  },
  success: {
    main: '#00a72f',
    light: '#00a72f33',
  },
  error: {
    main: '#c50602',
    light: '#c506021e',
  },
  info: {
    main: '#2172e5',
    light: '#2172e51e',
  },
  text: {
    primary: '#E3DDF1',
    secondary: '#968FA8',
    disabled: '#968FA87f',
  },
}

export const boxShadows = {
  input: {
    normal: `
      inset -8px -8px 60px -5px rgba(21, 20, 29, 0.6),
      inset 4px -4px 3px rgba(102, 96, 119, 0.5),
      inset -7px 7px 5px -4px #161222`,
    bold: `
      inset -16px -16px 60px -5px rgba(21, 20, 29, 0.6),
      inset 8px -8px 6px rgba(102, 96, 119, 0.5),
      inset -14px 14px 10px -8px #161222`,
  },
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
    -10px 10px 30px rgba(11, 9, 30, 0.48),
    inset -8px 4px 10px rgba(11, 9, 30, 0.1)`,
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
  MuiButton: {
    root: {
      margin: 'inherit',
      backgroundColor: '#272332',
      boxShadow: boxShadows.button.default,
      color: palette.primary.main,
      transition: defaultTransition,
      '&:disabled': {
        background: '#272332',
        boxShadow: boxShadows.button.disabled,
        color: palette.text.disabled,
      },
    },
  },
  MuiCard: {
    root: {
      padding: '2.8rem',
      borderRadius: '3.0rem',
      boxShadow: boxShadows.card,
      transition: defaultTransition,
    },
  },
  MuiListItem: {
    root: {
      transition: defaultTransition,
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
      transition: defaultTransition,
    },
  },
  MuiMenuItem: {
    root: {
      fontWeight: 700,
      fontSize: '1.8rem',
      transition: defaultTransition,
    },
  },
  MuiInputBase: {
    root: {
      transition: defaultTransition,
    },
  },
  MuiPaper: {
    root: {
      backgroundColor: '#272332',
      transition: defaultTransition,
    },
  },
  MuiPopover: {
    paper: {
      transition: defaultTransition,
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
      transition: defaultTransition,
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
  MuiTabs: {
    indicator: {
      display: 'none',
    },
  },
  MuiTab: {
    root: {
      transition: defaultTransition,
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
  MuiTooltip: {
    tooltip: {
      fontSize: '1.6rem',
    },
  },
  MuiTypography: {
    root: {
      color: '#E3DDF1',
      transition: defaultTransition,
    },
  },
}
