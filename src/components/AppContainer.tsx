import React, { Fragment } from 'react'
import { MyAppBar } from './Appbar'

export const AppContainer = ((props: { children: JSX.Element }) => {
    return (
        <Fragment>
            <MyAppBar />
            <div>{props.children}</div>
        </Fragment>
    )
})