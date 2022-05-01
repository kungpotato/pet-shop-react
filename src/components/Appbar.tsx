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

// const client = create({ host: 'localhost', port: 8080, protocol: 'http' })

interface IformInput {
  price: string
  name: string
  description: string
}

const pages = ['expole', 'my item']

const ResponsiveAppBar = () => {
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
            // createSale(result.url)
          } catch (error) {
            console.log('Error uploading file: ', error)
          }
        },
        onError: (error) => console.log(error)
      })
    }

    //   const { name, description, price } = formInput
    //   if (!name || !description || !price || !fileUrl) return
    //   /* first, upload to IPFS */
    //   const data = JSON.stringify({
    //     name,
    //     description,
    //     image: fileUrl
    //   })
    //   console.log({data})

    //   try {
    //     const added = await client.add(data)
    //     const url = `https://ipfs.infura.io/ipfs/${added.path}`
    //     console.log({url})

    //     /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
    //     // createSale(url)
    //   } catch (error) {
    //     console.log('Error uploading file: ', error)
    //   }
  }

  // async function createSale(url: string) {
  //   let transaction = await contract.createToken(url)
  //   let tx = await transaction.wait()
  //   let event = tx.events[0]
  //   let value = event.args[2]
  //   let tokenId = value.toNumber()

  //   const price = ethers.utils.parseUnits(formInput.price, 'ether')

  //   /* then list the item for sale on the marketplace */
  //   contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
  //   let listingPrice = await contract.getListingPrice()
  //   listingPrice = listingPrice.toString()

  //   transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
  //   await transaction.wait()
  // }

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
