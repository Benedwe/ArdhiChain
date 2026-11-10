import { Request, Response } from "express";
import { PrismaClient, EscrowStatus } from "@prisma/client";
import { ethers } from "ethers";

const prisma = new PrismaClient();

export async function listTransactions(req: Request, res: Response) {
  const transactions = await prisma.transaction.findMany({ include: { buyer: true, seller: true } });
  res.json(transactions);
}

export async function createTransaction(req: Request, res: Response) {
  const { sellerWallet, amount } = req.body;
  if (!sellerWallet || !amount) return res.status(400).json({ error: "sellerWallet and amount required" });

  const buyer = await prisma.user.findUnique({ where: { walletAddress: req.user!.walletAddress } });
  if (!buyer) return res.status(404).json({ error: "Buyer not found" });

  const seller = await prisma.user.upsert({
    where: { walletAddress: sellerWallet.toLowerCase() },
    update: {},
    create: { walletAddress: sellerWallet.toLowerCase(), role: "CITIZEN" }
  });

  const transaction = await prisma.transaction.create({
    data: {
      buyerId: buyer.id,
      sellerId: seller.id,
      amount: ethers.parseUnits(amount.toString(), 6).toString(),
      escrowStatus: EscrowStatus.PENDING
    }
  });

  res.json(transaction);
}

export async function getTransaction(req: Request, res: Response) {
  const { id } = req.params;
  const tx = await prisma.transaction.findUnique({ where: { id }, include: { buyer: true, seller: true } });
  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  res.json(tx);
}
