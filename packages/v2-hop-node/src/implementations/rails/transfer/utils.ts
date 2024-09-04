import { RailsConfig } from '#config/index.js'
import { RailsSDK } from '../RailsSDK.js'
import type { RailsPath } from '../types.js'


export function getPathFromPathId (pathId: string): RailsPath {
  const paths: RailsPath[] = RailsConfig.paths
  const path: RailsPath | undefined = paths.find(path => RailsSDK.getPathId(path) === pathId)
  if (!path) {
    throw new Error(`Path not found for pathId: ${pathId}`)
  }

  return path
}

export function getChainIdsForPaths(paths: RailsPath[]): string[] {
  return paths.reduce((chainIds: string[], path: RailsPath) => {
    if (!chainIds.includes(path.srcChainId)) {
      chainIds.push(path.srcChainId)
    }
    if (!chainIds.includes(path.destChainId)) {
      chainIds.push(path.destChainId)
    }
    return chainIds
  }, [])
}

export function getPathIdsPerChainId(chainId: string, paths: RailsPath[]): string[] {
  return paths.reduce((pathIds: string[], path: RailsPath) => {
    if (path.srcChainId === chainId) {
      pathIds.push(RailsSDK.getPathId(path))
    }
    if (path.destChainId === chainId) {
      pathIds.push(RailsSDK.getPathId(path))
    }
    return pathIds
  }, [])
}
