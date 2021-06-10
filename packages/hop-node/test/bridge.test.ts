require('dotenv').config()
import contracts from 'src/contracts'
import L1Bridge from 'src/watchers/classes/L1Bridge'


describe('bridge', () => {
  const token = 'USDC'
  const network = 'ethereum'
  const tokenContracts = contracts.get(token, network)
  const bridgeContract = tokenContracts.l1Bridge
  const bridge = new L1Bridge(bridgeContract)

  test('generateKeystore - with passphrase', async () => {
    async () => { 
      // const cb = (start: number, end: number, index: number): Promise<boolean|void> => { return }
      // const opts = {}

      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
          console.log(start, end, index)
        }
      )
    }
    expect(1).toBe(1)
  })

})

// public async eventsBatch (
//   cb: (start?: number, end?: number, i?: number) => Promise<void | boolean>,
//   options: any = {
//     key: '',
//     startBlockNumber: undefined,
//     endBlockNumber: undefined
//   }
// ) {