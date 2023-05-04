import { makeStyles } from '@material-ui/core'

export const useNetworkSelectorStyles = makeStyles((theme: any) => ({
  networkSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    transition: 'all 0.15s ease-out'
  },
  networkLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  networkIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
  },
  networkIcon: {
    display: 'flex',
    height: '22px',
    margin: '8px',
  },
}))
