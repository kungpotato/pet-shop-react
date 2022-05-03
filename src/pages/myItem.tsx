import { useEffect, useState } from 'react'
import { INFTItem } from '../App'
import { getEtherContract } from '../libs/ethereum'
import PotatoMarket from '../definition/PotatoMarket.json'
import NFT from '../definition/NFT.json'
import { PotatoMarketInstance, NFTInstance } from '../../types/truffle-contracts'
import Moralis from 'moralis'
import { Box } from '@mui/material'
import { CardItem } from '../components/Card'
import { accountChanged } from '../libs/metamask'

export const MyItem = (): JSX.Element => {
  const [nftsList, setNftsList] = useState<INFTItem[]>([])

  useEffect(() => {
    loadMyNFTs()
  }, [])

  accountChanged((ac) => {
    console.log(ac)
    loadMyNFTs()
  })

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

    setNftsList(items)
  }

  return (
    <Box p={4} display="flex">
      {nftsList.map((e, i) => (
        <Box p={2} key={i}>
          <CardItem data={e} isForSale={false} />
        </Box>
      ))}
    </Box>
  )
}
