import { Box } from '@mui/material'
import { INFTItem } from '../App'
import { CardItem } from '../components/Card'

export interface IExpore {
  nfts: INFTItem[]
  loadNFTs: () => Promise<void>
}

export const Expore = ({ nfts, loadNFTs }: IExpore): JSX.Element => {
  return (
    <Box p={4} display="flex">
      {nfts.map((e, i) => (
        <Box p={2} key={i}>
          <CardItem data={e} loadNFTs={loadNFTs} />
        </Box>
      ))}
    </Box>
  )
}
