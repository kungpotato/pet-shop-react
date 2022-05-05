import { Box, Grid } from '@mui/material'
import { useEffect } from 'react'
import { CardItem } from '../components/Card'
import { chainChanged } from '../libs/metamask'
import { getMetamaskAccount, useExpore } from '../states/expore/hook'

export const Expore = (): JSX.Element => {
  const { nfts, loadNFTs, clearNFTs } = useExpore()

  useEffect(() => {
    getMetamaskAccount().then((data) => {
      if (data[0]) {
        loadNFTs()
      }
    })
  }, [])

  chainChanged(async (id) => {
    if (id !== 1337) {
      console.log('incurrect chain')
      clearNFTs()
    } else {
      loadNFTs()
    }
  })

  return (
    <Box p={4} sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {nfts.map((e, i) => (
          <Grid item xs={3} key={i}>
            <CardItem data={e} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
