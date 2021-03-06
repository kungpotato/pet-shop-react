import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { ethers } from 'ethers'
import { faker } from '@faker-js/faker'
import { useMoralis, useMoralisFile } from 'react-moralis'
import Moralis from 'moralis'

import { PotatoMarketInstance, NFTInstance } from '../../types/truffle-contracts'
import { getEtherContract } from '../libs/ethereum'
import { Link } from 'react-router-dom'
import { routes } from '../routes'
import { useAppDispatch } from '../states/hooks'
import { setNFTs } from '../states/expore/reducer'
import { loadNFTs } from '../services'
import { config } from '../config'
import { useContractJson } from '../hooks/contracts'

// const client = create({ host: 'localhost', port: 8080, protocol: 'http' })
interface IformInput {
  price: string
  name: string
  description: string
}

export const MyAppBar = () => {
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis()
  const dispatch = useAppDispatch()
  const { NFTContract, potatoMarketContract } = useContractJson()

  const formInput: IformInput = {
    name: faker.company.companyName(),
    description: faker.commerce.productDescription(),
    price: '2'
  }
  const [fileTarget, setFileTarget] = useState()
  const { saveFile } = useMoralisFile()

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
        const value = event.args[2]
        const itemId = value.toNumber()

        const data = JSON.stringify({
          url: url,
          name,
          description
        })

        const obj = new Moralis.Object('potatoNFTMarket')
        obj.set('itemId', itemId)
        obj.set('data', data)
        await obj.save()

        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        console.log({ price })

        /* then list the item for sale on the marketplace */

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

        loadNFTs(potatoMarketContract, NFTContract).then((data) => {
          dispatch(setNFTs(data))
        })

        setFileTarget(undefined)
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const fileInput = (e: any) => {
    setFileTarget(e.target.files[0])
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            Potato NFT Market
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {routes.map((page) => (
              <Link to={`/${page.path}`} key={page.title}>
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>{page.title}</Button>
              </Link>
            ))}
          </Box>
          <input type="file" onChange={fileInput} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ my: 2, color: 'white', display: 'block' }}
              onClick={createMarket}
            >
              listing
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                sx={{ p: 0 }}
                onClick={() => {
                  console.log('process.env.NODE_ENV==>', process.env.NODE_ENV)

                  if (!isAuthenticated) {
                    authenticate({ signingMessage: 'Log in using Moralis' })
                      .then(function (user) {
                        console.log('logged in user:', user)
                        console.log(user?.get('ethAddress'))
                      })
                      .catch(function (error) {
                        console.log(error)
                      })
                  }
                }}
              >
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
