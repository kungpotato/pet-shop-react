import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { faker } from '@faker-js/faker'
import { Button, Stack } from '@mui/material'
import { ShoppingCart } from '@mui/icons-material'
import { INFTItem } from '../App'

interface ICardItem {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  data: INFTItem
}

export default function CardItem({ onClick, data }: ICardItem) {
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            K
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data.name}
      />
      <CardMedia component="img" height="194" image={data.image} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" endIcon={<ShoppingCart />} onClick={onClick}>
            Buy
          </Button>
        </Stack>
      </CardActions>
    </Card>
  )
}
