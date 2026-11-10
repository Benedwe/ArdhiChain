import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { listParcels, registerParcel, getParcel, verifyParcel, freezeParcel } from "../controllers/landController";

const router = Router();
router.get("/", authenticate, listParcels);
router.post("/", authenticate, registerParcel);
router.get("/:id", authenticate, getParcel);
router.post("/:id/verify", authenticate, requireRole("OFFICER"), verifyParcel);
router.post("/:id/freeze", authenticate, requireRole("OFFICER"), freezeParcel);
export default router;
