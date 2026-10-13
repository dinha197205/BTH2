const hre = require("hardhat");

async function main() {
  const FirstSmartContract = await hre.ethers.getContractFactory(
    "FirstSmartContract",
  );

  const firstSmartContract = await FirstSmartContract.deploy();

  await firstSmartContract.waitForDeployment();

  console.log(
    "FirstSmartContract deployed to:",
    await firstSmartContract.getAddress(),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
