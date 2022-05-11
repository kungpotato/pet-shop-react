import NFT from './definition/NFT.json'
import PotatoMarket from './definition/PotatoMarket.json'

interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
}

const isDevMode = process.env.NODE_ENV !== 'development'

export const secret: ISecret = {
  nftContractAddress: isDevMode ? NFT.networks[1337].address : '0xBfE449c2eca65D4B451DEDB8ba4E1D9CBeb3de0E',
  marketContractAddress: isDevMode ? PotatoMarket.networks[1337].address : '0x3F2e46Ec2CEC67d077FB2fD6fe6cceB095e71A03'
}
