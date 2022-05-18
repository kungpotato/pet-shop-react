import styled from 'styled-components'
import { Card } from 'semantic-ui-react'
import React, { FC } from 'react'

interface ICardHeader {
  darkMode?: boolean
  children?: React.ReactNode
}

const CardHeader = styled<FC>(Card.Header)<ICardHeader>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => {
    return props.darkMode ? '#fff' : ' #000'
  }} !important;
`

export default CardHeader
