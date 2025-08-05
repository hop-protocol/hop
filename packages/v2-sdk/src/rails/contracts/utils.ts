import {  type RailsPath } from '../types.js'

// TODO: This should be done by the contract. Remove when it is
export function formatPathInfo(pathInfo: any): RailsPath {
  return {
    chainId: pathInfo[0].toString(),
    token: pathInfo[1],
    counterpartChainId: pathInfo[2].toString(),
    counterpartToken: pathInfo[3],
    initialReserve: pathInfo[4]
  }
}
