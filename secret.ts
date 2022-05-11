import NFT from './src/definition/NFT.json'
import PotatoMarket from './src/definition/PotatoMarket.json'

interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
}

const isDevMode = process.env.NODE_ENV !== 'development'

export const secret: ISecret = {
  nftContractAddress: isDevMode ? NFT.networks[1337].address : '0x2A97E8eda14ff6BeFCc316C4EC41a0FC1CA59c52',
  marketContractAddress: isDevMode ? PotatoMarket.networks[1337].address : '0x7a9B9fCF13a14147f9E2A05680Bf0faec90Df9C7'
}
