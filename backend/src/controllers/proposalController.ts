import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listProposals(req: Request, res: Response) {
  const proposals = await prisma.proposal.findMany({ include: { votes: true } });
  res.json(proposals);
}

export async function createProposal(req: Request, res: Response) {
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ error: "Title and description are required" });

  const proposal = await prisma.proposal.create({ data: { title, description } });
  res.json(proposal);
}

export async function voteProposal(req: Request, res: Response) {
  const { id } = req.params;
  const { vote } = req.body;
  if (vote === undefined) return res.status(400).json({ error: "Vote is required" });

  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) return res.status(404).json({ error: "Proposal not found" });

  const user = await prisma.user.findUnique({ where: { walletAddress: req.user!.walletAddress } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const existing = await prisma.vote.findFirst({ where: { proposalId: id, voterId: user.id } });
  if (existing) return res.status(400).json({ error: "Already voted" });

  const voteRecord = await prisma.vote.create({ data: { proposalId: id, voterId: user.id, vote } });
  res.json(voteRecord);
}

export async function executeProposal(req: Request, res: Response) {
  const { id } = req.params;
  const proposal = await prisma.proposal.findUnique({ where: { id }, include: { votes: true } });
  if (!proposal) return res.status(404).json({ error: "Proposal not found" });
  if (proposal.status !== "OPEN") return res.status(400).json({ error: "Proposal closed" });

  const yes = proposal.votes.filter((vote) => vote.vote).length;
  const no = proposal.votes.filter((vote) => !vote.vote).length;
  const passed = yes > no;

  const status = passed ? "EXECUTED" : "FAILED";
  const updated = await prisma.proposal.update({ where: { id }, data: { status } });
  res.json({ ...updated, passed });
}
