import faker from '@faker-js/faker'
import react, { useState } from 'react'
import { useMoralis, useMoralisFile } from 'react-moralis'
import { Button } from 'semantic-ui-react'
import { NFTInstance, PotatoMarketInstance } from '../../types/truffle-contracts'
import { config } from '../config'
import { useContractJson } from '../hooks/contracts'
import { getEtherContract } from '../libs/ethereum'
import Moralis from 'moralis'
import { ethers } from 'ethers'
import { loadNFTs } from '../services'
import { useAppDispatch } from '../states/hooks'
import { setNFTs } from '../states/expore/reducer'

interface IformInput {
  price: string
  name: string
  description: string
}

export const Create = (): JSX.Element => {
  const { saveFile } = useMoralisFile()
  const { isAuthenticated } = useMoralis()
  const dispatch = useAppDispatch()
  const { NFTContract, potatoMarketContract } = useContractJson()

  const formInput: IformInput = {
    name: faker.company.companyName(),
    description: faker.commerce.productDescription(),
    price: '2'
  }

  const [fileTarget, setFileTarget] = useState()

  const fileInput = (e: any) => {
    setFileTarget(e.target.files[0])
  }

  const createMarket = async () => {
    if (fileTarget) {
      saveFile((fileTarget as any).name, fileTarget, {
        type: 'base64',
        saveIPFS: true,
        onSuccess: async (result) => {
          const url = (result as any).ipfs()

          if (result) {
            createSale(url)
          }
        },
        onError: (error) => console.log(error)
      })
    }
  }

  const createSale = async (url: string) => {
    try {
      const { name, description } = formInput

      if (potatoMarketContract && NFTContract) {
        const marketContract = (await getEtherContract(
          potatoMarketContract,
          config.marketContractAddress
        )) as unknown as PotatoMarketInstance
        const ntfContract = (await getEtherContract(NFTContract, config.nftContractAddress)) as unknown as NFTInstance

        const mintToken = await ntfContract.mintToken(url)
        const tx = await (mintToken as any).wait()

        const event = tx.events[0]
        console.log(tx)

        const value = event.args[2]
        const itemId = value.toNumber()

        const data = JSON.stringify({
          url: url,
          name,
          description,
          itemId,
          price: formInput.price,
          seller: tx.to,
          owner: tx.from
        })

        const obj = new Moralis.Object(config.dbName)
        obj.set('itemId', itemId)
        obj.set('data', data)
        await obj.save()

        /* then list the item for sale on the marketplace */
        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        const listingPrice = await marketContract?.getListingPrice()

        const makeMarketItem = await marketContract?.makeMarketItem(
          config.nftContractAddress,
          itemId,
          price.toString(),
          {
            value: listingPrice.toString()
          }
        )

        await (makeMarketItem as any).wait()

        loadNFTs(potatoMarketContract, NFTContract, isAuthenticated).then((data) => {
          dispatch(setNFTs(data))
        })

        setFileTarget(undefined)
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  return (
    <div>
      <input type="file" onChange={fileInput} />

      <Button variant="outlined" sx={{ my: 2, color: 'white', display: 'block' }} onClick={createMarket}>
        listing
      </Button>
    </div>
  )
}
