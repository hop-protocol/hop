import { KmsSigner } from 'src/aws/KmsSigner'
import { LambdaSigner } from 'src/aws/LambdaSigner'
import { computeAddress } from 'ethers/lib/utils'
import { config as globalConfig } from 'src/config'

let cache: string = ''

export const getBonderEoaAddressFromConfig = async (): Promise<string> => {
  if (cache) {
    return cache
  }

  let address: string
  if (globalConfig.signerConfig.type === 'keystore') {
    let privateKey = globalConfig.bonderPrivateKey
    if (!privateKey) {
      throw new Error('bonder private key is required')
    }
    if (!globalConfig.bonderPrivateKey.startsWith('0x')) {
      privateKey = '0x' + privateKey
    }

    address = computeAddress(privateKey)
  } else if (globalConfig.signerConfig.type === 'kms') {
    const { keyId, awsRegion } = globalConfig.signerConfig
    const signer = new KmsSigner({ keyId: keyId!, region: awsRegion })
    address = await signer.getAddress()
  } else if (globalConfig.signerConfig.type === 'lambda') {
    const { keyId, awsRegion, lambdaFunctionName } = globalConfig.signerConfig
    const signer = new LambdaSigner({ keyId: keyId!, region: awsRegion, lambdaFunctionName: lambdaFunctionName! })
    address = await signer.getAddress()
  } else {
    throw new Error('invalid signer type')
  }

  cache = address
  return address
}

export default getBonderEoaAddressFromConfig