import styled from '@emotion/styled'
import React from 'react'
import {
    Card as CustomCard, CardContent, CardDescription, CardGroup, CardProps, CardHeader,
    CardMeta
} from 'semantic-ui-react'

interface CardComponent extends React.ComponentClass<CardProps> {
    Content: typeof CardContent
    Description: typeof CardDescription
    Group: typeof CardGroup
    Header: typeof CardHeader
    Meta: typeof CardMeta
}

const Card = ({ children, darkMode = false, style, onClick }: { children?: React.ReactNode, darkMode?: boolean, style: any, onClick?: any }) => {
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