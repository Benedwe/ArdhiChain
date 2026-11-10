import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { listDisputes, createDispute, submitEvidence, resolveDispute } from "../controllers/disputeController";

const router = Router();
router.get("/", authenticate, listDisputes);
router.post("/", authenticate, createDispute);
router.post("/:id/evidence", authenticate, submitEvidence);
router.post("/:id/resolve", authenticate, requireRole("OFFICER"), resolveDispute);
export default router;
