import { utils } from 'ethers'
import { PathConfig } from './types.js'

export const paths: Record<string, PathConfig> = {
  // MOCK: Sepolia to Optimism Sepolia
  '0xf2562f695ac4ba9361f3c5f05041d5f53ec86062b47561fe0d9f29e1675b5ace': {
    pathId: '0xf2562f695ac4ba9361f3c5f05041d5f53ec86062b47561fe0d9f29e1675b5ace',
    chainId0: '11155111', // Sepolia
    tokenAddress0: '0x486910D137fA39e6B7b106a13C305F13e8219624', // MOCK
    chainId1: '11155420', // Optimism Sepolia
    tokenAddress1: '0x486910D137fA39e6B7b106a13C305F13e8219624', // MOCK
    initialReserve: utils.parseUnits('1000000', 18)
  },

  // MOCK: Sepolia to Base Sepolia
  '0xa09d30aa916c4d894c72246d122110004aabd43fd09206c02549a5dd0122b198': {
    pathId: '0xa09d30aa916c4d894c72246d122110004aabd43fd09206c02549a5dd0122b198',
    chainId0: '11155111', // Sepolia
    tokenAddress0: '0x486910D137fA39e6B7b106a13C305F13e8219624', // MOCK
    chainId1: '84532', // Base Sepolia
    tokenAddress1: '0x486910D137fA39e6B7b106a13C305F13e8219624', // MOCK
    initialReserve: utils.parseUnits('1000000', 18)
  },
  
  // MOCK: Optimism Sepolia to Base Sepolia
  '0xaeb584e28dabc839c89e66876cc40dba92e503206ceb71ced70990821a03f734': {
    pathId: '0xaeb584e28dabc839c89e66876cc40dba92e503206ceb71ced70990821a03f734',
    chainId0: '11155420', // Optimism Sepolia
    tokenAddress0: '0x486910D137fA39e6B7b106a13C305F13e8219624', // MOCK
    chainId1: '84532', // Base Sepolia
    tokenAddress1: '0x486910D137fA39e6B7b106a13C305F13e8219624', // MOCK
    initialReserve: utils.parseUnits('1000000', 18)
  },
  
  // USDC: Sepolia to Optimism Sepolia
  '0x3541ab0d01eacfd4bf63a96f8651aef9db4396ab9944d3acada716c2378cb07f': {
    pathId: '0x3541ab0d01eacfd4bf63a96f8651aef9db4396ab9944d3acada716c2378cb07f',
    chainId0: '11155111', // Sepolia
    tokenAddress0: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC
    chainId1: '11155420', // Optimism Sepolia
    tokenAddress1: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7', // USDC
    initialReserve: utils.parseUnits('1000000', 18)
  },
  
  // USDC: Sepolia to Base Sepolia
  '0x1da48538be012466f4dd90504bb95a5b22e96796fd4d78b4fde7a4ee9dc4aa8': {
    pathId: '0x1da48538be012466f4dd90504bb95a5b22e96796fd4d78b4fde7a4ee9dc4aa8',
    chainId0: '11155111', // Sepolia
    tokenAddress0: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC
    chainId1: '84532', // Base Sepolia
    tokenAddress1: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC
    initialReserve: utils.parseUnits('1000000', 18)
  },
  
  // USDC: Optimism Sepolia to Base Sepolia
  '0xd2d47e6d4c2b36ee88f1db857ba436161744b1348b41bb48ef4457a830ea3c18': {
    pathId: '0xd2d47e6d4c2b36ee88f1db857ba436161744b1348b41bb48ef4457a830ea3c18',
    chainId0: '11155420', // Optimism Sepolia
    tokenAddress0: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7', // USDC
    chainId1: '84532', // Base Sepolia
    tokenAddress1: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC
    initialReserve: utils.parseUnits('1000000', 18)
  }
}
