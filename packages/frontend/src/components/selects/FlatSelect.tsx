import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Select, { SelectProps } from '@material-ui/core/Select'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles(theme => ({
  root: ({ value }: any) => ({
    color: value === 'default' ? '#fff' : theme.palette.text.secondary,
    background: value === 'default' ? theme.bgGradient.flat : theme.palette.action.disabled,
    minWidth: '135px',
    borderRadius: '16px',
    padding: '0 28px 0 0',
    '&.MuiSelect-select': {
      paddingRight: '28px',
    },
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '36px',
    '&:focus': {
      borderRadius: '16px',
      backgroundColor: theme.palette.action.disabled,
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 0,
      maxWidth: '100%',
    },
  }),
  selectMenu: {
    paddingRight: '48px',
    height: '36px',
  },
  icon: ({ value }: any) => ({
    top: 'calc(50% - 8px)',
    right: '8px',
    color: value === 'default' ? '#fff' : theme.palette.text.secondary,
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
