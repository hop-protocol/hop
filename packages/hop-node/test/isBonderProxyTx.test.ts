import { Chain, Token } from 'src/constants'
import isBonderProxyTx from 'src/utils/isBonderProxyTx'

test('isBonderProxyTx', async () => {
    let token = Token.USDC
    let sourceChain = Chain.Arbitrum
    let destinationChain = Chain.Optimism
    let isBonder = await isBonderProxyTx(token, sourceChain, destinationChain)
    expect(isBonder).toBe(true)
}, 60_000)
