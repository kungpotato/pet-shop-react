import { Fragment, useEffect, useState } from 'react'
// import AppBar from '@mui/material/AppBar'
// import Box from '@mui/material/Box'
// import Toolbar from '@mui/material/Toolbar'
// import IconButton from '@mui/material/IconButton'
// import Typography from '@mui/material/Typography'
// import Container from '@mui/material/Container'
// import Avatar from '@mui/material/Avatar'
// import Tooltip from '@mui/material/Tooltip'
import { ethers } from 'ethers'
import { faker } from '@faker-js/faker'
import { useMoralis, useMoralisFile } from 'react-moralis'
import Moralis from 'moralis'
import { Button, Card, Container, Dimmer, Divider, Feed, Grid, Header, Icon, Image, Input, Label, Menu, Modal, Popup, Segment, Sidebar } from 'semantic-ui-react'

import { PotatoMarketInstance, NFTInstance } from '../../types/truffle-contracts'
import { getEtherContract } from '../libs/ethereum'
import { useNavigate } from 'react-router-dom'
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
  const history = useNavigate()

  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis()
  const dispatch = useAppDispatch()
  const { NFTContract, potatoMarketContract } = useContractJson()

  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      setWalletName(user.id)
    }
  }, [isAuthenticated, user])

  const formInput: IformInput = {
    name: faker.company.companyName(),
    description: faker.commerce.productDescription(),
    price: '2'
  }
  const [fileTarget, setFileTarget] = useState()
  const [walletName, setWalletName] = useState('')

  const [visible, setVisible] = useState(false)

  const [open, setOpen] = useState(false)
  const { saveFile } = useMoralisFile()

  const createMarket = async () => {
    console.log('>>>', fileTarget)
    if (fileTarget) {
      saveFile((fileTarget as any).name, fileTarget, {
        type: 'base64',
        saveIPFS: true,
        onSuccess: async (result) => {
          console.log('result', result)
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
    console.log('url', url)
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

  const HomeButton = (path: string) => {
    history(path)
  }

  const openConnectWalletModal = () => {
    if (walletName.length === 0) {
      setOpen(!open)
    }
  }

  const connectWallet = () => {
    console.log('>>>', isAuthenticated)
    if (!isAuthenticated) {
      authenticate({ signingMessage: 'Log in using Moralis' })
        .then(function (user) {
          if (user) {
            console.log('logged in user:', user)
            const address = user.get('ethAddress')
            setWalletName(address.id)
            console.log(user?.get('ethAddress'))
            setOpen(false)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  const CustomGrid = Grid as any

  const CustomImage = Image as any

  const addressSec = (address: string) => {
    const first = address.slice(0, 2)
    const sec = address.slice(address.length - 4)
    return first + '...' + sec
  }

  const showSidebarWallet = () => {
    setVisible(!visible)
  }

  return (
    <Fragment>
      {/* <Dimmer.Dimmable as={Segment} blurring dimmed={visible}>
        <Dimmer visible={visible} onClickOutside={() => setVisible(false)} />

      </Dimmer.Dimmable> */}
      <Menu inverted={true} size='huge' secondary pointing>
        <Container fluid={true} >
          <Menu.Item >
            <img style={{ marginRight: '8px' }} alt="logo" src='/images/potato.gif' />
            Potato NFT
          </Menu.Item>
          <Menu.Item style={{ height: '100%' }}>
            <Input style={{ color: '#000' }} icon='search' placeholder='Search' />
          </Menu.Item>
          <Menu.Menu position='right'>
            {
              routes.map((page, i) => (
                <Menu.Item style={{ height: '100%' }}
                  name={page.title}
                  onClick={() => HomeButton(page.path)}
                  active={i === 0}
                />
              ))
            }
            <Menu.Item as='a' style={{ height: '100%' }}>
              <Popup style={{ background: 'var(--main-background)' }} basic content='Dark Mode' trigger={<Icon name='sun outline' />} />
            </Menu.Item>

            {walletName.length === 0 && <Menu.Item as='a'>
              {/* {addressSec(walletName)} */}
              <Button style={{ display: "flex", alignItems: "center", background: 'var(--main-gradient)', color: '#fff' }} onClick={openConnectWalletModal}>
                {walletName && walletName.length > 0 && <Icon name='ethereum' />}
                {walletName && walletName.length > 0 ? addressSec(walletName) : 'Connect Wallet'}
              </Button>
            </Menu.Item>}
            <Menu.Item as='a'>
              {walletName && walletName.length > 0 &&
                <div style={{ borderRadius: '50%', border: '1px solid #ffffff38', width: '45px' }}>
                  <CustomImage size='mini' style={{ background: 'var(--main-gradient)', color: '#fff', width: '45px' }} circular avatar spaced='right' src={`https://robohash.org/${walletName}.jpeg?set=set1&size=150x150`} />
                </div>
              }
            </Menu.Item>
            <Menu.Item as='a' style={{ height: '100%' }} onClick={showSidebarWallet}>
              {walletName && walletName.length > 0 &&
                <div style={{ width: '32px' }}>
                  <CustomImage size='mini' style={{ width: '32px' }} spaced='right' src='/images/wallet.webp' />
                </div>
              }
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
      <Divider inverted />
      <input type="file" onChange={fileInput} />

      <Button
        variant="outlined"
        sx={{ my: 2, color: 'white', display: 'block' }}
        onClick={createMarket}
      >
        listing
      </Button>

      <Sidebar
        as={Menu}
        animation='overlay'
        direction='right'

        icon='labeled'
        inverted
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width='thin'
      >
        <Menu.Item as='a'>
          <Icon name='home' />
          Home
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='gamepad' />
          Games
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
        </Menu.Item>
      </Sidebar>




      <Modal
        basic
        dimmer='blurring'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Content>
          <Card centered={true} style={{ boxShadow: 'none', background: "#0000" }} >
            <Card.Content style={{ background: 'var(--main-gradient)' }}>
              <Card.Header style={{ color: '#fff' }}>Connect Wallet</Card.Header>
            </Card.Content>
            <Card.Content style={{ background: '#383241' }}>
              <CustomGrid >
                <Grid.Row columns={2} style={{ paddingBottom: '0' }}>
                  <Grid.Column style={{ textAlign: 'center' }}>
                    <Button icon style={{ width: "85px", height: '85px', background: "#0000" }} onClick={connectWallet}>
                      <div style={{ display: "block" }}>
                        <img style={{ display: "block", margin: 'auto', marginBottom: '8px' }} src="/images/wallert_metamask.webp" alt="" />
                        Metamask
                      </div>
                    </Button>
                  </Grid.Column>
                  <Grid.Column style={{ textAlign: 'center' }}>
                    <Button icon style={{ width: "85px", height: '85px', background: "#0000" }}>
                      <div style={{ display: "block" }}>
                        <img style={{ display: "block", margin: 'auto', marginBottom: '8px' }} src="/images/binance_wallet.webp" alt="" />
                        Binance
                      </div>
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column style={{ textAlign: 'center' }}>
                    <Button icon style={{ width: "85px", height: '85px', background: "#0000" }}>
                      <div style={{ display: "block" }}>
                        <img style={{ display: "block", margin: 'auto', marginBottom: '8px' }} src="/images/wallet_connect.webp" alt="" />
                        Wallet
                      </div>
                    </Button>
                  </Grid.Column>
                </Grid.Row>

              </CustomGrid>
            </Card.Content>
          </Card>
        </Modal.Content>
        {/* <Modal.Actions>
          <Button basic color='red' inverted onClick={() => setOpen(false)}>
            <Icon name='remove' /> No
          </Button>
          <Button color='green' inverted onClick={() => setOpen(false)}>
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions> */}
      </Modal>
    </Fragment>
    // <AppBar position="static">
    //   <Container maxWidth="xl">
    //     <Toolbar disableGutters>
    //       <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
    //         Potato NFT Market
    //       </Typography>

    //       <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
    //           {
    //   routes.map((page) => (
    //     <Link to={`/${page.path}`} key={page.title}>
    //       <Button sx={{ my: 2, color: 'white', display: 'block' }}>{page.title}</Button>
    //     </Link>
    //   ))
    // }
    //       </Box>
    //       <input type="file" onChange={fileInput} />
    //       <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
    //         {/* <Button
    //           variant="outlined"
    //           color="secondary"
    //           sx={{ my: 2, color: 'white', display: 'block' }}
    //           onClick={createMarket}
    //         >
    //           listing
    //         </Button> */}
    //       </Box>

    //       <Box sx={{ flexGrow: 0 }}>
    //         <Tooltip title="Open settings">
    //           <IconButton
    //             sx={{ p: 0 }}
    //             onClick={() => {
    //               console.log('process.env.NODE_ENV==>', process.env.NODE_ENV)

    //               if (!isAuthenticated) {
    //                 authenticate({ signingMessage: 'Log in using Moralis' })
    //                   .then(function (user) {
    //                     console.log('logged in user:', user)
    //                     console.log(user?.get('ethAddress'))
    //                   })
    //                   .catch(function (error) {
    //                     console.log(error)
    //                   })
    //               }
    //             }}
    //           >
    //             <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
    //           </IconButton>
    //         </Tooltip>
    //       </Box>
    //     </Toolbar>
    //   </Container>
    // </AppBar>
  )
}
