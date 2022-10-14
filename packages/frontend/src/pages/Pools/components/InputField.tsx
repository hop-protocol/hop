import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  box: {
    background: theme.palette.type === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '1rem',
    position: 'relative'
  },
  input: {
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily: 'Nunito,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    border: 0,
    outline: 0,
    width: '100%',
    textAlign: 'right',
    background: 'none',
    color: theme.palette.text.primary,
  },
  image: {
    width: '24px'
  }
}))

export function InputField (props: any) {
  const styles = useStyles()
  const {
    tokenImageUrl,
    tokenSymbol,
    value,
    onChange,
    disabled
  } = props

  function handleChange(event: any) {
    if (onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <Box p={2} className={styles.box} display="flex">
      <Box display="flex" alignItems="center">
        {!!tokenImageUrl && (
          <Box mr={1} display="flex" alignItems="center">
            <img className={styles.image} src={tokenImageUrl} alt={tokenSymbol} title={tokenSymbol} />
          </Box>
        )}
        <Box mr={1} display="flex" alignItems="center">
          <Typography variant="subtitle1">
            {tokenSymbol}
          </Typography>
        </Box>
      </Box>
      <input type="text" placeholder="0.0" value={value} onChange={handleChange} className={styles.input} disabled={disabled} />
    </Box>
  )
}
