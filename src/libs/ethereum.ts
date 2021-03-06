import { ethers } from 'ethers'

export enum ChainId {
  dev = '1337',
  production='80001'  // matic
}

export const getEtherContract = async (
  contractDefinition: Record<string, any>,
  address: string
): Promise<ethers.Contract | null> => {

  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    const provider = new ethers.providers.Web3Provider(ethereum as any)

    const network = await provider.getNetwork()
    if (Number.parseInt(process.env.NODE_ENV === 'development' ? ChainId.dev : ChainId.production) === network.chainId) {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, contractDefinition['abi'], signer)
      return contract
    }
  }
  return null
}
