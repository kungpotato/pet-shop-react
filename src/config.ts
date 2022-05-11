interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
}

const isDevMode = process.env.NODE_ENV === 'development'

export const config: ISecret = {
  marketContractAddress: isDevMode ? '0x842eac76f217f4A124Cae53dDD3F0ff342384c0D' : '0x9a697b618CE0B315Bb0D72B3Cf8604ECE0A32F65',
  nftContractAddress: isDevMode ? '0x8EC571C44A18ae4dA4b551a7544A82dC27C95a8b' : '0x7040f31b1C027FF01F038Ee466caADc7DcB5200D'
}
