import makeStyles from '@mui/styles/makeStyles';

export const useNetworkSelectorStyles = makeStyles((theme: any) => ({
  networkSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    transition: 'all 0.15s ease-out'
  },
  selectNetworkText: {
    fontSize: '1.4rem',
    fontWeight: 700,
    // color: '#fff',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginLeft: '0.4rem',
    textAlign: 'center',
    transition: 'all 0.15s ease-out'
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
