import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import landsRouter from "./routes/lands";
import proposalsRouter from "./routes/proposals";
import disputesRouter from "./routes/disputes";
import transactionsRouter from "./routes/transactions";
import adminRouter from "./routes/admin";
import { apiLimiter } from "./middleware/rateLimiter";

const app = express();
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.use("/api/auth", authRouter);
app.use("/api/lands", landsRouter);
app.use("/api/proposals", proposalsRouter);
app.use("/api/disputes", disputesRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

export default app;
