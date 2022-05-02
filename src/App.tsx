import './style.css'

import { chainChanged, getMetamask } from './libs/metamask'
// import { getEtherContract } from './libs/ethereum'
import Adoption from './definition/Adoption.json'
import PotatoMarket from './definition/PotatoMarket.json'
import NFT from './definition/NFT.json'
import { AdoptionInstance, PotatoMarketInstance, NFTInstance } from '../types/truffle-contracts'
import { contractEvent, getChainId, getContractEvent, getWeb3Contract } from './libs/web3'
import CardItem from './components/Card'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import ResponsiveAppBar from './components/Appbar'
import { Box } from '@mui/material'
import { MoralisProvider } from 'react-moralis'
import { getEtherContract } from './libs/ethereum'
import Moralis from 'moralis'

export interface INFTItem {
  price: string
  itemId: number
  seller: string
  owner: string
  image: any
  name: any
  description: any
}

function App(): JSX.Element {
  let count = 0
  const [nfts, setNfts] = useState<INFTItem[]>([])
  const [accounts, setAccounts] = useState<string[]>([])

  const getMetamaskAccount = async () => {
    const accounts = await getMetamask()

    const chainId = await getChainId()
    if (chainId !== 1337) {
      alert('incurrect chain')
    }

    return accounts
  }

  async function adopt() {
    // const contract = await getEtherContract(Adoption)
    const contract = (await getEtherContract(Adoption)) as unknown as AdoptionInstance
    const adopt = await contract.adopt(count.toString())
    await adopt.wait()

    count += 1
    console.log(count)

    // Get the value from the contract to prove it worked.
    let getAdopters = await contract?.methods.getAdopters()
    getAdopters = await (getAdopters as any).call()

    console.log({ getAdopters })

    const events = await getContractEvent(contract as any, contractEvent.Log)
    console.log({ events })
  }

  chainChanged(async (data) => {
    console.log(data)
    const chainId = await getChainId()
    console.log({ chainId })

    if (chainId !== 1337) {
      alert('incurrect chain')
    }
  })

  useEffect(() => {
    getMetamaskAccount().then((data) => {
      setAccounts(data)
      loadNFTs()
    })
  }, [])

  async function loadNFTs() {
    const marketContract = (await getEtherContract(PotatoMarket)) as unknown as PotatoMarketInstance
    const ntfContract = (await getEtherContract(NFT)) as unknown as NFTInstance
    const marketItems = await marketContract?.fetchMarketItems()

    const items = await Promise.all(
      marketItems?.map(async (i) => {
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

    setNfts(items)
  }

  async function buyNft(nft: INFTItem) {
    const marketContract = (await getEtherContract(PotatoMarket)) as unknown as PotatoMarketInstance
    // const ntfContract = (await getWeb3Contract(NFT)) as unknown as NFTInstance
    // const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    // const networkId = await getChainId()
    const transaction = await marketContract.createMarketSale(NFT.networks[1337].address, nft.itemId, {
      value: nft.price.toString()
    })
    await transaction.wait()
    loadNFTs()
  }

  return (
    <MoralisProvider
      serverUrl="https://jqffj1drjnzm.usemoralis.com:2053/server"
      appId="iABVUKAeoEkI52Lnjt1dZrIgHuvo62ZHKk9qNDds"
    >
      <ResponsiveAppBar accounts={accounts} loadNFTs={loadNFTs} />
      <Box p={4} display="flex">
        {nfts.map((e, i) => (
          <Box p={2} key={i}>
            <CardItem
              data={e}
              onClick={(e) => {
                // buyNft(nfts[0])
                adopt()
              }}
            />
          </Box>
        ))}
      </Box>
    </MoralisProvider>
  )
}

export default App
