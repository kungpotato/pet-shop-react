import React, { Fragment } from 'react'
import { useTheme } from '../@potato/uikit/theme'
import { MyAppBar } from './Appbar'

export const AppContainer = ((props: { children: JSX.Element }) => {
    const { theme, changeTheme } = useTheme()
    console.log('theme app', theme)
    return (
        <Fragment>
            <div style={{ background: theme === 'dark' ? '#202225' : '#fff' }}>
                <MyAppBar changeTheme={changeTheme} theme={theme} />
                <div style={{ height: 'calc(100vh - 94px)' }}>{props.children}</div>
            </div>
        </Fragment>
    )
})