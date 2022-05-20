interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
  dbName: string
}

const isDevMode = process.env.NODE_ENV === 'development'

export const config: ISecret = {
  marketContractAddress: isDevMode
    ? '0xFCCF4eC444c506A766E3cc998f1719F8EBAEAd57'
    : '0x9a697b618CE0B315Bb0D72B3Cf8604ECE0A32F65',
  nftContractAddress: isDevMode
    ? '0x4a7F81183c405bD5Cb3fc6EAAE8bbE69EB6862B1'
    : '0x7040f31b1C027FF01F038Ee466caADc7DcB5200D',
  dbName: 'kungMarket'
}
