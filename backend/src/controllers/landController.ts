import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { uploadJson } from "../utils/ipfs";
import { getContract } from "../utils/contractClient";
import { config } from "../config";

const prisma = new PrismaClient();

export async function listParcels(req: Request, res: Response) {
  const parcels = await prisma.landParcel.findMany({ include: { owner: true } });
  res.json(parcels);
}

export async function registerParcel(req: Request, res: Response) {
  const { parcelNumber, coordinates, areaSize, ownerWallet, region, district, ward, documentHash } = req.body;
  if (!parcelNumber || !coordinates || !areaSize || !ownerWallet || !documentHash) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const metadata = {
    parcelId: parcelNumber,
    owner: ownerWallet,
    region,
    district,
    ward,
    gpsCoordinates: coordinates,
    areaSize,
    verificationStatus: "Pending",
    documentHash,
    createdAt: new Date().toISOString()
  };

  const metadataUri = await uploadJson(metadata);

  const owner = await prisma.user.upsert({
    where: { walletAddress: ownerWallet.toLowerCase() },
    update: {},
    create: { walletAddress: ownerWallet.toLowerCase(), role: "CITIZEN" }
  });

  const parcel = await prisma.landParcel.create({
    data: {
      parcelNumber,
      coordinates,
      areaSize,
      ownerId: owner.id,
      verificationStatus: "Pending",
      metadataUri,
      documentHash
    }
  });

  if (config.contractAddresses.landRegistry) {
    try {
      const contract = getContract("LandRegistry", config.contractAddresses.landRegistry);
      await contract.registerLand(parcelNumber, ownerWallet, region || "", district || "", ward || "", coordinates, areaSize, documentHash, metadataUri);
    } catch (error) {
      console.warn("Contract registration failed", error);
    }
  }

  res.json(parcel);
}

export async function getParcel(req: Request, res: Response) {
  const { id } = req.params;
  const parcel = await prisma.landParcel.findUnique({ where: { id }, include: { owner: true } });
  if (!parcel) return res.status(404).json({ error: "Parcel not found" });
  res.json(parcel);
}

export async function verifyParcel(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status required" });

  const parcel = await prisma.landParcel.update({ where: { id }, data: { verificationStatus: status } });
  res.json(parcel);
}

export async function freezeParcel(req: Request, res: Response) {
  const { id } = req.params;
  const parcel = await prisma.landParcel.update({ where: { id }, data: { verificationStatus: "Frozen" } });
  res.json(parcel);
}
