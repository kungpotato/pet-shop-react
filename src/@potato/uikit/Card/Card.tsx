import styled from '@emotion/styled'
import React from 'react'
import {
    Card as CustomCard, CardContent, CardDescription, CardGroup, CardProps, CardHeader,
    CardMeta
} from 'semantic-ui-react'

interface CardComponent { children?: React.ReactNode, darkMode?: boolean, style: any, onClick?: any }

const Card = ({ children, darkMode = false, style, onClick }: CardComponent) => {
    const darkStyle = darkMode ? { ...style, background: '#303032', border: '0', boxShadow: 'none' } : { ...style }
    return <CustomCard style={darkStyle} onClick={onClick}>
        {children}
    </CustomCard>
}



const Meta = styled(CustomCard.Meta)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
})

const Description = styled(CustomCard.Description)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
})


export default Card