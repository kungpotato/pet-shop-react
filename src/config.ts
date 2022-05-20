interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
  dbName: string
}

const isDevMode = process.env.NODE_ENV === 'development'

export const config: ISecret = {
  marketContractAddress: isDevMode
    ? '0xE0dbDD47e28a3d46BD4C573C180473F1Fb789eb8'
    : '0x9a697b618CE0B315Bb0D72B3Cf8604ECE0A32F65',
  nftContractAddress: isDevMode
    ? '0xB20bB3aE666067ADe84ce0eBCf7315dCaCD9A6d8'
    : '0x7040f31b1C027FF01F038Ee466caADc7DcB5200D',
  dbName: 'kungMarket3'
}
