const PotatoMarket = artifacts.require('PotatoMarket')
const NFT = artifacts.require('NFT')
const ethers = require('ethers')

contract('Potato Market', (accounts) => {
  it('should mint and trade NFTs', async () => {
    const potatoMarket = await PotatoMarket.deployed()
    const nft = await NFT.deployed(marketAddress)

    const nftContractAddress = nft.address

    const listingPrice = await potatoMarket.getListingPrice()
    const auctionPrice = ethers.utils.parseUnits('1', 'ether')
    // console.log({ marketAddress, nftContractAddress, listingPrice, auctionPrice })
    await nft.mintToken('https-t1')
    await nft.mintToken('https-t2')

    await potatoMarket.makeMarketItem(nftContractAddress, 1, auctionPrice.toString(), {
      value: listingPrice,
      gas: 5000000,
      gasLimit: 21000,
      gasPrice: 21000
    })
    await potatoMarket.makeMarketItem(nftContractAddress, 2, auctionPrice.toString(), {
      value: listingPrice,
      gas: 5000000,
      gasLimit: 21000,
      gasPrice: 21000
    })

    await potatoMarket.createMarketSale.call(nftContractAddress, 1, {
      value: auctionPrice,
      gas: 5000000,
      gasLimit: 21000,
      gasPrice: 21000
    })
    await potatoMarket.createMarketSale.call(nftContractAddress, 2, {
      value: auctionPrice,
      gas: 5000000,
      gasLimit: 21000,
      gasPrice: 21000
    })

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
