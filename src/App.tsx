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

interface INFTItem {
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
    const accounts = await getMetamaskAccount()
    // const contract = await getEtherContract(Adoption)
    const contract = (await getWeb3Contract(Adoption)) as unknown as AdoptionInstance
    let adopt = await contract?.methods.adopt(count.toString())
    adopt = await adopt.send({ from: accounts[0], gas: 5000000, gasLimit: 21000, gasPrice: 21000 })

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
    const marketContract = (await getWeb3Contract(PotatoMarket)) as unknown as PotatoMarketInstance
    const ntfContract = (await getWeb3Contract(NFT)) as unknown as NFTInstance
    let marketItems = await marketContract.methods.fetchMarketItems()
    marketItems = await (marketItems as any).call()

    const items = await Promise.all(
      marketItems.map(async (i) => {
        const tokenUri = await ntfContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        // const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const item = {
          price: i.price.toString(),
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        }
        return item
      })
    )
    console.log({ items })

    setNfts(items)
  }

  async function buyNft(nft: INFTItem) {
    const marketContract = (await getWeb3Contract(PotatoMarket)) as unknown as PotatoMarketInstance
    // const ntfContract = (await getWeb3Contract(NFT)) as unknown as NFTInstance
    // const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    // const networkId = await getChainId()
    let transaction = await marketContract.methods.createMarketSale(NFT.networks[1337].address, nft.itemId)
    transaction = await transaction.send({ from: accounts[0], value: nft.price.toString() })
    await transaction.wait()
    loadNFTs()
  }

  return (
    <MoralisProvider
      serverUrl="https://jqffj1drjnzm.usemoralis.com:2053/server"
      appId="iABVUKAeoEkI52Lnjt1dZrIgHuvo62ZHKk9qNDds"
    >
      <ResponsiveAppBar accounts={accounts} />
      <Box p={4} display="flex">
        <Box p={2}>
          <CardItem
            onClick={(e) => {
              // buyNft(nfts[0])
              adopt()
            }}
          />
        </Box>
      </Box>
    </MoralisProvider>
  )
}

export default App
