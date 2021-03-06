// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// security against transactions for multiple requests

contract PotatoMarket is ReentrancyGuard {
  using Counters for Counters.Counter;

  /* number of items minting, number of transactions, tokenn that not have been sold
   keep track of token total number - tokenId
   arrays needto knoe the length - help to keep track for arrays */

  Counters.Counter private _tokenIds;
  Counters.Counter private _tokenSold;

  // determine who is owner of the contract
  // charge a linting fee so the owner makes a commission

  address payable owner;
  // we are deploy to matic the API is the same so you can use ether the same way as matic
  // they both have 18 decimal
  // 0.045 is in the cents
  uint256 listingPrice = 0.045 ether;

  constructor() {
    // set the owner
    owner = payable(msg.sender);
  }

  // struct can act like objects

  struct MarketToken {
    uint256 itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  // tokenId return which MarketToken - fetch wich one it is

  mapping(uint256 => MarketToken) private idToMarketToken;

  // listen to event from front end application
  event MarketTokenMinted(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  // get the listing price
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  // two functions to interact with contract
  // 1. create a market item to put it up for sale
  // 2. create a market sale for buying and selling between parties

  function makeMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    // nonReentrant is a modifier to prevent reentry attact

    require(price > 0, 'Price must be at least one wei');
    require(msg.value == listingPrice, 'Price must be equal to listing price');

    _tokenIds.increment();
    uint256 itemId = _tokenIds.current();

    // putting it up for sale - bool - no owner
    idToMarketToken[itemId] = MarketToken(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    // NFT transaction
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketTokenMinted(itemId, nftContract, tokenId, msg.sender, address(0), price, false);
  }

  // function to conduct transcation and market sale

  function createMarketSale(address nftContract, uint256 itemId) public payable nonReentrant {
    uint256 price = idToMarketToken[itemId].price;
    uint256 tokenId = idToMarketToken[itemId].tokenId;
    require(msg.value == price, 'Please submit the asking price in order to continue');

    // transfer the amount to the seller
    idToMarketToken[itemId].seller.transfer(msg.value);
    // transfer the token from contract address to the buyer
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketToken[itemId].owner = payable(msg.sender);
    idToMarketToken[itemId].sold = true;
    _tokenSold.increment();

    payable(owner).transfer(listingPrice);
  }

  // function to fetchMarketItem - minting, buying and selling
  // return the number of unsold items

  function fetchMarketItems() public view returns (MarketToken[] memory) {
    uint256 itemCount = _tokenIds.current();
    uint256 unsoldItemCount = _tokenIds.current() - _tokenSold.current();
    uint256 currentIndex = 0;

    // looping over the number of  items created
    MarketToken[] memory items = new MarketToken[](unsoldItemCount);
    for (uint256 i = 0; i < itemCount; i++) {
      if (idToMarketToken[i + 1].owner == address(0)) {
        uint256 currentId = i + 1;
        MarketToken storage currentItem = idToMarketToken[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  // return nfts that the user has purchased

  function fetchMyNfts() public view returns (MarketToken[] memory) {
    uint256 totalItemCount = _tokenIds.current();
    // a second counter for each individual user
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketToken[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    // second loop to loop through the amount you  have purchased with itemCount
    // check to see if the owner address is equal to msg.sender

    MarketToken[] memory items = new MarketToken[](itemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketToken[i + 1].owner == msg.sender) {
        uint256 currentId = idToMarketToken[i + 1].itemId;
        // current array
        MarketToken storage currentItem = idToMarketToken[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  // function for returning an array of minted nfts
  function fetchItemCreated() public view returns (MarketToken[] memory) {
    // instead of .owner it will be the .seller
    uint256 totalItemCount = _tokenIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketToken[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    // second loop to loop through the amount you  have purchased with itemCount
    // check to see if the owner address is equal to msg.sender

    MarketToken[] memory items = new MarketToken[](itemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketToken[i + 1].seller == msg.sender) {
        uint256 currentId = idToMarketToken[i + 1].itemId;

        MarketToken storage currentItem = idToMarketToken[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}
