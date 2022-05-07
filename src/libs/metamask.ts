import { getChainId } from './web3'

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

interface RequestArguments {
  method: 'eth_requestAccounts' | 'chainChanged' | 'accountsChanged'
  params?: unknown[] | Record<string, unknown>
}

interface ConnectInfo {
  chainId: string
}

type eventMap = {
  chainChanged: string
  connect: ConnectInfo
  accountsChanged: string[]
}

type eventResult<T extends keyof eventMap> = T extends string ? string | string[] : ConnectInfo

export interface EthereumProvider {
  request(args: RequestArguments): Promise<string[]>
  on: <T extends keyof eventMap>(event: keyof eventMap, handler: (data: eventResult<T>) => void) => void
}

const getMetamask = async (): Promise<string[]> => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    return accounts
  }
  return []
}

export const getMetamaskAccount = async () => {
  const accounts = await getMetamask()

  const chainId = await getChainId()

  if (chainId !== 1337) {
    console.log('incurrect chain')
  }

  return accounts
}

export const chainChanged = (callback?: (chainId: number) => void): void => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    ethereum.on('chainChanged', (data) => {
      if (callback) callback(parseInt(data as any, 16))
    })
  }
}

export const accountChanged = (callback?: (ac: string[]) => void): void => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    ethereum.on('accountsChanged', (accounts) => {
      if (callback) callback(accounts as any)
    })
  }
}
