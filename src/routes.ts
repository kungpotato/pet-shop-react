import React from 'react'
import { Expore } from './pages/expore'
import { MyItem } from './pages/myItem'

interface IRoute {
  title: string
  path: string
  element: any
}

export const routes: IRoute[] = [
  { title: 'Expore', path: '', element: Expore },
  { title: 'My item', path: 'my-item', element: MyItem }
]
