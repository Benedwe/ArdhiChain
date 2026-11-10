import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { getAuditLogs, getReports } from "../controllers/adminController";

const router = Router();
router.get("/audit", authenticate, requireRole("ADMIN"), getAuditLogs);
router.get("/reports", authenticate, requireRole("ADMIN"), getReports);
export default router;
