import { expect } from "chai";
import { ethers } from "hardhat";

describe("Dispute", function () {
  it("files disputes, submits evidence, and resolves", async function () {
    const [admin, filer] = await ethers.getSigners();
    const Dispute = await ethers.getContractFactory("Dispute");
    const dispute = await Dispute.deploy(admin.address);
    await dispute.deployed();

    await dispute.connect(filer).createDispute(1, "Boundary conflict on parcel");
    await dispute.connect(filer).submitEvidence(1, "QmEvidenceHash");
    await dispute.connect(admin).resolveDispute(1, true);

    const details = await dispute.disputes(1);
    expect(details.status).to.equal(2); // Resolved
    expect(details.evidenceHash).to.equal("QmEvidenceHash");
  });
});
