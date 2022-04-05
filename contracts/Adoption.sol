// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Adoption {
  address[16] public adopters;

  event Log(address indexed sender, uint256 message);

  function adopt(uint256 petId) public returns (uint256) {
    // require(petId >= 0 && petId <= 15);
    emit Log(msg.sender, petId);
    adopters[petId] = msg.sender;

    return petId;
  }

  function getAdopters() public view returns (address[16] memory) {
    return adopters;
  }
}
