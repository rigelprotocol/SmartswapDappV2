import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms = [
  {
    pid: 1,
    lpSymbol: 'RGP',
    lpAddresses: {
      97: '0x7fE2Ec631716FeF3657BcB8d80CffBB2A34F7617',
      56: '0x100514759DCD6e2Ccbb9EB87481b96de28C4b77F',
    },
    inflation: 250,
    token: serializedTokens.rgp,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'RGP-BNB',
    lpAddresses: {
      97: '0xca01606438556b299005b36B86B38Fe506eadF9F',
      56: '0x9218BFB996A9385C3b9633f87e9D68304Ef5a1e5',
    },
    inflation: 953.3333333,
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.rgp,
  },
  {
    pid: 3,
    lpSymbol: 'BNB-BUSD',
    lpAddresses: {
      97: '0x120f3E6908899Af930715ee598BE013016cde8A5',
      56: '0xC8e6305376404Df37b9D231511cD27184fa8f10A',
    },
    inflation: 476.6666667,
    token: serializedTokens.bnb,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 4,
    lpSymbol: 'AXS-RGP',
    lpAddresses: {
      97: '0x30d8621d919b69c0D7920A7dC8936d457F3f8965',
      56: '0x3b087F8a582090A51BED1BCa1A5Ad1859ea14cA4',
    },
    inflation: 715,
    token: serializedTokens.axs,
    quoteToken: serializedTokens.rgp,
  },
  {
    pid: 5,
    lpSymbol: 'BUSD-RGP',
    lpAddresses: {
      97: '0x0B0a1E07931bD7991a104218eE15BAA682c05e01',
      56: '0x7f91f8B8Dac13DAc386058C12113936987F6Be9d',
    },
    inflation: 3336.666667,
    token: serializedTokens.busd,
    quoteToken: serializedTokens.rgp,
  },
  {
    pid: 6,
    lpSymbol: 'AXS-BUSD',
    lpAddresses: {
      97: '0x816b823d9C7F30327B2c626DEe4aD731Dc9D3641',
      56: '0xF69f02FD07173CEB87808088e791F192fCCf1187',
    },
    inflation: 238.3333333,
    token: serializedTokens.axs,
    quoteToken: serializedTokens.busd,
  }
]

export default farms
