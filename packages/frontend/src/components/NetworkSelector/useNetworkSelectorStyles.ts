import { makeStyles } from '@material-ui/core'

export const useNetworkSelectorStyles = makeStyles(theme => ({
  networkSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
  },
}))
