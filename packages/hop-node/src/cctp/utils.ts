import { TimeIntervals } from '#constants/constants.js'
import { wait } from '#utils/wait.js'
import { Logger } from '#logger/index.js'

// TODO: V2: Is there a built-in way or better way to do this? I need the exit(1)
export async function poll(
  cb: () => Promise<void>,
  pollIntervalMs: number,
  logger: Logger
): Promise<void> {
  try {
    while (true) {
      await cb()
      await wait(pollIntervalMs)
    }
  } catch (err) {
    logger.critical('poll err', err)
    process.exit(1)
  }
}

// TODO: V2: Get this from config
// This represents the custom finality time for each chain
export function getFinalityTimeFromChainIdMs(chainId: string): number {
  switch (chainId) {
    case '1':
      return 6 * TimeIntervals.ONE_MINUTE_MS
    case '10':
      return 6 * TimeIntervals.ONE_MINUTE_MS
    case '42161':
      return 6 * TimeIntervals.ONE_MINUTE_MS
    case '8453':
      return 6 * TimeIntervals.ONE_MINUTE_MS
    case '137':
      return 6 * TimeIntervals.ONE_MINUTE_MS
    default:
      throw new Error(`Unknown chainId: ${chainId}`)
  }
}
