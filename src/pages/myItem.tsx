import { useCallback, useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { CardItem } from '../components/Card'
import { accountChanged, chainChanged, getMetamaskAccount } from '../libs/metamask'
import { useAppDispatch, useAppSelector } from '../states/hooks'
import { loadMyNFTs } from '../services'
import { setMyNFTs } from '../states/expore/reducer'
import { useContractJson } from '../hooks/contracts'
import { useMoralis } from 'react-moralis'

export const MyItem = (): JSX.Element => {
  const { mynfts } = useAppSelector((state) => state.expore)
  const dispatch = useAppDispatch()
  const { potatoMarketContract, NFTContract } = useContractJson()
  const { authenticate, isAuthenticated } = useMoralis()

  const getNFTsData = useCallback(() => {
    if (potatoMarketContract && NFTContract) {
      loadMyNFTs(potatoMarketContract, NFTContract).then((data) => {
        dispatch(setMyNFTs(data))
      })
    }
  }, [potatoMarketContract, NFTContract])

  useEffect(() => {
    if (!isAuthenticated) {
      authenticate({ signingMessage: 'Log in using Moralis' }).then((val) => {
        getNFTsData()
      })
    }
  }, [getNFTsData, isAuthenticated])

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
