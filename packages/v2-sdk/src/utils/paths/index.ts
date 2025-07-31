import { PathConfig, sepoliaPaths, mainnetPaths } from '../../config/paths/index.js'

// Aggregate all paths from different networks
const allPaths: Record<string, PathConfig> = {
  ...sepoliaPaths,
  ...mainnetPaths
}

export function getPaths(): PathConfig[] {
  return Object.values(allPaths)
}

export function getPath(pathId: string): PathConfig | undefined {
  return allPaths[pathId]
}
