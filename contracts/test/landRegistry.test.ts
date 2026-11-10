import { expect } from "chai";
import { ethers } from "hardhat";

describe("LandRegistry", function () {
  it("registers and verifies land", async function () {
    const [owner, verifier, user] = await ethers.getSigners();
    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    const registry = await LandRegistry.deploy("ArdhiChain Land", "ARLC");
    await registry.deployed();

    await registry.grantRole(ethers.utils.id("VERIFIER_ROLE"), verifier.address);

    const parcelId = "TZ-001";
    const tokenURI = "ipfs://example/metadata.json";
    await registry.connect(user).registerLand(parcelId, user.address, "Dar es Salaam", "Kinondoni", "Msasani", "-6.77,39.28", "2.5 acres", "QmDocHash", tokenURI);
    const details = await registry.getLandDetails(1);

    expect(details.parcelId).to.equal(parcelId);
    expect(details.owner).to.equal(user.address);
    expect(details.verificationStatus).to.equal("Pending");

    await registry.connect(verifier).verifyLand(1, "Verified");
    const updated = await registry.getLandDetails(1);
    expect(updated.verificationStatus).to.equal("Verified");
  });

  it("transfers land if not frozen", async function () {
    const [owner, buyer] = await ethers.getSigners();
    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    const registry = await LandRegistry.deploy("ArdhiChain Land", "ARLC");
    await registry.deployed();

    await registry.registerLand("TZ-002", owner.address, "Arusha", "Arusha", "Kaloleni", "-3.37,36.69", "1.2 acres", "QmHash", "ipfs://metadata2");
    await registry.connect(owner).transferLand(1, buyer.address);

    const details = await registry.getLandDetails(1);
    expect(details.owner).to.equal(buyer.address);
  });
});
