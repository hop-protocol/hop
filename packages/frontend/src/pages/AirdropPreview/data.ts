import { HopAirdropPreview } from './useAirdropPreview'

// volumn only matters if bridgeTxs == 2

export const data: HopAirdropPreview[] = [
  {
    // 0, 0
    address: '0xb7E22bdDEC43A7bC82C052c3C849D5d5fDC5afAa',
    bridgeTxs: 1,
    volume: 300,
    lp: false,
  },
  {
    // 0, 1
    address: '0xC35F4C7370C3efDFa628EF351f3ec822CaD47b65',
    bridgeTxs: 1,
    volume: 300,
    lp: true,
  },
  {
    // 0, 1
    address: '0xD41732398f566F67E942aF72315457c89A077f5C',
    bridgeTxs: 1,
    volume: 500,
    lp: true,
  },
  {
    // 1, 0
    address: '0xD8D60a885F0635E65363Cf4e7DeCD2fA39984A05',
    bridgeTxs: 2,
    volume: 300,
    lp: false,
  },
  {
    // 1, 1
    address: '0x3EAa33f296C10aca61206B28fb7DFeEcf7C4489C',
    bridgeTxs: 2,
    volume: 300,
    lp: true,
  },
  {
    // 0, 0
    address: '0x79dF6c3E2959D57BbaDF4d9925Ae0caE6B5106DE',
    bridgeTxs: 2,
    volume: 200,
    lp: false,
  },
  {
    // 0, 1
    address: '0x537c37b51707BD91f09555F68790562760B2C716',
    bridgeTxs: 2,
    volume: 200,
    lp: true,
  },
]
