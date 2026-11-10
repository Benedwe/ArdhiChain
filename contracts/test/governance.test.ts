import { expect } from "chai";
import { ethers } from "hardhat";

describe("GovernanceDAO", function () {
  it("creates proposals and allows voting", async function () {
    const [admin, voter] = await ethers.getSigners();
    const GovernanceDAO = await ethers.getContractFactory("GovernanceDAO");
    const governance = await GovernanceDAO.deploy(admin.address);
    await governance.deployed();

    await governance.createProposal("Approve transfer", "Approve a land transfer proposal");
    await governance.connect(voter).vote(1, true);

    const proposal = await governance.proposals(1);
    expect(proposal.title).to.equal("Approve transfer");
    expect(proposal.yesVotes.toNumber()).to.equal(1);
  });
});
