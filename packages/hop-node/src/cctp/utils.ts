import { TimeIntervals } from '#constants/constants.js'
import { wait } from '#utils/wait.js'

// TODO: V2: Is there a built-in way or better way to do this? I need the exit(1)
export async function poll(
  cb: () => Promise<void>,
  pollIntervalMs: number
): Promise<void> {
  try {
    while (true) {
      await cb()
      await wait(pollIntervalMs)
    }
  } catch (err) {
    console.trace('poll err', err)
    process.exit(1)
  }
}

// TODO: V2: Get this from config
export function getFinalityTimeFromChainIdMs(chainId: string): number {
  switch (chainId) {
    case '1':
      return 6 * TimeIntervals.ONE_MINUTE_MS
    case '10':
      return 10_000
    case '42161':
      return 10_000
    case '8453':
      return 10_000
    case '137':
      return 1 * TimeIntervals.ONE_MINUTE_MS
    default:
      throw new Error(`Unknown chainId: ${chainId}`)
  }
}
