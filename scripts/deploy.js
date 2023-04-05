const hre = require("hardhat");

async function main() {
  const name = "RockPaperScissors"
  const symbol = "RPS"

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(name, symbol);

  await nft.deployed();

  console.log("NFT address:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
