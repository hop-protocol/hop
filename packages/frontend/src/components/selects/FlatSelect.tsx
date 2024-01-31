import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import React, { FC } from 'react'
import Select, { SelectProps } from '@mui/material/Select'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: any) => ({
  root: ({ value }: any) => ({
    color: value === 'default' ? '#fff' : theme.palette.text.secondary,
    background: value === 'default' ? theme.bgGradient?.flat : theme.palette.action.disabled,
    minWidth: '13.5rem',
    borderRadius: '2.3rem',
    padding: '0 2.8rem 0 0',
    '& .MuiSelect-select': {
      minHeight: '0',
      padding: '0',
      paddingRight: '2.8rem',
    },
    fontSize: '1.8rem',
    fontWeight: 700,
    lineHeight: '3.6rem',
    '&:focus': {
      borderRadius: '2.3rem',
      backgroundColor: theme.palette.action.disabled,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '&.MuiInputBase-colorPrimary': {
      '& .MuiTypography-root': {
        color: value === 'default' ? theme.palette?.primary.contrastText : 'inherit',
      },
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 0,
      maxWidth: '100%',
    },
  }),
  selectMenu: {
    paddingRight: '4.8rem',
    height: '3.6rem',
  },
  icon: ({ value }: any) => ({
    top: 'calc(50% - 0.75rem)',
    right: '0.8rem',
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
