// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  // counters allow us to keep tract of tokenIds

  // address of marketplace for NFTs to interact
  address contractAddress;

  // OBJ: give the NFT market the ability to transact with tokens or change ownership
  // setApprovalForAll allows us to do that with contract address

  event MintedNFT(address indexed minter, string tokenURI, uint256 nftId);

  // constructor set up our address
  constructor(address marketplaceAddress) ERC721('Potato', 'CPAY') {
    require(marketplaceAddress != address(0), 'NFT: invalid market address');
    contractAddress = marketplaceAddress;
  }

  function mintToken(string memory tokenURI) public returns (uint256) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    // give the market the approval to transact between users
    setApprovalForAll(contractAddress, true);
    // min the token and set it for sale - return the id to do so
    emit MintedNFT(msg.sender, tokenURI, newItemId);

    return newItemId;
  }
}
