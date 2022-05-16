interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
}

const isDevMode = process.env.NODE_ENV === 'development'

export const config: ISecret = {
  marketContractAddress: isDevMode
    ? '0xBD5BD0F3adbE288260ba840009c02B78061925E7'
    : '0x9a697b618CE0B315Bb0D72B3Cf8604ECE0A32F65',
  nftContractAddress: isDevMode
    ? '0x2148bD74E7A025BA5AC907027f8FeC4e2BfF5Fec'
    : '0x7040f31b1C027FF01F038Ee466caADc7DcB5200D'
}
