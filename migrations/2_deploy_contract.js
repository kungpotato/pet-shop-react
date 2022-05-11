const Adoption = artifacts.require('Adoption')
const NFT = artifacts.require('NFT')
const PotatoMarket = artifacts.require('PotatoMarket')

module.exports = function (deployer) {
  // deployer.deploy(Adoption)

  // deployer.deploy(PotatoMarket).then(function () {
  //   return deployer.deploy(NFT, PotatoMarket.address)
  // })

  deployer.deploy(NFT, '0x3F2e46Ec2CEC67d077FB2fD6fe6cceB095e71A03')
}
