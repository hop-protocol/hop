import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

export const useWeb3ModalStyles = makeStyles((theme: Theme) => ({
  // TODO: not use !important
  button: {
    background: theme.palette.mode === 'dark' ? '#0000003d !important' : '#fff !important',
    width: '100% !important',
    fontSize: '2.4rem !important',
    border: '1px solid #ccc !important',
    borderRadius: '4px !important',
    display: 'flex !important',
    alignItems: 'center !important',
    gap: '1rem !important'
  }
}))
