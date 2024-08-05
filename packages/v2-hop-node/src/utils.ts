import { wait } from '#utils/wait.js'
import type { Logger } from '#logger/index.js'

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
