export const defaultTransition = 'all 0.15s ease-out'

export const palette = {
  primary: {
    light: '#c462fc',
    main: '#089E71',
    dark: '#7213a8',
    contrastText: 'white',
  },
  background: {
    default: 'radial-gradient(100% 100% at 50% 0%, rgba(25, 179, 128, 0.15) 0%, rgba(52, 200, 157, 0.1) 50%, rgba(55, 212, 164, 0) 100%), rgb(255, 255, 255)',
    paper: 'radial-gradient(100% 100% at 50% 0%, rgba(25, 179, 128, 0.15) 0%, rgba(52, 200, 157, 0.1) 50%, rgba(55, 212, 164, 0) 100%), rgb(255, 255, 255)',
    contrast: '#FFFFFF',
  },
  table: {
    default: '#fcfdff',
    light: '#fcfdff1e',
  },
  action: {
    active: '#089E71',
    hover: '#e8c1ff',
    selected: '#089E71',
    disabled: 'white',
  },
  secondary: {
    main: '#666077',
    light: '#6660777f',
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
    primary: '#0F0524',
    secondary: '#666077',
    disabled: '#6660777f',
  },
}

export const boxShadows = {
  input: {
    normal: `
      inset -3px -3px 6px rgba(255, 255, 255, 0.5),
      inset 3px 3px 6px rgba(174, 174, 192, 0.16)`,
    bold: `
      inset -12px -12px 24px rgba(255, 255, 255, 0.5),
      inset 12px 12px 24px rgba(174, 174, 192, 0.16)`,
  },
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

export const overridesLight = {
  MuiButton: {
    root: {
      margin: 'inherit',
      backgroundColor: 'transparent',
      boxShadow: boxShadows.button.default,
      color: palette.primary.main,
      transition: defaultTransition,
      '&:disabled': {
        background: '#F3F6FC',
        boxShadow: boxShadows.button.default,
        color: palette.text.disabled,
      },
    },
  },
  MuiCard: {
    root: {
      padding: '12px',
      borderRadius: '12px',
      // boxShadow: boxShadows.card,
      transition: defaultTransition,
    },
  },
  MuiListItem: {
    root: {
      transition: defaultTransition,
      '&$selected': {
        backgroundColor: '#d9e0ee',
        color: palette.text.primary,
        '&:hover': {
          backgroundColor: '#089E711e',
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
      fontWeight: 600,
      fontSize: '18px',
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
      backgroundColor: '#F3F6FC',
      transition: defaultTransition,
    },
    elevation1: {
      boxShadow: 'none',
    },
  },
  MuiPopover: {
    paper: {
      transition: defaultTransition,
      borderRadius: '16px',
      boxShadow: `
          0px 5px 15px -3px rgba(0,0,0,0.1),
          0px 8px 20px 1px rgba(0,0,0,0.07),
          0px 3px 24px 2px rgba(0,0,0,0.06);
        `,
    },
  },
  MuiSelect: {
    root: {
      backgroundColor: '#e8edfb',
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
      fontSize: '14px',
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
        borderRadius: '16px',
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
      fontSize: '16px',
    },
  },
  MuiTypography: {
    root: {
      color: '#0F0524',
      transition: defaultTransition,
    },
  },
}
