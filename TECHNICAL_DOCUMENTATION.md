# ArdhiChain Technical Documentation

## 1. Project Overview

ArdhiChain is a full-stack blockchain land-governance MVP for Tanzania. It combines a Next.js frontend, an Express/Prisma backend, PostgreSQL persistence, IPFS metadata storage, and Solidity smart contracts deployed with Hardhat for Avalanche-compatible networks.

The platform models a complete land lifecycle:

1. Citizens authenticate with an EVM wallet.
2. Land parcels are registered with location, ownership, document hash, and IPFS metadata.
3. Government officers verify or freeze parcels.
4. Buyers and sellers create marketplace transactions represented as escrow records.
5. Officers create and execute governance proposals.
6. Citizens submit disputes and evidence; officers resolve cases.
7. Admin users review audit logs and system reports.

The current repository is organized as an npm workspace monorepo:

```text
.
|-- backend/      Express API, Prisma schema, seed data, auth, IPFS and contract helpers
|-- contracts/    Solidity contracts, Hardhat config, deployment script, contract tests
|-- frontend/     Next.js app, wallet auth, dashboard pages, API client
|-- docker-compose.yml
|-- README.md
|-- architecture.md
`-- api-docs.md
```

## 2. Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 15.4, React 18.3, TypeScript, Tailwind CSS, Axios, Ethers v6, Mapbox GL, React Map GL |
| Backend | Node.js 20, Express 4, TypeScript, Prisma 5, PostgreSQL, JWT, Ethers v6, IPFS HTTP client, Zod dependency |
| Blockchain | Solidity 0.8.19/0.8.18, Hardhat, OpenZeppelin, Avalanche Fuji-compatible RPC |
| Storage | PostgreSQL for relational records, IPFS for parcel metadata/evidence references, Redis service provisioned for local infrastructure |
| Tooling | npm workspaces, ESLint, GitHub Actions CI, Docker/Docker Compose |

## 3. Workspace Scripts

Run scripts from the repository root unless noted otherwise.

| Command | Purpose |
| --- | --- |
| `npm install` | Install root and workspace dependencies. |
| `npm run dev` | Run backend and frontend together via `concurrently`. |
| `npm run build` | Build backend, build frontend, and compile contracts. |
| `npm run lint` | Run backend and frontend lint scripts. |
| `npm run test` | Run contract tests and backend test placeholder. |
| `npm --workspace backend run dev` | Run backend in TypeScript watch mode. |
| `npm --workspace backend run build` | Compile backend TypeScript into `backend/dist`. |
| `npm --workspace backend run migrate` | Run Prisma migration named `init`. |
| `npm --workspace backend run seed` | Reset and seed demo data. |
| `npm --workspace frontend run dev` | Run the Next.js development server. |
| `npm --workspace frontend run build` | Build the Next.js app. |
| `npm --workspace contracts run compile` | Compile Solidity contracts. |
| `npm --workspace contracts run test` | Run Hardhat contract tests. |
| `npm --workspace contracts run deploy:local` | Deploy contracts to local Hardhat-compatible RPC. |
| `npm --workspace contracts run deploy:fuji` | Deploy contracts to Avalanche Fuji. |

## 4. Environment Configuration

Use `.env.example` as the source template. Do not commit real secrets.

| Variable | Used By | Description |
| --- | --- | --- |
| `DATABASE_URL` | Backend, Prisma | PostgreSQL connection string. |
| `REDIS_URL` | Infrastructure | Redis URL. Redis is provisioned by Compose but not heavily used in current source. |
| `JWT_SECRET` | Backend | Secret used to sign 12-hour wallet session JWTs. |
| `IPFS_PROJECT_ID` | Backend | Optional Infura IPFS project ID. |
| `IPFS_PROJECT_SECRET` | Backend | Optional Infura IPFS project secret. |
| `AVAX_FUJI_RPC` | Backend, contracts | Avalanche Fuji RPC URL. |
| `DEPLOYER_PRIVATE_KEY` | Contracts | Private key for Fuji deployments. Present in Hardhat config, absent from `.env.example`; add it only in local/private env files. |
| `LAND_REGISTRY_ADDRESS` | Backend | Deployed `LandRegistry` address. |
| `ESCROW_ADDRESS` | Backend | Deployed `Escrow` address. |
| `GOVERNANCE_ADDRESS` | Backend | Deployed `GovernanceDAO` address. |
| `DISPUTE_ADDRESS` | Backend | Deployed `Dispute` address. |
| `USDC_ADDRESS` | Backend | Stablecoin address for escrow flows. |
| `MAPBOX_TOKEN` | Backend | Server-side Mapbox token fallback. |
| `NEXT_PUBLIC_API_URL` | Frontend | API base URL. Current frontend code defaults to `http://localhost:4000/api`; set this value to include `/api`, for example `http://localhost:4000/api`. |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Frontend | Browser-visible Mapbox token. Without it, the GIS page shows setup instructions and leaves the map disabled. |
| `PORT` | Backend | Optional backend port override. Defaults to `4000`. |

## 5. Local Development Setup

### 5.1 Prerequisites

- Node.js 20
- npm
- Docker and Docker Compose
- An EVM wallet browser extension for frontend auth testing
- Optional: Avalanche Fuji testnet AVAX for external deployments

### 5.2 Standard Local Flow

```bash
cp .env.example .env
npm install
docker compose up postgres redis
npm --workspace backend run migrate
npm --workspace backend run seed
npm --workspace contracts run compile
npm --workspace frontend run dev
```

In another terminal:

```bash
npm --workspace backend run dev
```

Default service URLs:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:4000/api` |
| Backend health | `http://localhost:4000/api/health` |
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |

### 5.3 Docker Compose Notes

`docker-compose.yml` defines `postgres`, `redis`, `backend`, and `frontend` services. The backend and frontend Dockerfiles currently live at the repository root as `Dockerfile.backend` and `Dockerfile.frontend`, while Compose sets service contexts to `./backend` and `./frontend` and references `Dockerfile.backend` / `Dockerfile.frontend` inside those contexts. As written, the database and Redis services are the most reliable Compose targets; the application service Dockerfile paths may need to be adjusted before full Compose builds are used.

## 6. System Architecture

```text
Browser / Wallet
      |
      | Next.js UI, Axios API client, Ethers wallet signatures
      v
Frontend (frontend/)
      |
      | HTTPS/JSON + Bearer JWT
      v
Backend API (backend/)
      |
      | Prisma
      v
PostgreSQL
      |
      | metadata/evidence hash references
      v
IPFS / Infura

Backend and frontend also integrate with:

Avalanche-compatible RPC
      |
      v
Solidity contracts:
LandRegistry, Escrow, GovernanceDAO, Dispute, MockUSDC
```

### 6.1 Frontend Responsibilities

- Presents the landing page, dashboard, land registry, GIS, governance, marketplace, verification, dispute, and admin screens.
- Detects browser wallet providers and supports MetaMask, Coinbase Wallet, Brave Wallet, and generic injected wallets.
- Performs wallet login by requesting a backend message, signing it, and exchanging the signature for a JWT.
- Stores session data in `localStorage` under `ardhichain_session`.
- Adds `Authorization: Bearer <token>` to API requests through the Axios interceptor in `frontend/lib/api.ts`.

### 6.2 Backend Responsibilities

- Exposes REST endpoints under `/api`.
- Verifies wallet signatures and issues JWT sessions.
- Enforces role checks for officer/admin operations.
- Persists users, parcels, transactions, proposals, votes, disputes, and audit logs through Prisma.
- Uploads parcel metadata JSON to Infura IPFS.
- Provides Ethers helpers for contract instances from Hardhat artifacts.
- Attempts an on-chain `LandRegistry.registerLand(...)` call when `LAND_REGISTRY_ADDRESS` is configured.

### 6.3 Smart Contract Responsibilities

- `LandRegistry`: ERC721 title token registry with parcel metadata, verification, freezing, transfer, and pause controls.
- `Escrow`: ERC20 stablecoin escrow with configurable tax collection and owner-controlled release/refund.
- `GovernanceDAO`: proposal creation, voting, and execution result emission.
- `Dispute`: dispute creation, evidence submission, officer resolution, and pause controls.
- `MockUSDC`: local/test ERC20 token for escrow testing.

## 7. Backend Architecture

### 7.1 Entry Points

| File | Purpose |
| --- | --- |
| `backend/src/index.ts` | Starts Express on `config.port`. |
| `backend/src/app.ts` | Configures CORS, JSON parsing, rate limiting, routes, and health check. |
| `backend/src/config.ts` | Loads `.env` from backend-local or repo-root path and exports runtime config. |

### 7.2 Middleware

| Middleware | File | Behavior |
| --- | --- | --- |
| Rate limiter | `backend/src/middleware/rateLimiter.ts` | Allows 120 requests per minute per client and returns JSON errors. |
| Authentication | `backend/src/middleware/auth.ts` | Requires a Bearer JWT and attaches `{ walletAddress, role }` to `req.user`. |
| Role guard | `backend/src/middleware/auth.ts` | `requireRole(role)` allows matching role or `ADMIN`. |

JWTs are signed with `JWT_SECRET` and expire after 12 hours.

### 7.3 API Routes

All endpoints below are prefixed with `/api`.

| Method | Path | Auth | Role | Description |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | No | Public | Returns `{ "status": "ok" }`. |
| `POST` | `/auth/request-message` | No | Public | Returns a wallet login message. |
| `POST` | `/auth/verify` | No | Public | Verifies a wallet signature, creates user if needed, returns JWT and role. |
| `GET` | `/lands` | Yes | Any | Lists parcels with owner data. |
| `POST` | `/lands` | Yes | Any | Registers a parcel, uploads metadata to IPFS, optionally calls `LandRegistry`. |
| `GET` | `/lands/:id` | Yes | Any | Gets a parcel by database UUID. |
| `POST` | `/lands/:id/verify` | Yes | `OFFICER` or `ADMIN` | Updates `verificationStatus` to request body `status`. |
| `POST` | `/lands/:id/freeze` | Yes | `OFFICER` or `ADMIN` | Sets `verificationStatus` to `Frozen`. |
| `GET` | `/transactions` | Yes | Any | Lists transactions with buyer and seller. |
| `POST` | `/transactions` | Yes | Any | Creates a pending transaction for current user as buyer. |
| `GET` | `/transactions/:id` | Yes | Any | Gets a transaction by database UUID. |
| `GET` | `/proposals` | Yes | Any | Lists proposals with votes. |
| `POST` | `/proposals` | Yes | `OFFICER` or `ADMIN` | Creates a proposal. |
| `POST` | `/proposals/:id/vote` | Yes | Any | Casts a single yes/no vote for current user. |
| `POST` | `/proposals/:id/execute` | Yes | `OFFICER` or `ADMIN` | Marks proposal `EXECUTED` when yes votes exceed no votes, otherwise `FAILED`. |
| `GET` | `/disputes` | Yes | Any | Lists disputes with parcel data. |
| `POST` | `/disputes` | Yes | Any | Creates a dispute for a parcel. |
| `POST` | `/disputes/:id/evidence` | Yes | Any | Adds evidence hash and sets status to `EVIDENCE_SUBMITTED`. |
| `POST` | `/disputes/:id/resolve` | Yes | `OFFICER` or `ADMIN` | Sets dispute to `RESOLVED` or `REJECTED`. |
| `GET` | `/admin/audit` | Yes | `ADMIN` | Lists audit logs newest first. |
| `GET` | `/admin/reports` | Yes | `ADMIN` | Returns aggregate counts. |

### 7.4 Important Request Bodies

`POST /api/auth/request-message`

```json
{
  "walletAddress": "0x..."
}
```

`POST /api/auth/verify`

```json
{
  "walletAddress": "0x...",
  "signature": "0x...",
  "message": "ArdhiChain login request: ..."
}
```

`POST /api/lands`

```json
{
  "parcelNumber": "TZ-PARCEL-0001",
  "coordinates": "-6.792354,39.208328",
  "areaSize": "2 acres",
  "ownerWallet": "0x...",
  "region": "Dar es Salaam",
  "district": "Kinondoni",
  "ward": "Mikocheni",
  "documentHash": "Qm..."
}
```

`POST /api/transactions`

```json
{
  "sellerWallet": "0x...",
  "amount": "1250.00"
}
```

`POST /api/proposals`

```json
{
  "title": "Approve district transfer batch",
  "description": "Proposal details"
}
```

`POST /api/proposals/:id/vote`

```json
{
  "vote": true
}
```

`POST /api/disputes`

```json
{
  "parcelId": "database-parcel-uuid",
  "description": "Boundary conflict details",
  "evidenceHash": "Qm..."
}
```

`POST /api/disputes/:id/resolve`

```json
{
  "approve": true
}
```

## 8. Database Model

Prisma schema: `backend/prisma/schema.prisma`.

### 8.1 Enums

| Enum | Values |
| --- | --- |
| `UserRole` | `CITIZEN`, `OFFICER`, `ADMIN` |
| `EscrowStatus` | `PENDING`, `RELEASED`, `REFUNDED`, `CANCELLED` |
| `ProposalStatus` | `OPEN`, `EXECUTED`, `FAILED` |
| `DisputeStatus` | `OPEN`, `EVIDENCE_SUBMITTED`, `RESOLVED`, `REJECTED` |

### 8.2 Tables

| Model | Key Fields | Notes |
| --- | --- | --- |
| `User` | `walletAddress`, `role`, `email`, `name` | Wallet address is unique and normalized to lowercase by auth/register flows. |
| `LandParcel` | `parcelNumber`, `coordinates`, `areaSize`, `nftTokenId`, `ownerId`, `verificationStatus`, `metadataUri`, `documentHash` | `parcelNumber` is unique; owner is optional relation to `User`. |
| `Transaction` | `buyerId`, `sellerId`, `amount`, `escrowStatus` | Amount is stored as a Prisma Decimal after converting to 6-decimal stablecoin units. |
| `Proposal` | `title`, `description`, `status` | Has many `Vote` records. |
| `Vote` | `proposalId`, `voterId`, `vote` | Controller prevents duplicate votes per proposal/user. |
| `Dispute` | `parcelId`, `status`, `evidenceHash`, `description` | References a `LandParcel`. |
| `AuditLog` | `action`, `actor`, `userId`, `metadata`, `timestamp` | Used by admin audit endpoint and seeder. |

### 8.3 Seed Data

`backend/src/seed.ts` deletes existing records and creates:

- 50 citizens
- 10 officers
- 1 admin user
- 100 parcels
- 20 proposals
- 50 transactions
- 15 disputes
- 2 audit logs

The seed script uses random wallet addresses and coordinates. Seeded credentials are wallet-based, so users need corresponding private keys only if they must authenticate as those seeded users. For ordinary local auth testing, connecting a wallet creates a `CITIZEN` automatically.

## 9. Smart Contracts

Contracts are under `contracts/contracts`.

### 9.1 LandRegistry

`LandRegistry` extends `ERC721URIStorage`, `AccessControl`, `Pausable`, and `ReentrancyGuard`.

Roles:

| Role | Purpose |
| --- | --- |
| `DEFAULT_ADMIN_ROLE` | Administers contract roles. |
| `GOVERNMENT_ROLE` | Can pause/unpause. |
| `VERIFIER_ROLE` | Can update verification status. |
| `FREEZER_ROLE` | Can freeze/unfreeze parcels. |

Primary functions:

| Function | Access | Description |
| --- | --- | --- |
| `registerLand(...)` | Public while unpaused | Mints an ERC721 token to owner and stores parcel details. |
| `verifyLand(tokenId, status)` | `VERIFIER_ROLE` | Updates verification status string. |
| `freezeLand(tokenId, frozen)` | `FREEZER_ROLE` | Sets parcel frozen flag. |
| `transferLand(tokenId, to)` | Token owner | Transfers token if parcel is not frozen. |
| `pause()` / `unpause()` | `GOVERNMENT_ROLE` | Pauses/unpauses state-changing flows. |
| `getLandDetails(tokenId)` | Public view | Returns stored parcel struct. |

Events:

- `LandRegistered`
- `LandVerified`
- `LandFrozen`
- `LandTransferred`

### 9.2 Escrow

`Escrow` holds ERC20 stablecoin funds and applies tax on release.

Configuration:

- `stablecoin`: ERC20 token address.
- `taxCollector`: address receiving tax.
- `taxRateBps`: defaults to `250`, equivalent to 2.5%.
- `setTaxRate` caps tax at 1000 bps, equivalent to 10%.

Primary functions:

| Function | Access | Description |
| --- | --- | --- |
| `depositEscrow(escrowId, seller, amount)` | Buyer | Transfers stablecoin from buyer into escrow. |
| `releaseEscrow(escrowId)` | Owner | Sends net amount to seller and tax to collector. |
| `refundEscrow(escrowId)` | Owner | Refunds buyer. |
| `collectTax(escrowId)` | Owner | Emits tax collection event after release. |
| `getEscrowDetails(escrowId)` | Public view | Returns escrow entry. |
| `pause()` / `unpause()` | Owner | Pauses/unpauses escrow operations. |

### 9.3 GovernanceDAO

`GovernanceDAO` uses role-gated proposal creation/execution and open voting.

Configuration:

- `GOVERNOR_ROLE`: may create and execute proposals.
- `requiredMajority`: defaults to `50`.
- `votingPeriod`: defaults to `3 days`.

Primary functions:

| Function | Access | Description |
| --- | --- | --- |
| `createProposal(title, description)` | `GOVERNOR_ROLE` | Creates a proposal with deadline. |
| `vote(proposalId, support)` | Public | Records one vote per address per proposal. |
| `executeProposal(proposalId)` | `GOVERNOR_ROLE` | Marks proposal executed and emits pass/fail result. |
| `pause()` / `unpause()` | `DEFAULT_ADMIN_ROLE` | Pauses/unpauses governance actions. |

### 9.4 Dispute

`Dispute` stores dispute cases and evidence hashes.

Roles:

| Role | Purpose |
| --- | --- |
| `DEFAULT_ADMIN_ROLE` | Pause/unpause and role administration. |
| `OFFICER_ROLE` | Resolve disputes and submit evidence on cases. |

Primary functions:

| Function | Access | Description |
| --- | --- | --- |
| `createDispute(parcelId, description)` | Public | Opens a case for an on-chain parcel token ID. |
| `submitEvidence(disputeId, evidenceHash)` | Filer or `OFFICER_ROLE` | Adds evidence and moves status to evidence submitted. |
| `resolveDispute(disputeId, approve)` | `OFFICER_ROLE` | Marks case resolved or rejected. |
| `pause()` / `unpause()` | `DEFAULT_ADMIN_ROLE` | Pauses/unpauses dispute actions. |

### 9.5 MockUSDC

`MockUSDC` is an ERC20 token for development and tests. It mints an initial supply to the deployer and exposes an unrestricted `mint(to, amount)` function, so it must not be used as a production stablecoin.

### 9.6 Deployment

Deployment script: `contracts/scripts/deploy.ts`.

It deploys:

1. `LandRegistry("ArdhiChain Land", "ARLC")`
2. `MockUSDC("Avalanche USD Coin", "USDC")`
3. `Escrow(mockUsdc.address, deployer.address)`
4. `GovernanceDAO(deployer.address)`
5. `Dispute(deployer.address)`

Hardhat networks:

| Network | Chain ID / URL |
| --- | --- |
| `hardhat` | Chain ID `43112` |
| `localhost` | `http://127.0.0.1:8545`, chain ID `43112` |
| `fuji` | `AVAX_FUJI_RPC`, accounts from `DEPLOYER_PRIVATE_KEY` |

## 10. Frontend Architecture

### 10.1 App Structure

| Path | Purpose |
| --- | --- |
| `frontend/app/layout.tsx` | Global layout, nav, wallet provider, connect wallet control. |
| `frontend/app/page.tsx` | Landing page. |
| `frontend/app/dashboard/page.tsx` | Main dashboard view. |
| `frontend/app/land-registry/page.tsx` | Parcel registration/registry experience. |
| `frontend/app/gis/page.tsx` | GIS parcel map experience. |
| `frontend/app/governance/page.tsx` | Governance proposals and voting. |
| `frontend/app/marketplace/page.tsx` | Transaction/marketplace experience. |
| `frontend/app/verification/page.tsx` | Parcel verification screen. |
| `frontend/app/disputes/page.tsx` | Dispute workflows. |
| `frontend/app/admin/page.tsx` | Admin reporting/audit area. |
| `frontend/app/components/WalletProvider.tsx` | Wallet auth state and session lifecycle. |
| `frontend/app/components/ConnectWallet.tsx` | Wallet connection UI. |
| `frontend/lib/api.ts` | Axios client and auth header interceptors. |
| `frontend/lib/ethers.ts` | Wallet provider detection, connection, signing, listeners. |

### 10.2 Wallet Login Flow

1. User chooses a wallet provider through the UI.
2. `connectWallet(type)` requests accounts through the injected EIP-1193 provider.
3. Frontend calls `POST /api/auth/request-message` with the wallet address.
4. User signs the returned message.
5. Frontend calls `POST /api/auth/verify` with wallet address, message, and signature.
6. Backend verifies the signature and creates a user if one does not exist.
7. Backend returns a JWT and `{ walletAddress, role }`.
8. Frontend stores `{ address, token, user }` in `localStorage`.
9. Axios attaches the JWT to later requests.

### 10.3 API Client Behavior

The Axios base URL is:

```ts
process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
```

Set `NEXT_PUBLIC_API_URL` to a value that includes `/api`. The `.env.example` currently shows `http://localhost:4000`; with the present frontend client, that value would target `/auth/...` instead of `/api/auth/...`.

On `401` responses, the client clears the stored session.

## 11. Main Business Workflows

### 11.1 Parcel Registration

1. Authenticated user submits parcel details.
2. Backend validates required fields.
3. Backend constructs metadata with parcel, owner, location, verification status, document hash, and timestamp.
4. Metadata JSON is uploaded to IPFS through `uploadJson`.
5. Owner user is upserted by wallet address.
6. `LandParcel` row is created with status `Pending`.
7. If `LAND_REGISTRY_ADDRESS` is configured, backend attempts `LandRegistry.registerLand(...)`.
8. Backend returns the database parcel.

Current limitation: if the optional contract call fails, the backend logs a warning but still returns the database parcel.

### 11.2 Verification And Freezing

1. Officer/admin calls `/api/lands/:id/verify` with a `status`.
2. Backend updates only the database `verificationStatus`.
3. Officer/admin can call `/api/lands/:id/freeze`; backend sets `verificationStatus` to `Frozen`.

Current limitation: backend verification/freeze endpoints do not call `verifyLand` or `freezeLand` on the smart contract.

### 11.3 Marketplace Transaction

1. Authenticated buyer calls `/api/transactions`.
2. Backend loads buyer from JWT wallet.
3. Seller is upserted by wallet.
4. Amount is converted with `ethers.parseUnits(amount, 6)`.
5. Database transaction is created as `PENDING`.

Current limitation: backend transaction creation does not call `Escrow.depositEscrow`; on-chain escrow must be integrated separately.

### 11.4 Governance

1. Officer/admin creates a proposal.
2. Authenticated users vote once per proposal.
3. Officer/admin executes proposal.
4. Backend compares yes and no vote counts.
5. Status becomes `EXECUTED` if yes votes are greater than no votes; otherwise `FAILED`.

Current limitation: backend governance endpoints do not call the `GovernanceDAO` contract and do not enforce time-based voting windows.

### 11.5 Disputes

1. Authenticated user files a dispute for a database parcel ID.
2. User submits evidence hash.
3. Officer/admin resolves with `approve: true` or `approve: false`.
4. Status becomes `RESOLVED` or `REJECTED`.

Current limitation: backend dispute endpoints do not call the `Dispute` contract.

## 12. Security Model

### 12.1 Implemented Controls

- Wallet signature verification using `ethers.verifyMessage`.
- JWT sessions with 12-hour expiration.
- Bearer token authentication on all domain routes.
- Role guard for officer/admin actions.
- Express JSON body parsing and CORS.
- Rate limiting at 120 requests per minute.
- Solidity `Pausable` controls on all main contracts.
- Solidity `ReentrancyGuard` on payment-sensitive or transfer-sensitive contract functions.
- OpenZeppelin access control/ownership primitives.

### 12.2 Important Security Considerations

- `JWT_SECRET` must be strong and environment-specific.
- `MockUSDC` has unrestricted minting and is for local/test use only.
- The backend currently does not enforce ownership checks for several read/list operations; any authenticated user can list broad data sets.
- Role changes are not exposed through the API; users created through wallet auth default to `CITIZEN`.
- Officer/admin testing requires database role updates or seeded users with usable wallets.
- `request-message` does not persist a nonce server-side. Replay resistance should be strengthened before production.
- IPFS credentials are optional; if omitted, uploads use the configured Infura endpoint without auth headers.
- Contract write operations require a signer; current backend `getContract` defaults to a provider unless a signer is explicitly passed.
- Contract artifacts path in `backend/src/utils/contractClient.ts` resolves relative to backend build/runtime location and may require deployment packaging adjustments.

## 13. Testing And CI

### 13.1 Local Checks

```bash
npm --workspace contracts run test
npm --workspace backend run build
npm --workspace frontend run build
npm --workspace contracts run compile
npm run lint
```

Backend tests are currently a placeholder:

```bash
npm --workspace backend run test
```

prints `No backend tests configured yet`.

### 13.2 Contract Tests

Contract test files:

- `contracts/test/landRegistry.test.ts`
- `contracts/test/escrow.test.ts`
- `contracts/test/governance.test.ts`
- `contracts/test/dispute.test.ts`

These validate core smart contract behavior through Hardhat.

### 13.3 CI Workflow

GitHub Actions workflow: `.github/workflows/ci.yml`.

It runs on pushes and pull requests to `main`:

1. Checkout
2. Setup Node.js 20
3. `npm install`
4. Backend build
5. Frontend build
6. Contract compile
7. Contract tests

## 14. Deployment Guide

### 14.1 Backend Deployment

1. Provision PostgreSQL.
2. Set backend environment variables.
3. Run Prisma migrations.
4. Build backend:

```bash
npm --workspace backend run build
```

5. Start:

```bash
npm --workspace backend start
```

6. Confirm:

```bash
curl http://localhost:4000/api/health
```

### 14.2 Frontend Deployment

1. Set `NEXT_PUBLIC_API_URL` to the deployed API base including `/api`.
2. Set `NEXT_PUBLIC_MAPBOX_TOKEN` if GIS views require Mapbox.
3. Build:

```bash
npm --workspace frontend run build
```

4. Start:

```bash
npm --workspace frontend start
```

### 14.3 Contract Deployment To Fuji

1. Add `DEPLOYER_PRIVATE_KEY` and `AVAX_FUJI_RPC` to the environment.
2. Fund the deployer with Fuji test AVAX.
3. Compile:

```bash
npm --workspace contracts run compile
```

4. Deploy:

```bash
npm --workspace contracts run deploy:fuji
```

5. Copy emitted contract addresses into backend environment variables.
6. Restart backend.

## 15. Known Gaps And Implementation Notes

These are useful for maintainers planning the next hardening pass:

- Docker Compose application service paths likely need adjustment because Dockerfiles are at the repository root.
- `.env.example` should include `DEPLOYER_PRIVATE_KEY` if Fuji deployment is part of the standard workflow.
- `.env.example` currently sets `NEXT_PUBLIC_API_URL=http://localhost:4000`, while the frontend expects the base URL to include `/api`.
- Backend write routes for verification, freeze, escrow, governance, and disputes mostly update PostgreSQL only; contract orchestration is incomplete beyond parcel registration.
- `LandRegistry.registerLand` is public on-chain; if only authorized registrars should mint titles, add role gating.
- Backend does not persist login nonces, so signed login messages are not invalidated after use.
- Backend has no real automated tests yet.
- Admin/officer role management has no API surface.
- Contract artifacts may not be available to the built backend unless copied into the backend runtime image/package.
- `Redis` is configured as infrastructure but no Redis client usage appears in the current backend source.

## 16. Maintainer Checklist

Before a production or public demo release:

1. Fix `NEXT_PUBLIC_API_URL` and Docker Compose path inconsistencies.
2. Add backend route tests for auth, role enforcement, and core CRUD flows.
3. Add server-side nonce storage for wallet login.
4. Decide which backend workflows must be authoritative on-chain and add signer-backed contract calls.
5. Add migration files and a repeatable database deployment process.
6. Add role-management tooling for officers/admins.
7. Confirm Mapbox and IPFS credentials in each environment.
8. Replace `MockUSDC` with an intended network token for non-local deployments.
9. Audit contract permissions and upgrade strategy.
10. Ensure generated contract artifacts are available wherever backend contract clients run.
