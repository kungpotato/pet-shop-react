import { Box, Grid } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { CardItem } from '../components/Card'
import { useContractJson } from '../hooks/contracts'
import { chainChanged, getMetamaskAccount } from '../libs/metamask'
import { loadNFTs } from '../services'
import { setNFTs } from '../states/expore/reducer'
import { useAppDispatch, useAppSelector } from '../states/hooks'

const Expore: React.FC = () => {
  const { nfts } = useAppSelector((state) => state.expore)
  const dispatch = useAppDispatch()
  const { potatoMarketContract, NFTContract } = useContractJson()

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

export default Expore