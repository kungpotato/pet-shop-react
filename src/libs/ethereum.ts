import { ethers } from 'ethers'

export enum ChainId {
  dev = '1337'
}

export const getEtherContract = async (contractDefinition: Record<string, any>): Promise<ethers.Contract | null> => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    const provider = new ethers.providers.Web3Provider(ethereum as any)

    const network = await provider.getNetwork()
    if (Number.parseInt(ChainId.dev) === network.chainId) {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        contractDefinition.networks[network.chainId]?.address,
        contractDefinition['abi'],
        signer
      )
      return contract
    }
  }
  return null
}
