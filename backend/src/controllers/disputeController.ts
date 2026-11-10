import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listDisputes(req: Request, res: Response) {
  const disputes = await prisma.dispute.findMany({ include: { parcel: true } });
  res.json(disputes);
}

export async function createDispute(req: Request, res: Response) {
  const { parcelId, description, evidenceHash } = req.body;
  if (!parcelId || !description) return res.status(400).json({ error: "parcelId and description required" });

  const parcel = await prisma.landParcel.findUnique({ where: { id: parcelId } });
  if (!parcel) return res.status(404).json({ error: "Parcel not found" });

  const dispute = await prisma.dispute.create({
    data: {
      parcelId,
      description,
      evidenceHash: evidenceHash || ""
    }
  });

  res.json(dispute);
}

export async function submitEvidence(req: Request, res: Response) {
  const { id } = req.params;
  const { evidenceHash } = req.body;
  if (!evidenceHash) return res.status(400).json({ error: "evidenceHash required" });

  const updated = await prisma.dispute.update({ where: { id }, data: { evidenceHash, status: "EVIDENCE_SUBMITTED" } });
  res.json(updated);
}

export async function resolveDispute(req: Request, res: Response) {
  const { id } = req.params;
  const { approve } = req.body;
  if (approve === undefined) return res.status(400).json({ error: "approve required" });

  const updated = await prisma.dispute.update({ where: { id }, data: { status: approve ? "RESOLVED" : "REJECTED" } });
  res.json(updated);
}
