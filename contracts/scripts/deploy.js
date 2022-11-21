const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

async function main() {

    const Auction = await ethers.getContractFactory("Auction");
    console.log("Deploying auction...");
    const auction = await Auction.deploy();

    await auction.deployed();
    console.log("Auction deployed to:", auction.address);
}

main();