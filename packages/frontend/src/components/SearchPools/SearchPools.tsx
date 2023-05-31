import React, { ChangeEvent } from 'react'
import { Theme, makeStyles } from '@material-ui/core'
import { useThemeMode } from 'src/theme/ThemeProvider'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import InfoTooltip from '../InfoTooltip/InfoTooltip'

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    marginRight: 8,
    marginLeft: 4
  },
  input: {
    background: theme.palette.type === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '1rem',
    fontSize: '1em',
    fontWeight: 'normal',
    fontFamily: 'Nunito,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    border: 0,
    outline: 0,
    width: 250,
    color: theme.palette.text.primary,
    padding: '0.75em'
  }
}))

interface SearchPoolsProps {
  handleChange?: any
}

export default function SearchPools(props: SearchPoolsProps) {
  const { isDarkMode } = useThemeMode()
  const styles = useStyles({ isDarkMode })

  return (
    <Box>
      <InfoTooltip title="Look for specific live pools" placement="left" />

      <Typography className={styles.label} variant="subtitle2" component="span">
        Search: 
      </Typography>

      <input className={styles.input} placeholder="Search Pools" onChange={(e) => props.handleChange(e.target.value)} />
    </Box>
  )
}
