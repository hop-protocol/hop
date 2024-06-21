import { wait } from '#utils/wait.js'

// TODO: Is there a built-in way or better way to do this? I need the exit(1)
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