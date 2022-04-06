import { ethers } from 'ethers'

export const getEtherContract = async (contractDefinition: Record<string,any>): Promise<ethers.Contract | null> => {
  if (typeof window.ethereum !== 'undefined') {
    const { ethereum } = window
    const provider = new ethers.providers.Web3Provider(ethereum as any)

    const network = await provider.getNetwork()

    const daiAddress =
      contractDefinition.networks[network.chainId]?.address ?? '0x2d9a564488f2f6fb5f59f3bF2dd8849194509Ee4'
    const signer = provider.getSigner()
    const contract = new ethers.Contract(daiAddress, contractDefinition['abi'], signer)
    return contract
  }
  return null
}
