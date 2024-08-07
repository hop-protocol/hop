import { wait } from '#utils/wait.js'
import type { Logger } from '#logger/index.js'

export async function poll(
  cb: () => Promise<void>,
  pollIntervalMs: number,
  logger: Logger
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      await cb()
      await wait(pollIntervalMs)
    }
  } catch (err) {
    logger.critical('poll err', err)
    process.exit(1)
  }
}
