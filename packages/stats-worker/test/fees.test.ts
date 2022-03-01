/*
import { BigNumber } from 'ethers'
import {
  parseUnits,
  formatEther,
  parseEther,
  formatUnits
} from 'ethers/lib/utils'
import BonderBalanceStats from 'src/BonderBalanceStats'

const data: any = {
  '0xa6a688F107851131F0E1dce493EbBebFAf99203e': {
    USDC: {
      optimism: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x065fa55d2e'
        },
        native: {
          type: 'BigNumber',
          hex: '0x809fe338fadbf1dc'
        }
      },
      arbitrum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x05b1baebaa'
        },
        native: {
          type: 'BigNumber',
          hex: '0x4d497897559b13af'
        }
      },
      gnosis: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x046c76aa10'
        },
        native: {
          type: 'BigNumber',
          hex: '0x18af8875c5ac93c091'
        }
      },
      polygon: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x04f9b8b63e'
        },
        native: {
          type: 'BigNumber',
          hex: '0x321616ea146f2d0386'
        }
      },
      ethereum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x03b6c17f39'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x61ff1786f569baab'
        }
      }
    }
  },
  '0x15ec4512516d980090050fe101de21832c8edfee': {
    USDT: {
      optimism: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x21c39dec'
        },
        native: {
          type: 'BigNumber',
          hex: '0x448340e6f4ea3e1a'
        }
      },
      arbitrum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x2f11590f'
        },
        native: {
          type: 'BigNumber',
          hex: '0x43f9ac4b2b2eaff7'
        }
      },
      gnosis: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x1a7edbc2'
        },
        native: {
          type: 'BigNumber',
          hex: '0x1afcf75c592cedcd94'
        }
      },
      polygon: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x2b337eab'
        },
        native: {
          type: 'BigNumber',
          hex: '0x3561114993d410c516'
        }
      },
      ethereum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x01806aae6e'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x6b58ebac62384d59'
        }
      }
    }
  },
  '0xd8781ca9163e9f132a4d8392332e64115688013a': {
    MATIC: {
      gnosis: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x01bfd3e15eb402a5cb05'
        },
        native: {
          type: 'BigNumber',
          hex: '0x031b0106d4a1944a1b'
        }
      },
      polygon: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0xd9d22aa6754ddd7233'
        },
        native: {
          type: 'BigNumber',
          hex: '0x0d3ef9b395fd9abef2'
        }
      },
      ethereum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x032d7249e0406ca85dc1'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x1733b5ee3536ac85'
        }
      }
    }
  },
  '0x305933e09871D4043b5036e09af794FACB3f6170': {
    DAI: {
      optimism: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x011fbf13658cf912c9b7'
        },
        native: {
          type: 'BigNumber',
          hex: '0x213ad03bc070af8c'
        }
      },
      arbitrum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0xcf0a4950bca524976b'
        },
        native: {
          type: 'BigNumber',
          hex: '0x227056ca2fe30bb0'
        }
      },
      gnosis: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x01182b0795a73a82c4e1'
        },
        native: {
          type: 'BigNumber',
          hex: '0x5a220a21c225a2fb63'
        }
      },
      polygon: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x77fa17deacdef1b629'
        },
        native: {
          type: 'BigNumber',
          hex: '0x2ed469203ca688a071'
        }
      },
      ethereum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x035a7608b4ebd3b7f402'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x28fadd8692592572'
        }
      }
    }
  },
  '0x710bDa329b2a6224E4B44833DE30F38E7f81d564': {
    ETH: {
      optimism: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0xa6c9f54dcde7f5cd'
        },
        native: {
          type: 'BigNumber',
          hex: '0x341b9315c40c298d'
        }
      },
      arbitrum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0xa1a7c4c6db0f5217'
        },
        native: {
          type: 'BigNumber',
          hex: '0x298f0a8e9ba4451e'
        }
      },
      gnosis: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x0aec28fe4e040e30'
        },
        native: {
          type: 'BigNumber',
          hex: '0x06cf0d3e3356427b9b'
        }
      },
      polygon: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x242580e13efc4fe0'
        },
        native: {
          type: 'BigNumber',
          hex: '0x29d66744d7a57c18f3'
        }
      },
      ethereum: {
        canonical: {
          type: 'BigNumber',
          hex: '0xc1f062dedd39f56d'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0xc1f062dedd39f56d'
        }
      }
    }
  },
  '0x2A6303e6b99d451Df3566068EBb110708335658f': {
    WBTC: {
      optimism: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x060b418d743292f9'
        }
      },
      arbitrum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x05a404145e5f208a'
        }
      },
      gnosis: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x884e80f2b0b2a0b0'
        }
      },
      polygon: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x0691c2ce93763cd713'
        }
      },
      ethereum: {
        canonical: {
          type: 'BigNumber',
          hex: '0x00'
        },
        hToken: {
          type: 'BigNumber',
          hex: '0x00'
        },
        native: {
          type: 'BigNumber',
          hex: '0x215aaf216b0a6421'
        }
      }
    }
  }
}

const initialAggregateBalances: any = {
  USDC: parseUnits('6026000', 6),
  USDT: parseUnits('2121836', 6),
  DAI: parseUnits('5000000', 18),
  ETH: parseUnits('3984', 18),
  MATIC: parseUnits('731948.94', 18)
}

const initialAggregateNativeBalances: any = {
  USDC: {
    ethereum: parseUnits('14', 18)
  }
}

const initialUnstakedAmounts: any = {
  USDC: parseUnits('0', 6),
  USDT: parseUnits('0', 6),
  DAI: parseUnits('0', 18),
  ETH: parseEther('0'),
  MATIC: parseUnits('0', 18)
}

const restakedProfits: any = {
  USDC: parseUnits('11988.7', 6),
  USDT: parseUnits('0', 6),
  DAI: parseUnits('0', 18),
  ETH: parseEther('10'),
  MATIC: parseUnits('0', 18)
}

const prices: any = {
  USDC: 1,
  USDT: 1,
  DAI: 1,
  ETH: 3100,
  MATIC: 1.9
}

const expectedResults: any = {
  USDC: 146837,
  USDT: 65811,
  DAI: 59918,
  ETH: 72,
  MATIC: 30286
}

const expectedResultsUsd: any = {
  USDC: 146837,
  USDT: 65811,
  DAI: 59918,
  ETH: 224040,
  MATIC: 57544
}

describe('bonder balance stats', () => {
  it('should return calculated bonder profits', async () => {
    const stats = new BonderBalanceStats()
    const tokens = ['USDC', 'USDT', 'DAI', 'ETH', 'MATIC']
    for (const token of tokens) {
      const initialAggregateBalance = initialAggregateBalances[token]
      const initialUnstakedAmount = initialUnstakedAmounts[token]
      const initialAggregateNativeBalance =
        initialAggregateNativeBalances?.[token]
      const profits = restakedProfits[token]
      const { resultFormatted, resultUsd } = await stats.computeResult({
        data,
        token,
        initialAggregateBalance,
        initialUnstakedAmount,
        initialAggregateNativeBalance,
        profits,
        prices
      })
      expect(resultFormatted | 0).toBe(expectedResults[token])
      expect(resultUsd | 0).toBe(expectedResultsUsd[token])
    }
  })
})
*/
