import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import { issueToken } from "../middleware/auth";
import { log } from "../utils/logger";

const prisma = new PrismaClient();

export async function requestMessage(req: Request, res: Response) {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ error: "walletAddress is required" });

  const message = `ArdhiChain login request: ${walletAddress}:${Date.now()}`;
  res.json({ message });
}

export async function verifyLogin(req: Request, res: Response) {
  const { walletAddress, signature, message } = req.body;
  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: "walletAddress, signature and message are required" });
  }

  try {
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Signature mismatch" });
    }

    const normalized = walletAddress.toLowerCase();
    let user = await prisma.user.findUnique({ where: { walletAddress: normalized } });
    if (!user) {
      user = await prisma.user.create({ data: { walletAddress: normalized, role: "CITIZEN" } });
    }

    const token = issueToken({ walletAddress: normalized, role: user.role });
    log.info("Authenticated wallet", normalized);
    res.json({ token, user: { walletAddress: normalized, role: user.role } });
  } catch (error) {
    log.error(error);
    res.status(401).json({ error: "Unable to verify signature" });
  }
}
