import '../moduleAlias'
//import l2OptimismWallet from 'src/wallets/l2OptimismWallet'
import { parseUnits } from 'ethers/lib/utils'
import { contracts } from 'src/contracts'
import { arbitrumNetworkId } from 'src/constants'

async function send () {
  const deadline = (Date.now() / 1000 + 300) | 0
  const chainId = arbitrumNetworkId
  const transferNonce = Date.now()
  const relayerFee = '0'
  const amountOutIn = '0'
  const destinationAmountOutMin = '0'
  const amount = parseUnits('1', 18)
  const l2Bridge = contracts['DAI'].optimism.l2Bridge
  const recipient = await l2Bridge.signer.getAddress()

  const tx = await l2Bridge.swapAndSend(
    chainId,
    recipient,
    amount,
    transferNonce,
    relayerFee,
    amountOutIn,
    deadline,
    destinationAmountOutMin,
    deadline
  )

  console.log(tx?.hash)
}

send()
