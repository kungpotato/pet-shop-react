import { Fragment, useCallback, useEffect, useState } from 'react'
import { Accordion, Button, Card, Divider, Feed, Grid, Icon, Input, Label, Menu, Segment, Sidebar } from 'semantic-ui-react'
import { CardItem } from '../components/Card'
import { useContractJson } from '../hooks/contracts'
import { useScreenSize } from '../hooks/screenSize'
import { chainChanged, getMetamaskAccount } from '../libs/metamask'
import { loadNFTs } from '../services'
import { setNFTs } from '../states/expore/reducer'
import { useAppDispatch, useAppSelector } from '../states/hooks'

const Expore: React.FC = () => {
  const { nfts } = useAppSelector((state) => state.expore)
  const dispatch = useAppDispatch()
  const { potatoMarketContract, NFTContract } = useContractJson()
  const screenWidth = useScreenSize({ maxWidth: 1500 })
  const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const [activeIndex, setActiveIndex] = useState<boolean>(true)



  const getNFTsData = useCallback(() => {
    if (potatoMarketContract && NFTContract) {
      loadNFTs(potatoMarketContract, NFTContract).then((data) => {
        dispatch(setNFTs(data))
      })
    }
  }, [potatoMarketContract, NFTContract])

  useEffect(() => {
    getMetamaskAccount().then((accounts) => {
      if (accounts && accounts[0]) {
        getNFTsData()
      }
    })
  }, [getNFTsData])

  chainChanged(async (id) => {
    if (id !== 1337) {
      console.log('incurrect chain')
      dispatch(setNFTs([]))
    } else {
      getNFTsData()
    }
  })

  const CustomGrid = Grid as any
  const CustomFeed = Feed as any

  const handleShowSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const expandCollection = () => {
    console.log('....')
    setActiveIndex(!activeIndex)
  }

  { console.log('////', activeIndex) }
  return (
    <Fragment>
      <Sidebar.Pushable style={{ height: 'calc(100vh - 108px)' }} >
        <Sidebar
          width={showSidebar && !screenWidth ? 'wide' : 'very thin'}
          style={{ borderRight: '0.4px solid #ffffff1a', background: '#1b1c1d' }}
          animation='push'
          direction='left'
          visible={true}
        >
          {!showSidebar || screenWidth ? <Menu inverted style={{ borderRadius: '0' }}>
            <Menu.Item onClick={handleShowSidebar} style={{ width: '100%', justifyContent: 'center', display: 'flex', borderBottom: '1px solid #ffffff1a', height: '52px' }}>
              <Icon name='filter' />
            </Menu.Item>
          </Menu>
            : <Menu inverted vertical size='massive' style={{ borderRadius: '0' }}>
              <Menu.Item
                name='inbox'
                // active={activeItem === 'inbox'}
                onClick={handleShowSidebar}
              >
                Filter
                <Icon name='angle left' />
              </Menu.Item>
              <Menu.Item
                name='inbox'
              // active={activeItem === 'inbox'}
              // onClick={this.handleItemClick}
              >
                <Menu.Header>Price</Menu.Header>
                <Menu.Menu>
                  <Menu.Item
                  >
                    <CustomGrid>
                      <Grid.Column mobile={7} style={{ paddingRight: '0' }}>
                        <Input fluid={true} labelPosition='left' type='text' placeholder='Min'>
                          <Label basic><Icon style={{ margin: 'auto' }} name='ethereum' /></Label>
                          <input />
                        </Input>
                      </Grid.Column>
                      <Grid.Column mobile={2}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                          to
                        </div>
                      </Grid.Column>
                      <Grid.Column mobile={7} style={{ paddingLeft: '0' }}>
                        <Input fluid={true} type='text' placeholder='Max'>
                          <input />
                        </Input>
                      </Grid.Column>
                      <Grid.Column mobile={16}>
                        <Button color='blue' style={{ marginLeft: 'auto', display: 'block' }}>Apply</Button>
                      </Grid.Column>
                    </CustomGrid>
                  </Menu.Item>
                </Menu.Menu>
              </Menu.Item>
              <Divider />
              <Accordion as={Menu} vertical inverted fluid={true}>
                <Menu.Item style={{ width: '100%' }}>
                  <Accordion.Title
                    style={{ marginBottom: '9px' }}
                    active={activeIndex}
                    index={0}
                    onClick={expandCollection}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h6 style={{ fontSize: '18px', margin: '0' }}>Collection</h6>
                      <Icon name='angle down' />
                    </div>
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex} content={
                    <Fragment>
                      <Card fluid style={{ background: 'var(--darg-bg)' }}>
                        <Card.Content style={{ padding: '6px 6px' }} >
                          <CustomFeed >
                            <Feed.Event >
                              <Feed.Label style={{ margin: "auto" }} image='https://ipfs.moralis.io:2053/ipfs/Qmedfv8e95sqnNQ2Ks7w9pQUja2JCiuJqpxp8tFRXwbfjz' />
                              <Feed.Content style={{ lineHeight: '1.8em' }} >
                                <Feed.Summary style={{ color: "#fff" }}>
                                  Takashiro
                                  <Icon name='check circle' color='blue' />
                                </Feed.Summary>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Feed.Date style={{ color: "#ffffffb3" }} content='1 day ago' />
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon name='ethereum' size='small' />
                                    <Feed.Date style={{ color: "#21ba45", height: '100%' }} content='2.00' />
                                  </div>
                                </div>
                              </Feed.Content>
                            </Feed.Event>
                          </CustomFeed>
                        </Card.Content>
                      </Card>
                      <Card fluid style={{ background: 'var(--darg-bg)' }}>
                        <Card.Content style={{ padding: '6px 6px' }} >
                          <CustomFeed >
                            <Feed.Event >
                              <Feed.Label style={{ margin: "auto" }} image='https://ipfs.moralis.io:2053/ipfs/Qmedfv8e95sqnNQ2Ks7w9pQUja2JCiuJqpxp8tFRXwbfjz' />
                              <Feed.Content style={{ lineHeight: '1.8em' }} >
                                <Feed.Summary style={{ color: "#fff" }}>
                                  Takashiro
                                  <Icon name='check circle' color='blue' />
                                </Feed.Summary>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Feed.Date style={{ color: "#ffffffb3" }} content='1 day ago' />
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon name='ethereum' size='small' />
                                    <Feed.Date style={{ color: "#21ba45", height: '100%' }} content='2.00' />
                                  </div>
                                </div>
                              </Feed.Content>
                            </Feed.Event>
                          </CustomFeed>
                        </Card.Content>
                      </Card>
                      <Card fluid style={{ background: 'var(--darg-bg)' }}>
                        <Card.Content style={{ padding: '6px 6px' }} >
                          <CustomFeed >
                            <Feed.Event >
                              <Feed.Label style={{ margin: "auto" }} image='https://ipfs.moralis.io:2053/ipfs/Qmedfv8e95sqnNQ2Ks7w9pQUja2JCiuJqpxp8tFRXwbfjz' />
                              <Feed.Content style={{ lineHeight: '1.8em' }} >
                                <Feed.Summary style={{ color: "#fff" }}>
                                  Takashiro
                                  <Icon name='check circle' color='blue' />
                                </Feed.Summary>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Feed.Date style={{ color: "#ffffffb3" }} content='1 day ago' />
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon name='ethereum' size='small' />
                                    <Feed.Date style={{ color: "#21ba45", height: '100%' }} content='2.00' />
                                  </div>
                                </div>
                              </Feed.Content>
                            </Feed.Event>
                          </CustomFeed>
                        </Card.Content>
                      </Card>
                    </Fragment>
                  } />
                </Menu.Item>
              </Accordion>
            </Menu>}

        </Sidebar>
        <Sidebar.Pusher>
          <Fragment>
            <Menu pointing inverted secondary size='massive' style={{ borderBottom: '1px solid #ffffff1a', borderRadius: '0' }}>
              <Menu.Item
                style={{ borderRadius: '0', }}
                active={true}
              >
                Items
              </Menu.Item>
              <Menu.Item
                style={{ borderRadius: '0', height: '52px' }}
                active={false}
              >
                Activity
              </Menu.Item>
            </Menu>
            <div style={{ padding: '8px' }}>
              <CustomGrid style={{ width: showSidebar && !screenWidth ? 'calc(100vw - 350px)' : 'calc(100vw - 60px)' }}>
                {nfts.map((e, i) => (
                  <Grid.Column mobile={8} tablet={5} largeScreen={4} computer={2}>
                    <CardItem data={e} />
                  </Grid.Column>
                ))}
              </CustomGrid>
            </div>
          </Fragment>
        </Sidebar.Pusher>
      </Sidebar.Pushable >
    </Fragment >
  )
}

export default Expore