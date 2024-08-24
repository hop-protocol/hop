import { Rails } from '#implementations/index.js'
import { RailsConfig } from '#config/index.js'
import { wait } from '#utils/wait.js'

export async function main () {
  // Get the chainIds from the RailsConfig
  const chainIds: string[] = getChainIdsFromPaths(RailsConfig.paths)

  try {
    const railsManager = new Rails.Rails(chainIds)
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

// @dev The supported chains are all chainIds defined in the desired paths
function getChainIdsFromPaths(paths: Rails.RailsPath[]): string[] {
  const chainIds: string[] = []
  for (const path of paths) {
    const sourceChainId = path.srcChainId
    if (!chainIds.includes(sourceChainId)) {
      chainIds.push(sourceChainId)
    }

    const destChainId = path.destChainId
    if (!chainIds.includes(destChainId)) {
      chainIds.push(destChainId)
    }
  }
  return chainIds
}
