interface ISecret {
  nftContractAddress: string
  marketContractAddress: string
}

const isDevMode = process.env.NODE_ENV === 'development'

export const config: ISecret = {
  marketContractAddress: isDevMode
    ? '0xba0a6ec820D748BAD3AAf8F623729820e91687e5'
    : '0x9a697b618CE0B315Bb0D72B3Cf8604ECE0A32F65',
  nftContractAddress: isDevMode
    ? '0xFc7c8732393B1bD8E9EDcB9404a80A6beC680Ca3'
    : '0x7040f31b1C027FF01F038Ee466caADc7DcB5200D'
}
