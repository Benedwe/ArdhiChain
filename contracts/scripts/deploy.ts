import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const LandRegistryInstance = await LandRegistry.deploy("ArdhiChain Land", "ARLC");
  await LandRegistryInstance.deployed();

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUsdc = await MockUSDC.deploy("Avalanche USD Coin", "USDC");
  await mockUsdc.deployed();

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(mockUsdc.address, deployer.address);
  await escrow.deployed();

  const GovernanceDAO = await ethers.getContractFactory("GovernanceDAO");
  const governance = await GovernanceDAO.deploy(deployer.address);
  await governance.deployed();

  const Dispute = await ethers.getContractFactory("Dispute");
  const dispute = await Dispute.deploy(deployer.address);
  await dispute.deployed();

  console.log("LandRegistry deployed to:", LandRegistryInstance.address);
  console.log("MockUSDC deployed to:", mockUsdc.address);
  console.log("Escrow deployed to:", escrow.address);
  console.log("GovernanceDAO deployed to:", governance.address);
  console.log("Dispute deployed to:", dispute.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
