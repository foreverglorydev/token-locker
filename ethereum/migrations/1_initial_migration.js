const Locker = artifacts.require("Locker");

module.exports = async function (deployer) {
    deployer.deploy(Locker);
};
