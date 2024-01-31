import { makeStyles } from '@mui/styles'

export const useNetworkSelectorStyles = makeStyles((theme: any) => ({
  networkSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectNetworkText: {
    fontSize: '1.4rem',
    fontWeight: 700,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginLeft: '0.4rem',
    textAlign: 'center',
  },
  networkLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '0.4rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  networkIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
  },
  networkIcon: {
    display: 'flex',
    height: '2.2rem',
    margin: '0.7rem',
  }
}))
