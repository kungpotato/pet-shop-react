var Adoption = artifacts.require('Adoption')
var NFT = artifacts.require('NFT')
var PotatoMarket = artifacts.require('PotatoMarket')

module.exports = function (deployer) {
  deployer.deploy(Adoption)
  deployer.deploy(NFT,'0xC03e535b7B069675e78071a71E2fbCaeBe270cE6')
  deployer.deploy(PotatoMarket)
}
