import { useCallback, useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { CardItem } from '../components/Card'
import { accountChanged, chainChanged, getMetamaskAccount } from '../libs/metamask'
import { useAppDispatch, useAppSelector } from '../states/hooks'
import { loadMyNFTs } from '../services'
import { setMyNFTs } from '../states/expore/reducer'
import { useContractJson } from '../hooks/contracts'

const MyItem: React.FC = () => {
  const { mynfts } = useAppSelector((state) => state.expore)
  const dispatch = useAppDispatch()
  const { potatoMarketContract, NFTContract } = useContractJson()

  const getNFTsData = useCallback(() => {
    if (potatoMarketContract && NFTContract) {
      loadMyNFTs(potatoMarketContract, NFTContract).then((data) => {
        dispatch(setMyNFTs(data))
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

  accountChanged((ac) => {
    getNFTsData()
  })

  chainChanged(async (id) => {
    if (id !== 1337) {
      console.log('incurrect chain')
      dispatch(setMyNFTs([]))
    } else {
      getNFTsData()
    }
  })

  return (
    <Box p={4} sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {mynfts.map((e, i) => (
          <Grid item lg={2} key={i}>
            <CardItem data={e} isForSale={false} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default MyItem
