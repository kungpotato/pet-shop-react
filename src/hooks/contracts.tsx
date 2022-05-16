import React, { useEffect, useState } from 'react'
import axios from 'axios'

export const useContractJson = () => {
  const [potatoMarketContract, setPotatoMarketContract] = useState<Record<string, unknown>>()
  const [NFTContract, setNFTContract] = useState<Record<string, unknown>>()

  useEffect(() => {
    axios('definition/PotatoMarket.json').then((val) => {
      setPotatoMarketContract(val.data)
    })
    axios('definition/NFT.json').then((val) => {
      setNFTContract(val.data)
    })
    // fetch('definition/NFT.json')
  }, [])

  return { potatoMarketContract, NFTContract }
}
