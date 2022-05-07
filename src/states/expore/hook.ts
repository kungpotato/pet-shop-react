import { getEtherContract } from '../../libs/ethereum'
import { INFTItem, setMyNFTs, setNFTs } from './reducer'
import PotatoMarket from '../../definition/PotatoMarket.json'
import NFT from '../../definition/NFT.json'
import { NFTInstance, PotatoMarketInstance } from '../../../types/truffle-contracts'
import Moralis from 'moralis'
import { getMetamask } from '../../libs/metamask'
import { getChainId } from '../../libs/web3'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useCallback } from 'react'

const loadNFTs = async () => {
  const marketContract = (await getEtherContract(PotatoMarket)) as unknown as PotatoMarketInstance
  const ntfContract = (await getEtherContract(NFT)) as unknown as NFTInstance
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

  return items
}

async function loadMyNFTs() {
  const marketContract = (await getEtherContract(PotatoMarket)) as unknown as PotatoMarketInstance
  const ntfContract = (await getEtherContract(NFT)) as unknown as NFTInstance
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

  return items
}

export const getMetamaskAccount = async () => {
  const accounts = await getMetamask()

  const chainId = await getChainId()
  if (chainId !== 1337) {
    console.log('incurrect chain')
  }

  return accounts
}

export const useExpore = () => {
  const { nfts, mynfts } = useAppSelector((state) => state.expore)
  const dispatch = useAppDispatch()

  return {
    nfts,
    mynfts,
    loadNFTs: useCallback(() => {
      loadNFTs().then((val) => {
        console.log(`loadNFTs==>${val}`)
        dispatch(setNFTs(val))
      })
    }, [dispatch]),
    clearNFTs: () => {
      dispatch(setNFTs([]))
    },
    loadMyNFTs: () => {
      loadMyNFTs().then((val) => {
        console.log(`loadMyNFTs==>${val}`)
        dispatch(setMyNFTs(val))
      })
    },
    clearMyNFTs: () => {
      dispatch(setMyNFTs([]))
    }
  }
}
