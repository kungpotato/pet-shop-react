declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

interface RequestArguments {
  method: 'eth_requestAccounts' | 'chainChanged'
  params?: unknown[] | Record<string, unknown>
}

interface ConnectInfo {
  chainId: string
}

type eventMap = {
  chainChanged: string
  connect: ConnectInfo
}

type eventResult<T extends keyof eventMap> = T extends string ? string : ConnectInfo

export interface EthereumProvider {
  request(args: RequestArguments): Promise<string[]>
  on: <T extends keyof eventMap>(event: keyof eventMap, handler: (data: eventResult<T>) => void) => void
}

export const getMetamask = async (): Promise<string[]> => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    return accounts
  }
  return []
}

export const chainChanged = (callback?: (chainId: number) => void): void => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    ethereum.on('chainChanged', (data) => {
      if (callback) callback(parseInt(data, 16))
    })
  }
}
