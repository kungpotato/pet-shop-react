import Moralis from 'moralis'
import { getEtherContract } from '../libs/ethereum'
import { INFTItem } from '../states/expore/reducer'

import { NFTInstance, PotatoMarketInstance } from '../../types/truffle-contracts'
import { config } from '../config'

export const loadNFTs = async (market: Record<string, any>, nft: Record<string, any>) => {
  const marketContract = (await getEtherContract(
    market,
    config.marketContractAddress
  )) as unknown as PotatoMarketInstance
  const ntfContract = (await getEtherContract(nft, config.nftContractAddress)) as unknown as NFTInstance
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

export async function loadMyNFTs(market: Record<string, any>, nft: Record<string, any>) {
  const marketContract = (await getEtherContract(
    market,
    config.marketContractAddress
  )) as unknown as PotatoMarketInstance
  const ntfContract = (await getEtherContract(nft, config.nftContractAddress)) as unknown as NFTInstance
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
