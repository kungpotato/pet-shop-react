import { Contract } from 'web3-eth-contract'
import Web3 from 'web3'

export const getWeb3Contract = async (contractDefinition: Record<string,any>): Promise<Contract | null> => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    const provider = new Web3(ethereum as any)

    const networkId = await provider.eth.net.getId()

    const address = contractDefinition.networks[networkId]?.address ?? '0x2d9a564488f2f6fb5f59f3bF2dd8849194509Ee4'
    const contract = new provider.eth.Contract(contractDefinition['abi'], address)
    return contract
  }
  return null
}
