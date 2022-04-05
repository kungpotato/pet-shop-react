import logo from './logo.svg'
import './App.css'
import { chainChanged, getMetamask } from './connector'

function App() {
  const openMetamask = () => {
    getMetamask()
  }

  chainChanged((data) => {
    console.log(data)
  })

  return (
    <div className="App">
      <h1>Test Metamask</h1>
      <button onClick={openMetamask}>connect</button>
    </div>
  )
}

export default App
