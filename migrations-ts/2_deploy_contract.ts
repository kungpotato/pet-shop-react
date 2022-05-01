declare const artifacts: any

const Adoption = artifacts.require('Adoption')
const NFT = artifacts.require('NFT')
const PotatoMarket = artifacts.require('PotatoMarket')

module.exports = function (deployer) {
  deployer.deploy(Adoption)

  deployer.deploy(PotatoMarket).then(function () {
    return deployer.deploy(NFT, PotatoMarket.address)
  })
}

export {}
