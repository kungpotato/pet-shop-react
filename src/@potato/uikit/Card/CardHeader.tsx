import styled from "@emotion/styled"
import { Card } from "semantic-ui-react"

const CardHeader = styled(Card.Header)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
})

export default CardHeader