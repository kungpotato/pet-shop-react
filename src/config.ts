interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
  dbName: string
}

const isDevMode = process.env.NODE_ENV === 'development'

export const config: ISecret = {
  marketContractAddress: isDevMode
    ? '0x72150a723292fF1D2A578961503A48106b51B323'
    : '0x9a697b618CE0B315Bb0D72B3Cf8604ECE0A32F65',
  nftContractAddress: isDevMode
    ? '0xD53DB759f0826ca01e1Ad3FF2819EBf44141ccC6'
    : '0x7040f31b1C027FF01F038Ee466caADc7DcB5200D',
  dbName: 'kungMarket'
}
