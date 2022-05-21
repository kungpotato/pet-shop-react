import React, { Fragment, useEffect, useState } from 'react'
import { useTheme } from './useTheme'

type theme = 'light' | 'dark' | undefined

export const PotatoThemeProvider = ((props: { children: JSX.Element, theme: theme }) => {
    console.log('xxxx', props.theme)

    const { changeTheme } = useTheme()

    useEffect(() => {
        changeTheme(props.theme)
    }, [props.theme])


    return (
        < Fragment >
            {props.children}
        </ Fragment >
    )
})
