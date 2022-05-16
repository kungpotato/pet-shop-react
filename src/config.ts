interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
  dbName: string
}

const isDevMode = process.env.NODE_ENV === 'development'

export const config: ISecret = {
  marketContractAddress: isDevMode
    ? '0xAe30B620Ff6fBa1F6391a61f432b4d1dea118929'
    : '0x9a697b618CE0B315Bb0D72B3Cf8604ECE0A32F65',
  nftContractAddress: isDevMode
    ? '0x6cF64d5F79dB46BE334f2A39E640D95CD6220A9A'
    : '0x7040f31b1C027FF01F038Ee466caADc7DcB5200D',
  dbName: 'kungMarket'
}
