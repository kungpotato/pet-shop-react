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
import { create } from 'ipfs-http-client'
import { faker } from '@faker-js/faker'
import { useMoralis, useMoralisFile } from 'react-moralis'
import Moralis from 'moralis'
import { getWeb3Contract } from '../libs/web3'
import PotatoMarket from '../definition/PotatoMarket.json'
import NFT from '../definition/NFT.json'
import { PotatoMarketInstance, NFTInstance } from '../../types/truffle-contracts'

// const client = create({ host: 'localhost', port: 8080, protocol: 'http' })
interface IAppbar {
  accounts: string[]
}
interface IformInput {
  price: string
  name: string
  description: string
}

const pages = ['expole', 'my item']

const ResponsiveAppBar = ({ accounts }: IAppbar) => {
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis()

  const formInput: IformInput = {
    name: faker.company.companyName(),
    description: faker.commerce.productDescription(),
    price: '1'
  }
  const [fileTarget, setFileTarget] = useState()
  const { saveFile } = useMoralisFile()

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: 'Log in using Moralis' })
        .then(function (user) {
          console.log('logged in user:', user)
          console.log(user?.get('ethAddress'))
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
  // const formInput:IformInput = { name: faker.name.findName(), description: faker.commerce.productDescription(), price: '1' }
  // const fileUrl = 'https://f.ptcdn.info/597/057/000/p8r9139wrXaBEIVEurv-o.jpg'

  const createMarket = async () => {
    if (fileTarget) {
      saveFile((fileTarget as any).name, fileTarget, {
        type: 'base64',
        saveIPFS: true,
        onSuccess: async (result) => {
          const { name, description, price } = formInput
          const data = JSON.stringify({
            ...result.toJSON(),
            name,
            description
          })

          try {
            const obj = new Moralis.Object('potatoNFTMarket')
            obj.set('name', name)
            obj.set('data', data)
            await obj.save()
            console.log(data)

            /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
            if (result) {
              createSale(result.url())
            }
          } catch (error) {
            console.log('Error uploading file: ', error)
          }
        },
        onError: (error) => console.log(error)
      })
    }
  }

  const createSale = async (url: string) => {
    const marketContract = (await getWeb3Contract(PotatoMarket)) as unknown as PotatoMarketInstance
    const ntfContract = (await getWeb3Contract(NFT)) as unknown as NFTInstance

    let transaction = await ntfContract.methods.mintToken(url)

    const itemId = await (transaction as any).call()

    const price = ethers.utils.parseUnits(formInput.price, 'ether') as any

    /* then list the item for sale on the marketplace */

    let listingPrice = await marketContract.methods.getListingPrice()
    listingPrice = await (listingPrice as any).call()

    transaction = await marketContract.methods.makeMarketItem(NFT.networks[5777].address, itemId, price)

    transaction = await (transaction as any).send({ from: accounts[0] ?? '', value: listingPrice })
    await transaction.wait()
  }

  const fileInput = (e: any) => {
    setFileTarget(e.target.files[0])
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} sx={{ my: 2, color: 'white', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>
          <input type="file" onChange={fileInput} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={createMarket}>
              create
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }} onClick={login}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
