import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAuditLogs(req: Request, res: Response) {
  const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: "desc" } });
  res.json(logs);
}

export async function getReports(req: Request, res: Response) {
  const totalParcels = await prisma.landParcel.count();
  const totalTransactions = await prisma.transaction.count();
  const totalDisputes = await prisma.dispute.count();
  const activeProposals = await prisma.proposal.count({ where: { status: "OPEN" } });
  res.json({ totalParcels, totalTransactions, totalDisputes, activeProposals });
}
