import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { CardItem } from '../components/Card'
import { accountChanged } from '../libs/metamask'
import { getMetamaskAccount, useExpore } from '../states/expore/hook'

export const MyItem = (): JSX.Element => {
  const { mynfts, loadMyNFTs } = useExpore()

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
