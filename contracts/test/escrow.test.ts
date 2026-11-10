import { expect } from "chai";
import { ethers } from "hardhat";

describe("Escrow", function () {
  it("deposits and releases funds with tax deduction", async function () {
    const [owner, buyer, seller, taxCollector] = await ethers.getSigners();
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy("Avalanche USD Coin", "USDC");
    await usdc.deployed();

    await usdc.mint(buyer.address, ethers.utils.parseUnits("1000", 6));
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(usdc.address, taxCollector.address);
    await escrow.deployed();

    const escrowId = ethers.utils.id("escrow-1");
    await usdc.connect(buyer).approve(escrow.address, ethers.utils.parseUnits("500", 6));
    await escrow.connect(buyer).depositEscrow(escrowId, seller.address, ethers.utils.parseUnits("500", 6));

    await escrow.connect(owner).releaseEscrow(escrowId);
    const sellerBalance = await usdc.balanceOf(seller.address);
    const taxBalance = await usdc.balanceOf(taxCollector.address);

    expect(sellerBalance).to.equal(ethers.utils.parseUnits("487.5", 6));
    expect(taxBalance).to.equal(ethers.utils.parseUnits("12.5", 6));
  });
});
