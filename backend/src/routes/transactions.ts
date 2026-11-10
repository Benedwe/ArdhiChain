import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { listTransactions, createTransaction, getTransaction } from "../controllers/transactionController";

const router = Router();
router.get("/", authenticate, listTransactions);
router.post("/", authenticate, createTransaction);
router.get("/:id", authenticate, getTransaction);
export default router;
