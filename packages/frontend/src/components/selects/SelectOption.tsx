import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.15s ease-out',
  },
  listItemIcon: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
    marginRight: '10px',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: 'auto',
    maxWidth: '30px',
    height: '30px',
    objectFit: 'contain',
  },
}))

type Props = {
  value?: string
  label?: string
  icon?: any
}

const SelectOption: FC<Props> = props => {
  const styles = useStyles()
  const { label, icon } = props

  if (!(icon || label)) {
    return null
  }

  const isIconComponent = typeof icon !== 'string'

  return (
    <div className={styles.root}>
      {(icon && !isIconComponent) && (
        <ListItemIcon className={styles.listItemIcon}>
          <Icon className={styles.icon}>
            <img src={icon} className={styles.image} alt="" />
          </Icon>
        </ListItemIcon>
      )}
      {(icon && isIconComponent) && (
        <ListItemIcon className={styles.listItemIcon}>
          <Icon className={styles.icon}>
            <Box className={styles.image}>
              {icon}
            </Box>
          </Icon>
        </ListItemIcon>
      )}
      {label && (
        <Typography component="span" variant="h6">
          {label}
        </Typography>
      )}
    </div>
  )
}

export default SelectOption
