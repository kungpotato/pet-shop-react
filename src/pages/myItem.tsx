import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { CardItem } from '../components/Card'
import { accountChanged, chainChanged } from '../libs/metamask'
import { getMetamaskAccount, useExpore } from '../states/expore/hook'

export const MyItem = (): JSX.Element => {
  const { mynfts, loadMyNFTs, clearMyNFTs } = useExpore()

  useEffect(() => {
    getMetamaskAccount().then((data) => {
      if (data[0]) {
        loadMyNFTs()
      }
    })
  }, [])

  accountChanged((ac) => {
    console.log(ac)
    loadMyNFTs()
  })

  chainChanged(async (id) => {
    if (id !== 1337) {
      console.log('incurrect chain')
      clearMyNFTs()
    } else {
      loadMyNFTs()
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
