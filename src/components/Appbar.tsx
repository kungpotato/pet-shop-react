import { Fragment, useEffect, useState } from 'react'
// import AppBar from '@mui/material/AppBar'
// import Box from '@mui/material/Box'
// import Toolbar from '@mui/material/Toolbar'
// import IconButton from '@mui/material/IconButton'
// import Typography from '@mui/material/Typography'
// import Container from '@mui/material/Container'
// import Avatar from '@mui/material/Avatar'
// import Tooltip from '@mui/material/Tooltip'
import { faker } from '@faker-js/faker'
import { useMoralis, useMoralisFile } from 'react-moralis'
import { Button, Card, Container, Dimmer, Divider, Dropdown, Feed, Grid, Header, Icon, Image, Input, Label, Modal, Popup, Segment, Sidebar } from 'semantic-ui-react'

import { PotatoMarketInstance, NFTInstance } from '../../types/truffle-contracts'
import { getEtherContract } from '../libs/ethereum'
import { useNavigate, useParams } from 'react-router-dom'
import { routes } from '../routes'
import { useAppDispatch } from '../states/hooks'
import { setNFTs } from '../states/expore/reducer'
import { loadNFTs } from '../services'
import { config } from '../config'
import { useContractJson } from '../hooks/contracts'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useScreenSize } from '../hooks/screenSize'
import { Menu } from '../@potato/uikit'

// const client = create({ host: 'localhost', port: 8080, protocol: 'http' })


export const MyAppBar = ({ changeTheme, theme }: { changeTheme: any, theme: any }) => {
  const history = useNavigate()
  const path = useLocation()
  const screenWidth = useScreenSize({ maxWidth: 1000 })
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis()
  console.log('app bar', theme)


  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      setWalletName(user && user.id ? user.id : '')
    }
  }, [isAuthenticated, user])

  const setTheme = (theme: any) => {
    changeTheme(theme)
  }

  const [walletName, setWalletName] = useState('')

  const [visible, setVisible] = useState<boolean>(false)

  const [open, setOpen] = useState<boolean>(false)
  const [openProfile, setOpenProfile] = useState<boolean>(false)








  const HomeButton = (path: string) => {
    history(path)
  }

  const openConnectWalletModal = () => {
    if (walletName.length === 0) {
      setOpen(!open)
    }
  }

  const connectWallet = () => {
    if (!isAuthenticated) {
      authenticate({ signingMessage: 'Log in using Moralis' })
        .then(function (user) {
          if (user) {
            const address = user.get('ethAddress')
            setWalletName(address && address.id ? address.id : '')
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

  const showProfile = () => {
    setOpenProfile(!openProfile)
  }

  const logoutWeb = () => {
    logout().then((res) => {
      showProfile()
      setWalletName('')
    }).catch((err) => console.log(err))
  }

  return (
    <Fragment>
      <Menu inverted={theme === 'dark'} size='huge' secondary pointing>
        <Container fluid={true} >
          <Menu.Item >
            <img style={{ marginRight: '8px' }} alt="logo" src='/images/potato.gif' />
            Potato NFT
          </Menu.Item>
          {screenWidth && <Menu.Item position='right'>
            <Button inverted icon='sidebar' onClick={showSidebarWallet} />
          </Menu.Item>}
          {!screenWidth && <Fragment>
            <Menu.Item style={{ height: '100%', width: '40%' }}>
              <Input inverted fluid style={{ color: '#000' }} icon='search' placeholder='Search items, collections, and accounts' />
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item style={{ height: '100%' }}
                name='Expore'
                onClick={() => HomeButton('/expore')}
                active={path.pathname === '/expore'}
              />
              {walletName.length !== 0 && <Menu.Item style={{ height: '100%' }}
                name='Create'
                onClick={() => HomeButton('/create')}
                active={path.pathname === '/create'}
              />}
              {theme === 'light' && <Menu.Item as='a' style={{ height: '100%' }} onClick={() => setTheme('dark')}>
                <Icon name='moon' />
              </Menu.Item>}
              {theme === 'dark' && <Menu.Item as='a' style={{ height: '100%' }} onClick={() => setTheme('light')}>
                <Icon name='sun outline' />
              </Menu.Item>}
              {walletName.length === 0 && <Menu.Item as='a'>
                <Button style={{ display: "flex", alignItems: "center", background: 'var(--main-gradient)', color: '#fff' }} onClick={openConnectWalletModal}>
                  {walletName && walletName.length > 0 && <Icon name='ethereum' />}
                  {walletName && walletName.length > 0 ? addressSec(walletName) : 'Connect Wallet'}
                </Button>
              </Menu.Item>}
              <Menu.Item as='a' onClick={showProfile}>
                {walletName && walletName.length > 0 &&
                  <div style={{ borderRadius: '50%', border: '1px solid #ffffff38', width: '45px' }}>
                    <CustomImage size='mini' style={{ background: 'var(--main-gradient)', color: '#fff', width: '45px' }} circular avatar spaced='right' src={`/images/potato.gif`} />
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
          </Fragment>}
        </Container>
      </Menu>
      {theme === 'dark' && <Divider inverted={theme === 'dark'} style={{ marginBottom: "0" }} />}
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


      {/* profile */}
      <Modal
        style={{ background: 'var(--darg-bg)' }}
        centered={false}
        size='mini'
        dimmer='blurring'
        open={openProfile}
        onClose={showProfile}
      >
        <Modal.Header style={{ background: 'var(--darg-bg)', borderColor: '#ffffff38' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ borderRadius: '50%', border: '1px solid #ffffff38', width: '45px' }}>
              <CustomImage size='mini' style={{ background: 'var(--main-gradient)', color: '#fff', width: '45px' }} circular avatar spaced='right' src={`https://robohash.org/${walletName}.jpeg?set=set1&size=150x150`} />
            </div>
            <span style={{ marginLeft: '8px', color: '#fff' }}>
              {addressSec(walletName)}
            </span>
          </div>
        </Modal.Header>
        <Modal.Content style={{ padding: '0', background: 'var(--darg-bg)' }}>
          <Menu vertical compact fluid={true} inverted >
            <Menu.Item
              onClick={() => false}
              name='Profile'
            />
            <Menu.Item
              onClick={() => {
                HomeButton('/myitem')
                showProfile()
              }}
              name='My Items'
            />
            <Menu.Item
              onClick={() => false}
              name='Activity'
            />
            <Menu.Item
              onClick={() => false}
              name='My Collection'
            />
          </Menu>
        </Modal.Content>
        <Modal.Actions style={{ background: 'var(--darg-bg)' }}>
          <Button fluid={true} style={{ margin: '0' }} onClick={logoutWeb}>
            Disconnect
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  )
}
