import styled from "@emotion/styled"
import { Card } from "semantic-ui-react"

const CardMeta = styled(Card.Meta)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
})

export default CardMeta
