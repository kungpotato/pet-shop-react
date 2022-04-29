import './App.css'
import { chainChanged, getMetamask } from './libs/metamask'
// import { getEtherContract } from './libs/ethereum'
import Adoption from './definition/Adoption.json'
import { contractEvent, getChainId, getContractEvent, getWeb3Contract } from './libs/web3'
import { ContractContext } from './contract-type/Adoption'

enum contractAddress {
  Adoption = '0x2d9a564488f2f6fb5f59f3bF2dd8849194509Ee4'
}

function App(): JSX.Element {
  let count = 0
  const getMetamaskAccount = async () => {
    const accounts = await getMetamask()
    console.log({ accounts })

    const chainId = await getChainId()
    console.log({ chainId })
    if (chainId !== 5777) {
      alert('incurrect chain')
    }

    return accounts
  }

  async function adopt() {
    const accounts = await getMetamaskAccount()
    // const contract = await getEtherContract(Adoption)
    const contract = (await getWeb3Contract(Adoption, contractAddress.Adoption)) as unknown as ContractContext
    await contract?.methods.adopt(count.toString()).send({ from: accounts[0] })
    count += 1
    console.log(count)

    // Get the value from the contract to prove it worked.
    const response = await contract?.methods.getAdopters().call()
    console.log({ response })

    const events = await getContractEvent(contract as any, contractEvent.Log)
    console.log({ events })
  }

  chainChanged(async (data) => {
    console.log(data)
    const chainId = await getChainId()
    console.log({ chainId })

    if (chainId !== 5777) {
      alert('incurrect chain')
    }
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
