import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Select, { SelectProps } from '@material-ui/core/Select'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

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
      paddingRight: '2.8rem',
    },
    fontSize: '1.8rem',
    fontWeight: 700,
    lineHeight: '4.6rem',
    '&:focus': {
      borderRadius: '2.3rem',
    },
    boxShadow: theme.boxShadow.select,
  },
  selectMenu: {
    paddingRight: '4.8rem',
    height: '4.6rem',
  },
  icon: ({ value }: any) => ({
    top: 'calc(50% - 0.75rem)',
    right: '0.8rem',
    color: value === 'default' ? 'white' : theme.palette.text.secondary,
  }),
}))

const RaisedSelect: FC<SelectProps & { children: any }> = props => {
  const styles = useStyles(props)
  const isSingle = props?.children?.filter((x: any) => x).length <= 1
  const icon = isSingle ? () => null : ArrowDropDownIcon

  return <Select IconComponent={icon} {...props} classes={styles} disableUnderline />
}

export default RaisedSelect
