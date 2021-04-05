import './moduleAlias'
import { Signer, Contract } from 'ethers'
import { Transfer } from 'src/models'
import l1BridgeArtifact from './abi/L1_Bridge.json'
import _version from './version'

type SendL1ToL2Input = {
  destinationChainId: string | number
  relayerFee?: string
  amount: string
  amountOutMin?: string
}

type SendL2ToL1Input = {}

type SendL2ToL2Input = {}

class Hop {
  public defaultDeadlineMinutes = 30
  public signer: Signer

  constructor (signer?: Signer) {
    if (signer) {
      this.signer = signer
    }
  }

  connect (signer: Signer) {
    this.signer = signer
    return this
  }

  async send (transfer: Transfer) {
    if (transfer.route.source.isL1) {
    }
  }

  private async sendL1ToL2 (input: SendL1ToL2Input) {
    const { destinationChainId, relayerFee, amount, amountOutMin } = input
    const deadline = this.defaultDeadlineSeconds
    const recipient = await this.getSignerAddress()
    return this.l1Bridge.sendToL2(
      destinationChainId,
      recipient,
      amount || 0,
      amountOutMin || 0,
      deadline,
      relayerFee || 0
    )
  }

  private async sendL2ToL1 (input: SendL2ToL1Input) {}

  private async sendL2ToL2 (input: SendL2ToL2Input) {}

  getSignerAddress () {
    return this.signer?.getAddress()
  }

  get l1Bridge () {
    const l1BridgeAddress = ''
    return new Contract(l1BridgeAddress, l1BridgeArtifact.abi, this.signer)
  }

  get defaultDeadlineSeconds () {
    return (Date.now() / 1000 + this.defaultDeadlineMinutes * 60) | 0
  }

  get version () {
    return _version
  }
}

export default Hop
