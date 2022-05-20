import styled from '@emotion/styled'
import react, { FC, PropsWithChildren } from 'react'

import { Card, CardContentProps } from "semantic-ui-react"

interface ICardContent extends CardContentProps {
    border?: boolean
    children?: React.ReactNode
}

const CardContent = styled<FC>(Card.Content) <PropsWithChildren<ICardContent>>`
background: ${(props) => {
        return props.border ? 'linear-gradient(rgba(21, 27, 34, 0.392) 0%, rgb(48, 51, 57) 20%) ' : '#303339'
    }} !important;
`
// 

export default CardContent