const BigNumber = require('bignumber.js');

const GameChannel = artifacts.require("./GameChannel.sol");
const ConflictResolution = artifacts.require("./ConflictResolution.sol");
const DiceLower = artifacts.require("./games/DiceLower.sol");
const DiceHigher = artifacts.require("./games/DiceHigher.sol");
// const ChooseFrom12 = artifacts.require("./games/ChooseFrom12.sol");
const FlipACoin = artifacts.require("./games/FlipACoin.sol");
// const Keno = artifacts.require("./games/Keno.sol");
// const Wheel = artifacts.require("./games/Wheel.sol");


module.exports = async function(deployer, network, accounts) {
    let serverAccount = "";
    let houseAccount = "";
    let chainId = 123456789;
    if (network === "development" || network === "test") {
        serverAccount = accounts[1];
        houseAccount = accounts[4];
        chainId = 123456789;
    } else if (network === "bsctestnet") {
        serverAccount = "0xD77450974E5F620b47295D99437278D20d28C050";
        houseAccount = "0xD77450974E5F620b47295D99437278D20d28C050";
        chainId = 4;
    } else if (network === "mainnet") {
        serverAccount = "0xD77450974E5F620b47295D99437278D20d28C050";
        houseAccount = "0xD77450974E5F620b47295D99437278D20d28C050";
        chainId = 1;
    } else {
        throw "Invalid network!"
    }

    await deployer.deploy(DiceLower);
    await deployer.deploy(DiceHigher);
    // await deployer.deploy(ChooseFrom12);
    await deployer.deploy(FlipACoin);
    // await deployer.deploy(Keno);
    // await deployer.deploy(Wheel);

    await DiceLower.deployed();
    await DiceHigher.deployed();
    // await ChooseFrom12.deployed();
    await FlipACoin.deployed();
    // await Keno.deployed();
    // await Wheel.deployed();

    await deployer.deploy(
        ConflictResolution,
        [DiceLower.address, DiceHigher.address, FlipACoin.address],
        {gas: 2000000}
    );

    await ConflictResolution.deployed();
    await deployer.deploy(
        GameChannel,
        serverAccount,
        1e16.toString(),
        200e18.toString(),
        ConflictResolution.address,
        houseAccount,
        chainId,
        {gas: 5000000}
    );

    const gameChannel = await GameChannel.deployed();

    if (network === "development") {
        await gameChannel.addHouseStake({from: accounts[0], value: 50e18.toString()});
        await gameChannel.activate({from: accounts[0]});
        await gameChannel.unpause({from: accounts[0]});
    }
};
