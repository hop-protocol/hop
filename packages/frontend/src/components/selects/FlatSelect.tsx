import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Select, { SelectProps } from '@material-ui/core/Select'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles(theme => ({
  root: ({ value }: any) => ({
    color: value === 'default' ? 'white' : theme.palette.text.secondary,
    background: value === 'default' ? theme.bgGradient.flat : theme.palette.action.disabled,
    width: '13.5rem',
    borderRadius: '2.3rem',
    padding: '0 2.8rem 0 0',
    '&.MuiSelect-select': {
      paddingRight: '2.8rem',
    },
    fontSize: '1.8rem',
    fontWeight: 700,
    lineHeight: '3.6rem',
    '&:focus': {
      borderRadius: '2.3rem',
      backgroundColor: theme.palette.action.disabled,
    },
    [theme.breakpoints.down('xs')]: {
      width: '12rem',
    },
  }),
  selectMenu: {
    paddingRight: '4.8rem',
    height: '3.6rem',
  },
  icon: ({ value }: any) => ({
    top: 'calc(50% - 0.75rem)',
    right: '0.8rem',
    color: value === 'default' ? 'white' : theme.palette.text.secondary,
  }),
}))

const FlatSelect: FC<SelectProps & { children: any }> = props => {
  const styles = useStyles(props)
  const isSingle = props?.children?.filter((x: any) => x).length <= 1
  const icon = isSingle ? () => null : ArrowDropDownIcon

  return (
    <Select disabled={isSingle} IconComponent={icon} {...props} classes={styles} disableUnderline />
  )
}

export default FlatSelect
