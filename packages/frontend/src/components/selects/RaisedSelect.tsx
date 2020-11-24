import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Select, { SelectProps } from '@material-ui/core/Select'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: '3.2rem',
    borderRadius: '2.3rem',
    paddingTop: '0.0rem',
    paddingLeft: '1.8rem',
    paddingBottom: '0.0rem',
    paddingRight: '2.8rem',
    '&.MuiSelect-select': {
      paddingRight: '2.8rem'
    },
    fontSize: '1.8rem',
    fontWeight: 700,
    lineHeight: '4.6rem',
    '&:focus': {
      borderRadius: '2.3rem',
      backgroundColor: theme.palette.background.paper
    },
    boxShadow: `
      6px 6px 12px rgba(174, 174, 192, 0.3),
      -5px -5px 12px #FFFFFF,
      inset 6px 6px 12px rgba(174, 174, 192, 0.08),
      inset -5px -5px 12px rgba(255, 255, 255, 0.02)
    `
  },
  selectMenu: {
    paddingRight: '4.8rem',
    height: '4.6rem'
  },
  icon: {
    top: 'calc(50% - 0.75rem)',
    right: '0.8rem',
    color: theme.palette.text.secondary
  }
}))

const RaisedSelect: FC<SelectProps> = props => {
  const styles = useStyles()

  return <Select {...props} classes={styles} disableUnderline />
}

export default RaisedSelect
