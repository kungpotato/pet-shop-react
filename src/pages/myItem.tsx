import { useEffect } from 'react'
import { Box } from '@mui/material'
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
    <Box p={4} display="flex">
      {mynfts.map((e, i) => (
        <Box p={2} key={i}>
          <CardItem data={e} isForSale={false} />
        </Box>
      ))}
    </Box>
  )
}
