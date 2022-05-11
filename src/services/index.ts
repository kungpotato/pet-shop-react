import Moralis from 'moralis'
import { getEtherContract } from '../libs/ethereum'
import { INFTItem } from '../states/expore/reducer'
import PotatoMarket from '../definition/PotatoMarket.json'
import NFT from '../definition/NFT.json'
import { NFTInstance, PotatoMarketInstance } from '../../types/truffle-contracts'
import { secret } from '../../secret'

export const loadNFTs = async () => {
  const marketContract = (await getEtherContract(
    PotatoMarket,
    secret.marketContractAddress
  )) as unknown as PotatoMarketInstance
  const ntfContract = (await getEtherContract(NFT, secret.nftContractAddress)) as unknown as NFTInstance
  const marketItems = (await marketContract?.fetchMarketItems()) ?? []

  const items = await Promise.all(
    marketItems.map(async (i) => {
      const tokenUri = await ntfContract?.tokenURI(i.tokenId)

      const query = new Moralis.Query('potatoNFTMarket')
      query.equalTo('itemId', i.itemId.toNumber())
      const res = await query.find()
      const data = JSON.parse(res[0].get('data'))

      const item: INFTItem = {
        price: i.price.toString(),
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: tokenUri,
        name: data['name'],
        description: data['description']
      }
      return item
    })
  )
  console.log(`loadNFTs==>${items}`)
  return items
}

export async function loadMyNFTs() {
  const marketContract = (await getEtherContract(
    PotatoMarket,
    secret.marketContractAddress
  )) as unknown as PotatoMarketInstance
  const ntfContract = (await getEtherContract(NFT, secret.nftContractAddress)) as unknown as NFTInstance
  const marketItems = (await marketContract?.fetchMyNfts()) ?? []

  const items = await Promise.all(
    marketItems.map(async (i) => {
      const tokenUri = await ntfContract?.tokenURI(i.tokenId)

      const query = new Moralis.Query('potatoNFTMarket')
      query.equalTo('itemId', i.itemId.toNumber())
      const res = await query.find()
      const data = JSON.parse(res[0].get('data'))

      const item = {
        price: i.price.toString(),
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: tokenUri,
        name: data['name'],
        description: data['description']
      }
      return item
    })
  )
  console.log(`loadMyNFTs==>${items}`)
  return items
}
