import TransfersDb from './TransfersDb'
import TransferRootsDb from './TransferRootsDb'

export default {
  transfers: new TransfersDb('transfers'),
  transferRoots: new TransferRootsDb('transferRoots')
}
