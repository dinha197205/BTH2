const hre = require("hardhat");

async function main() {
  const DominionDAO = await hre.ethers.getContractFactory("DominionDAO");

  const dao = await DominionDAO.deploy();

  await dao.waitForDeployment();

  console.log("DominionDAO deployed to:", await dao.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
