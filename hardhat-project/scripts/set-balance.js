const hre = require("hardhat");

async function main() {
  const contractAddress = "0x4B63a0dB480cb735d92b309E03af3209Ed7Db8c9";

  const contract = await hre.ethers.getContractAt(
    "FirstSmartContract",
    contractAddress,
  );

  const tx = await contract.setBalance(500000000);

  console.log("Transaction hash:", tx.hash);
  console.log("Dang cho blockchain xac nhan...");

  await tx.wait();

  console.log("Ghi du lieu thanh cong!");

  const balance = await contract.getBalance();
  console.log("Balance moi:", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
