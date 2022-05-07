import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Button, Stack } from '@mui/material'
import { ShoppingCart } from '@mui/icons-material'
import { getEtherContract } from '../libs/ethereum'
import NFT from '../definition/NFT.json'
import PotatoMarket from '../definition/PotatoMarket.json'
import { PotatoMarketInstance } from '../../types/truffle-contracts'
import { ethers } from 'ethers'
import { INFTItem, setMyNFTs, setNFTs } from '../states/expore/reducer'
import { loadMyNFTs, loadNFTs } from '../services'
import { useAppDispatch } from '../states/hooks'

interface ICardItem {
  data: INFTItem
  isForSale?: boolean
}

export const CardItem = ({ data, isForSale = true }: ICardItem) => {
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    const marketContract = (await getEtherContract(PotatoMarket)) as unknown as PotatoMarketInstance
    // const ntfContract = (await getEtherContract(NFT)) as unknown as NFTInstance
    const price = ethers.utils.formatUnits(data.price, 'wei')

    const createMarketSale = await marketContract.createMarketSale(NFT.networks[1337].address, data.itemId, {
      value: price.toString(),
      gasLimit: '6721975',
      gasPrice: '20000000000'
    })
    await (createMarketSale as any).wait()
    if (isForSale) {
      loadNFTs().then((data) => {
        dispatch(setNFTs(data))
      })
      loadMyNFTs().then((data) => {
        dispatch(setMyNFTs(data))
      })
    }
  }

  return (
    <Card sx={{ maxWidth: 250 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            K
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data.name}
      />
      <CardMedia component="img" height="150" image={data.image} />
      <CardContent>
        {isForSale && <Box>{`${ethers.utils.formatUnits(data.price, 'ether')} PTT`}</Box>}
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {isForSale && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" endIcon={<ShoppingCart />} onClick={handleClick}>
              Buy
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  )
}
