import { Contract, ContractSendMethod, DeployOptions, EventData } from 'web3-eth-contract'
import Web3 from 'web3'

export enum contractEvent {
  Log = 'Log'
}

export const getWeb3Contract = async (
  contractDefinition: Record<string, any>,
  address: string
): Promise<Contract | null> => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    const provider = new Web3(ethereum as any)

    const networkId = await provider.eth.net.getId()

    const contract = new provider.eth.Contract(
      contractDefinition['abi'],
      contractDefinition.networks[networkId]?.address ?? address
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
