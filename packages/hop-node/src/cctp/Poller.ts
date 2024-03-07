import { wait } from 'src/utils/wait'

export default class Poller {
  // TODO: Any err handling?
  static async poll (fn: () => Promise<void>, interval: number) {
    while (true) {
      await fn()
      await wait(interval)
    }
  }
}
