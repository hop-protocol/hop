import getTransferRootId from '#utils/getTransferRootId.js'
import { BigNumber } from 'ethers'

test('getTransferRootId', () => {
  const rootHash = '0xb7210d75e718ea997ad4065e812ba5cd69f8a6e271b7453d2f36b76aeaacfcc7'
  const totalAmount = BigNumber.from('0x07ed35480f')
  expect(getTransferRootId(rootHash, totalAmount)).toBe('0x496a6c50b116b33632088f75444347e54b9caf6416e016df1ec798b162b85827')
})
