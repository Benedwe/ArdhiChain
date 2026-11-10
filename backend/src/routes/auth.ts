import { Router } from "express";
import { requestMessage, verifyLogin } from "../controllers/authController";

const router = Router();
router.post("/request-message", requestMessage);
router.post("/verify", verifyLogin);
export default router;
