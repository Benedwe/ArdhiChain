import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const rootEnv = path.resolve(process.cwd(), "../.env");
const localEnv = path.resolve(process.cwd(), ".env");
const envPath = fs.existsSync(localEnv) ? localEnv : rootEnv;

dotenv.config({ path: envPath });

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "changeme",
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ardhichain",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  providerUrl: process.env.AVAX_FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc",
  contractAddresses: {
    landRegistry: process.env.LAND_REGISTRY_ADDRESS || "",
    escrow: process.env.ESCROW_ADDRESS || "",
    governance: process.env.GOVERNANCE_ADDRESS || "",
    dispute: process.env.DISPUTE_ADDRESS || ""
  },
  usdcAddress: process.env.USDC_ADDRESS || "",
  mapboxToken: process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""
};
