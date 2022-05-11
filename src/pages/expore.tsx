import { Box, Grid } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { CardItem } from '../components/Card'
import { useContractJson } from '../hooks/contracts'
import { chainChanged, getMetamaskAccount } from '../libs/metamask'
import { loadNFTs } from '../services'
import { setNFTs } from '../states/expore/reducer'
import { useAppDispatch, useAppSelector } from '../states/hooks'

export const Expore = (): JSX.Element => {
  const { nfts } = useAppSelector((state) => state.expore)
  const dispatch = useAppDispatch()
  const { potatoMarketContract, NFTContract } = useContractJson()
  const { authenticate, isAuthenticated } = useMoralis()

  const getNFTsData = useCallback(() => {
    if (potatoMarketContract && NFTContract) {
      loadNFTs(potatoMarketContract, NFTContract).then((data) => {
        dispatch(setNFTs(data))
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

  chainChanged(async (id) => {
    if (id !== 1337) {
      console.log('incurrect chain')
      dispatch(setNFTs([]))
    } else {
      getNFTsData()
    }
  })

  return (
    <Box p={4} sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {nfts.map((e, i) => (
          <Grid item lg={2} key={i}>
            <CardItem data={e} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
