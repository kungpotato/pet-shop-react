import './style.css'

import { MoralisProvider } from 'react-moralis'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import { MyAppBar } from './components/Appbar'

function App(): JSX.Element {
  return (
    <MoralisProvider
      serverUrl="https://jqffj1drjnzm.usemoralis.com:2053/server"
      appId="iABVUKAeoEkI52Lnjt1dZrIgHuvo62ZHKk9qNDds"
    >
      <BrowserRouter>
        <MyAppBar />
        <Routes>
          {routes.map((e, i) => (
            <Route key={i} path={e.path} element={e.element()} />
          ))}
        </Routes>
      </BrowserRouter>
    </MoralisProvider>
  )
}

export default App
