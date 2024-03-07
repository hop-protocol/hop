import { wait } from 'src/utils/wait'

export default class Poller {
  static async poll (fn: () => Promise<void>, interval: number) {
    while (true) {
      await fn()
      await wait(interval)
    }
  }
}
