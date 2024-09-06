import { Rails } from '#implementations/index.js'
import { RailsConfig } from '#config/index.js'
import { wait } from '#utils/wait.js'

export async function main (): Promise<never> {
  try {
    const clients = Object.values(Rails.RailsClientName)
    const railsManager = new Rails.Rails(clients, RailsConfig.paths)
    await railsManager.start()
    // TODO: V2: Add logger
    console.log('Rails Manager started')

    // TODO: V2: Better way to run
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      await wait (60_000)
    }
  } catch (err: any) {
    console.trace(err)
    throw new Error(`Rails CLI error: ${err.message}`)
  }
}
