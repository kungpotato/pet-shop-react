import { Fragment, useCallback, useEffect, useState } from 'react'
import { Button, Divider, Grid, Icon, Input, Label, Menu, Segment, Sidebar } from 'semantic-ui-react'
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

  const getNFTsData = useCallback(() => {
    if (potatoMarketContract && NFTContract) {
      loadNFTs(potatoMarketContract, NFTContract).then((data) => {
        dispatch(setNFTs(data))
      })
    }
  }, [potatoMarketContract, NFTContract])

  useEffect(() => {
    getNFTsData()
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

  const handleShowSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <Fragment>
      <Sidebar.Pushable style={{ height: 'calc(100vh - 108px)' }}>
        <Sidebar
          width={showSidebar && !screenWidth ? 'wide' : 'very thin'}
          style={{ borderRight: '0.4px solid #ffffff1a', background: '#1b1c1d' }}
          animation="push"
          direction="left"
          visible={true}
        >
          {!showSidebar || screenWidth ? (
            <Menu inverted style={{ borderRadius: '0' }}>
              <Menu.Item
                onClick={handleShowSidebar}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                  borderBottom: '1px solid #ffffff1a',
                  height: '52px'
                }}
              >
                <Icon name="filter" />
              </Menu.Item>
            </Menu>
          ) : (
            <Menu inverted vertical size="massive" style={{ borderRadius: '0' }}>
              <Menu.Item
                name="inbox"
                // active={activeItem === 'inbox'}
                onClick={handleShowSidebar}
              >
                Filter
                <Icon name="angle left" />
              </Menu.Item>
              <Menu.Item>
                <Input icon="search" placeholder="Search..." />
              </Menu.Item>
              <Menu.Item
                name="inbox"
                // active={activeItem === 'inbox'}
                // onClick={this.handleItemClick}
              >
                <Label color="teal">1</Label>
                Inbox
              </Menu.Item>

              <Menu.Item
                name="spam"
                // active={activeItem === 'spam'}
                // onClick={this.handleItemClick}
              >
                <Label>51</Label>
                Spam
              </Menu.Item>

              <Menu.Item
                name="updates"
                // active={activeItem === 'updates'}
                // onClick={this.handleItemClick}
              >
                <Label>1</Label>
                Updates
              </Menu.Item>
            </Menu>
          )}
        </Sidebar>
        <Sidebar.Pusher>
          <Menu
            pointing
            inverted
            secondary
            size="massive"
            style={{ borderBottom: '1px solid #ffffff1a', borderRadius: '0' }}
          >
            <Menu.Item style={{ borderRadius: '0' }} active={true}>
              Items
            </Menu.Item>
            <Menu.Item style={{ borderRadius: '0', height: '52px' }} active={false}>
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
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Fragment>
  )
}

export default Expore
