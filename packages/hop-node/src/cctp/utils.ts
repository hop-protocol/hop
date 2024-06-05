import { wait } from '#utils/wait.js'

// TODO: Don't do this

export async function poll(
  cb: () => Promise<void>,
  pollIntervalMs: number
): Promise<void> {
  // TODO: more explicit err handling
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