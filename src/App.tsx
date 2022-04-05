import './App.css'
import { chainChanged, getMetamask } from './libs/metamask'
import { getEtherContract } from './libs/ethereum'
import Adoption from './abis/Adoption.json'
import { getWeb3Contract } from './libs/web3'

function App() {
  const getMetamaskAccount = async () => {
    const accounts = await getMetamask()
    return accounts
  }

  async function adopt() {
    let count = 0
    const accounts = await getMetamaskAccount()
    // const contract = await getEtherContract(Adoption)
    const contract = await getWeb3Contract(Adoption)
    await contract?.methods.adopt(count).send({ from: accounts[0] })
    count += 1
    // Get the value from the contract to prove it worked.
    const response = await contract?.methods.getAdopters().call()
    console.log({ response })
  }

  chainChanged((data) => {
    console.log(data)
  })

  return (
    <div className="App">
      <h1>Test Metamask</h1>
      <button onClick={getMetamaskAccount}>connect</button>
      <button onClick={adopt}>adopt</button>
    </div>
  )
}

export default App
