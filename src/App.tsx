import './style.css'

import { MoralisProvider } from 'react-moralis'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import { AppContainer } from './components/AppContainer'
import { Create } from './pages/Create'
import { lazy, Suspense } from 'react'
import { Progress } from 'semantic-ui-react'
import { PotatoThemeProvider } from './@potato/uikit/theme'

const Expore = lazy(() => import("./pages/Expore"))
const MyItem = lazy(() => import("./pages/MyItem"))

const Loading = <Progress percent={100} size='tiny' active />

function App(): JSX.Element {
  return (
    <MoralisProvider
      serverUrl="https://jqffj1drjnzm.usemoralis.com:2053/server"
      appId="iABVUKAeoEkI52Lnjt1dZrIgHuvo62ZHKk9qNDds"
    >
      <BrowserRouter>
        <AppContainer>
          <Routes>

            <Route
              path="/expore"
              element={
                <Suspense fallback={Loading}>
                  <Expore />
                </Suspense>
              }
            />
            <Route
              path="/myitem"
              element={
                <Suspense fallback={Loading}>
                  <MyItem />
                </Suspense>
              }
            />
            <Route
              path="/create"
              element={
                <Suspense fallback={Loading}>
                  <Create />
                </Suspense>
              }
            />
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </MoralisProvider>
  )
}

export default App
