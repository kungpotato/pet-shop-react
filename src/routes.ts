import React from 'react'
import { Create } from './pages/Create'
// import Expore from './pages/Expore'
// import { MyItem } from './pages/MyItem'

interface IRoute {
  title: string
  path: string
  element: any
}

export const routes: IRoute[] = [
  // { title: 'Expore', path: '', element: Expore },
  // { title: 'My item', path: 'my-item', element: MyItem },
  { title: 'Create', path: 'create', element: Create }
]
