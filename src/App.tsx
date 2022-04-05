import './App.css'
import { chainChanged, getMetamask } from './metamask'
import { getEtherContract } from './ethereum'
import Adoption from './abis/Adoption.json'

function App() {
  const getMetamaskAccount = async () => {
    let count = 0
    const accounts = await getMetamask()
    const contract = await getEtherContract(Adoption)
    await contract?.adopt(count)
    count += 1
    // Get the value from the contract to prove it worked.
    const response = await contract?.getAdopters()
    console.log({ response })
  }

  chainChanged((data) => {
    console.log(data)
  })

  return (
    <div className="App">
      <h1>Test Metamask</h1>
      <button onClick={getMetamaskAccount}>connect</button>
    </div>
  )
}

export default App
