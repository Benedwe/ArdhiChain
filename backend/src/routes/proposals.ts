import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { listProposals, createProposal, voteProposal, executeProposal } from "../controllers/proposalController";

const router = Router();
router.get("/", authenticate, listProposals);
router.post("/", authenticate, requireRole("OFFICER"), createProposal);
router.post("/:id/vote", authenticate, voteProposal);
router.post("/:id/execute", authenticate, requireRole("OFFICER"), executeProposal);
export default router;
