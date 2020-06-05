let MyContract = artifacts.require("./MyContract.sol");
let CrmContract = artifacts.require("./CrmContract.sol");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
  deployer.deploy(CrmContract);
};
