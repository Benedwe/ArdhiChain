import { PrismaClient, UserRole, EscrowStatus, ProposalStatus, DisputeStatus } from "@prisma/client";
import { ethers } from "ethers";

const prisma = new PrismaClient();

function randomCoordinate() {
  const lat = (Math.random() * 3 - 11).toFixed(6);
  const lng = (Math.random() * 4 + 32).toFixed(6);
  return `${lat},${lng}`;
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.landParcel.deleteMany();
  await prisma.user.deleteMany();

  const citizens = [];
  for (let i = 1; i <= 50; i++) {
    citizens.push({
      walletAddress: ethers.Wallet.createRandom().address.toLowerCase(),
      name: `Citizen ${i}`,
      email: `citizen${i}@ardhichain.tz`,
      role: UserRole.CITIZEN
    });
  }

  const officers = [];
  for (let i = 1; i <= 10; i++) {
    officers.push({
      walletAddress: ethers.Wallet.createRandom().address.toLowerCase(),
      name: `Officer ${i}`,
      email: `officer${i}@ardhichain.tz`,
      role: UserRole.OFFICER
    });
  }

  const admin = {
    walletAddress: ethers.Wallet.createRandom().address.toLowerCase(),
    name: "Admin User",
    email: "admin@ardhichain.tz",
    role: UserRole.ADMIN
  };

  await prisma.user.createMany({ data: [...citizens, ...officers, admin] });
  const users = await prisma.user.findMany();
  const citizenUsers = users.filter((u) => u.role === UserRole.CITIZEN);

  for (let i = 1; i <= 100; i++) {
    const owner = citizenUsers[i % citizenUsers.length];
    await prisma.landParcel.create({
      data: {
        parcelNumber: `TZ-PARCEL-${String(i).padStart(4, "0")}`,
        coordinates: randomCoordinate(),
        areaSize: `${Math.floor(Math.random() * 15) + 1} acres`,
        nftTokenId: i,
        ownerId: owner.id,
        verificationStatus: i % 5 === 0 ? "Verified" : "Pending",
        metadataUri: `ipfs://demo/parcel-${i}`,
        documentHash: `QmDemo${i}`
      }
    });
  }

  const proposals = [];
  for (let i = 1; i <= 20; i++) {
    proposals.push({
      title: `Proposal ${i}: improve land governance`,
      description: `Recommendation ${i} to improve transparency and tax collection for land parcel transfers.`,
      status: ProposalStatus.OPEN
    });
  }
  await prisma.proposal.createMany({ data: proposals });

  for (let i = 1; i <= 50; i++) {
    const buyer = citizenUsers[i % citizenUsers.length];
    const seller = citizenUsers[(i + 10) % citizenUsers.length];
    await prisma.transaction.create({
      data: {
        buyerId: buyer.id,
        sellerId: seller.id,
        amount: ethers.parseUnits((Math.random() * 10000 + 500).toFixed(2), 6).toString(),
        escrowStatus: i % 3 === 0 ? EscrowStatus.RELEASED : EscrowStatus.PENDING
      }
    });
  }

  const parcels = await prisma.landParcel.findMany();
  for (let i = 1; i <= 15; i++) {
    const parcel = parcels[i % parcels.length];
    await prisma.dispute.create({
      data: {
        parcelId: parcel.id,
        status: i % 2 === 0 ? DisputeStatus.RESOLVED : DisputeStatus.OPEN,
        evidenceHash: `QmEvidence${i}`,
        description: `Dispute ${i} filed for parcel ${parcel.parcelNumber}`
      }
    });
  }

  await prisma.auditLog.createMany({
    data: [
      { action: "Seed data loaded", actor: admin.walletAddress, metadata: "Demo environment", timestamp: new Date() },
      { action: "50 citizens created", actor: admin.walletAddress, metadata: "Seeder", timestamp: new Date() }
    ]
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
