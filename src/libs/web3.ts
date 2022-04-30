import { Contract, ContractSendMethod, DeployOptions, EventData } from 'web3-eth-contract'
import Web3 from 'web3'

export enum contractEvent {
  Log = 'Log'
}

export const getWeb3Provider = async (): Promise<Web3 | null> => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    return new Web3(ethereum as any)
  }
  return null
}

export const getChainId = async (): Promise<number | undefined> => {
  const provider = await getWeb3Provider()
  return provider?.eth.net.getId()
}

export const getWeb3Contract = async (
  contractDefinition: Record<string, any>
): Promise<Contract | null> => {
  const provider = await getWeb3Provider()
  const networkId = await getChainId()

  if (provider && networkId) {
    const contract = new provider.eth.Contract(
      contractDefinition['abi'],
      contractDefinition.networks[networkId]?.address
    )
    return contract
  }
  return null
}

export const getContractEvent = (contract: Contract, event: contractEvent): Promise<EventData[]> => {
  const options = {
    filter: {
      value: []
    },
    fromBlock: 0, //Number || "earliest" || "pending" || "latest"
    toBlock: 'latest'
  }
  return contract.getPastEvents(event, options)
}

export const deployContract = (contract: Contract): ContractSendMethod => {
  const options: DeployOptions = {
    data: '',
    arguments: []
  }
  return contract.deploy(options)
}
