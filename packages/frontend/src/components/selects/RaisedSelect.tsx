import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Select, { SelectProps } from '@material-ui/core/Select'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: '32px',
    borderRadius: '16px',
    padding: '4px 8px 4px 8px',
    '&.MuiSelect-select': {
      paddingRight: '28px',
    },
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '46px',
    '&:focus': {
      borderRadius: '16px',
    },
    // boxShadow: theme.boxShadow.select,
  },
  selectMenu: {
    paddingRight: '48px',
    height: '32px',
  },
  icon: ({ value }: any) => ({
    top: 'calc(50% - 8px)',
    right: '8px',
    color: value === 'default' ? '#fff' : theme.palette.text.secondary,
  }),
}))

const RaisedSelect: FC<SelectProps & { children: any }> = props => {
  const styles = useStyles(props)
  const isSingle = props?.children?.filter((x: any) => x).length <= 1
  const icon = isSingle ? () => null : ArrowDropDownIcon

  return <Select IconComponent={icon} {...props} classes={styles} disableUnderline />
}

export default RaisedSelect
