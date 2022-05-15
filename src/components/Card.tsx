import { getEtherContract } from '../libs/ethereum'
import { PotatoMarketInstance } from '../../types/truffle-contracts'
import { ethers } from 'ethers'
import { INFTItem, setMyNFTs, setNFTs } from '../states/expore/reducer'
import { loadMyNFTs, loadNFTs } from '../services'
import { useAppDispatch } from '../states/hooks'
import { config } from '../config'
import { useContractJson } from '../hooks/contracts'
import { Button, Card, Icon, Rating } from 'semantic-ui-react'
import styled from '@emotion/styled'

const Image = styled.img`
display: block;
width: 100%;
height: 14em;
border-radius: inherit;
object-fit: cover;`

const Header = styled(Card.Header)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})

const Meta = styled(Card.Meta)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})

const Description = styled(Card.Description)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})

interface ICardItem {
  data: INFTItem
  isForSale?: boolean
}

export const CardItem = ({ data, isForSale = true }: ICardItem) => {
  const { image, price, description, name, owner } = data

  const dispatch = useAppDispatch()
  const { potatoMarketContract, NFTContract } = useContractJson()

  const handleClick = async () => {
    if (potatoMarketContract && NFTContract) {
      const marketContract = (await getEtherContract(
        potatoMarketContract,
        config.marketContractAddress
      )) as unknown as PotatoMarketInstance
      // const ntfContract = (await getEtherContract(NFT)) as unknown as NFTInstance
      const price = ethers.utils.formatUnits(data.price, 'wei')

      const createMarketSale = await marketContract.createMarketSale(config.nftContractAddress, data.itemId, {
        value: price.toString(),
        gasLimit: '6721975',
        gasPrice: '20000000000'
      })
      await (createMarketSale as any).wait()
      if (isForSale) {
        loadNFTs(potatoMarketContract, NFTContract).then((data) => {
          dispatch(setNFTs(data))
        })
        loadMyNFTs(potatoMarketContract, NFTContract).then((data) => {
          dispatch(setMyNFTs(data))
        })
      }
    }
  }



  return (
    <Card style={{ height: "23em", width: '100%' }}>
      <Image src={image} loading="lazy" />
      <Card.Content style={{ height: "1em" }}>
        <Header>{name}</Header>
        <Meta >
          {owner}
        </Meta>
        {/* <Description>
          {description}
        </Description> */}
        <p style={{ color: '#2185d0', textAlign: 'right' }}>
          <Icon name='ethereum' />
          {parseFloat(price).toFixed(2)}
        </p>
      </Card.Content>
      <Card.Content extra>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button color='green' basic size='mini' onClick={handleClick}>Buy now</Button>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#00000026', textAlign: 'right' }}>0</span>
            <Rating icon='heart' defaultRating={0} maxRating={1} />
          </div>
        </div>
      </Card.Content>
    </Card >
  )
}
