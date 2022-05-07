import { Box, Grid } from '@mui/material'
import { useEffect } from 'react'
import { CardItem } from '../components/Card'
import { chainChanged, getMetamaskAccount } from '../libs/metamask'
import { loadNFTs } from '../services'
import { setNFTs } from '../states/expore/reducer'
import { useAppDispatch, useAppSelector } from '../states/hooks'

export const Expore = (): JSX.Element => {
  const { nfts } = useAppSelector((state) => state.expore)
  const dispatch = useAppDispatch()

  function getNFTsData() {
    loadNFTs().then((data) => {
      dispatch(setNFTs(data))
    })
  }

  useEffect(() => {
    getMetamaskAccount().then((accounts) => {
      if (accounts && accounts[0]) {
        getNFTsData()
      }
    })
  }, [])

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
