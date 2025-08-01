import {
  type Signer,
  Contract,
  providers
} from 'ethers'
import type { RailsPath as RailsPathContract } from "./types/index.js"
import { railsPathABI } from './abis/index.js'

export type IRailsPath = InstanceType<typeof RailsPath>

export class RailsPath extends Contract {
  static connect(address: string, signerOrProvider: Signer | providers.Provider): RailsPath {
    return new Contract(address, railsPathABI, signerOrProvider) as RailsPathContract
  }
}
