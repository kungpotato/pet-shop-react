import React, { useEffect, useState } from 'react'

type theme = 'light' | 'dark' | undefined

export const useTheme = () => {
  const [theme, setTheme] = useState<theme>('light')

  useEffect(() => {
    const themeInLocal = localStorage.getItem('theme') as theme
    if (themeInLocal) {
      setTheme(themeInLocal)
    }
  }, [])

  const changeTheme = (themeMode?: theme) => {
    console.log('oooo', themeMode)
    localStorage.setItem('theme', themeMode as any)
    setTheme(themeMode)
  }

  return { theme, changeTheme }
}
