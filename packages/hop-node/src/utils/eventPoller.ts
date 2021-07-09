import { wait } from 'src/utils'

const eventPoller = async (
  contract: any,
  provider: any,
  eventName: string,
  cb: any
) => {
  if (provider?._network?.chainId?.toString() !== '69') {
    contract.on(eventName, cb)
    return
  }

  const poll = async () => {
    const blockNumber = await provider.getBlockNumber()
    const recents = await contract.queryFilter(
      contract.filters[eventName](),
      blockNumber - 10
    )

    return recents
  }

  const cache: any = {}
  ;(async () => {
    while (true) {
      const events = await poll()
      // console.log('events count:', events.length)
      for (const event of events) {
        console.log(event)
        if (event.args) {
          if (!cache[event.transactionHash]) {
            console.log(event)
            cache[event.transactionHash] = true
            cb(...[...event.args, event])
          }
        }
      }

      await wait(5 * 1000)
    }
  })()
}

export default eventPoller
