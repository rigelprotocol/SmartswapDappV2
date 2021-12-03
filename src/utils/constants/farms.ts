import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'RGP',
    lpAddresses: {
      97: '',
      56: '0xFA262F303Aa244f9CC66f312F0755d89C3793192',
    },
    token: serializedTokens.rgp,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'RGP-WBNB',
    lpAddresses: {
      97: '',
      56: '0x9218BFB996A9385C3b9633f87e9D68304Ef5a1e5',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.rgp,
  },
  {
    pid: 3,
    lpSymbol: 'BNB-BUSD',
    lpAddresses: {
      97: '',
      56: '0xC8e6305376404Df37b9D231511cD27184fa8f10A',
    },
    token: serializedTokens.bnb,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 4,
    lpSymbol: 'AXS-RGP',
    lpAddresses: {
      97: '',
      56: '0x3b087F8a582090A51BED1BCa1A5Ad1859ea14cA4',
    },
    token: serializedTokens.axs,
    quoteToken: serializedTokens.rgp,
  },
  {
    pid: 5,
    lpSymbol: 'BNB-RGP',
    lpAddresses: {
      97: '',
      56: '0x7f91f8B8Dac13DAc386058C12113936987F6Be9d',
    },
    token: serializedTokens.bnb,
    quoteToken: serializedTokens.rgp,
  },
  {
    pid: 6,
    lpSymbol: 'AXS-BUSD',
    lpAddresses: {
      97: '',
      56: '0xF69f02FD07173CEB87808088e791F192fCCf1187',
    },
    token: serializedTokens.axs,
    quoteToken: serializedTokens.busd,
  }
]

export default farms
