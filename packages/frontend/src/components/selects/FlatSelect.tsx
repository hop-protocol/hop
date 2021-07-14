import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Select, { SelectProps } from '@material-ui/core/Select'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    width: '13.5rem',
    borderRadius: '2.3rem',
    padding: '0 2.8rem 0 0',
    '&.MuiSelect-select': {
      paddingRight: '2.8rem'
    },
    fontSize: '1.8rem',
    fontWeight: 700,
    lineHeight: '3.6rem',
    '&:focus': {
      borderRadius: '2.3rem',
      backgroundColor: 'white'
    },
    [theme.breakpoints.down('xs')]: {
      width: '12.4rem'
    }
  },
  selectMenu: {
    paddingRight: '4.8rem',
    height: '3.6rem'
  },
  icon: {
    top: 'calc(50% - 0.75rem)',
    right: '0.8rem',
    color: theme.palette.text.secondary
  }
}))

const FlatSelect: FC<SelectProps & { children: any }> = props => {
  const styles = useStyles()
  const isSingle = props?.children?.filter((x: any) => x).length <= 1
  const icon = isSingle ? () => null : ArrowDropDownIcon

  return (
    <Select
      disabled={isSingle}
      IconComponent={icon}
      {...props}
      classes={styles}
      disableUnderline
    />
  )
}

export default FlatSelect
