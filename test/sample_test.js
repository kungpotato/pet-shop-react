const PotatoMarket = artifacts.require('PotatoMarket')
const NFT = artifacts.require('NFT')
const ethers = require('ethers')

contract('Potato Market', (accounts) => {
  it('should mint and trade NFTs', async () => {
    const potatoMarket = await PotatoMarket.deployed()
    const nft = await NFT.deployed()
    const marketAddress = nft.address
    const nftContractAddress = nft.address

    const listingPrice = await potatoMarket.getListingPrice()
    const auctionPrice = ethers.utils.parseUnits('1', 'ether')
    // console.log({ marketAddress, nftContractAddress, listingPrice, auctionPrice })
    await nft.mintToken('https-t1')
    await nft.mintToken('https-t2')

    await potatoMarket.makeMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
      gasLimit: 1000000
    })
    await potatoMarket.makeMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
      gasPrice: 1000000
    })

    await potatoMarket.createMarketSale.call(nftContractAddress, 1, { value: auctionPrice, gasPrice: 1000000 })

    let items = await potatoMarket.fetchMarketItems()
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        const item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
        return item
      })
    )
    console.log('items: ', items)
  })
})
