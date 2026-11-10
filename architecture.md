# ArdhiChain Architecture

## Core components

- **Frontend**: Next.js 15 app with Tailwind, Mapbox, wallet authentication, parcel registry, marketplace, governance, verification and admin portals.
- **Backend**: Express API with PostgreSQL via Prisma, Redis caching, IPFS upload, contract orchestration, RBAC, audit logs, and wallet-based session management.
- **Smart Contracts**: 
  - `LandRegistry.sol` for NFT-based parcel registration and ownership transfer
  - `Escrow.sol` for USDC escrow, tax deduction, and payment settlement
  - `GovernanceDAO.sol` for proposal creation, voting, and execution
  - `Dispute.sol` for dispute filing, evidence submission, and resolution
- **Storage**: IPFS for document and NFT metadata storage; PostgreSQL for relational data; Redis for session rate limiting.
- **Blockchain**: Avalanche Fuji Testnet using Hardhat and Ethers.js.

## Data flow

1. User registers land parcel in frontend.
2. Backend validates metadata, stores document hash in IPFS, and calls `registerLand` on `LandRegistry`.
3. Land NFT metadata is minted and stored on IPFS.
4. Buyers deposit USDC into `Escrow`.
5. Government officers create governance proposals to approve transfers.
6. Upon approval, escrow releases funds, tax is deducted, and registry transfers ownership.
7. Disputes can be filed and resolved through the dispute contract and admin portal.

## Security

- Role-based access control for citizens, officers, and admins
- Reentrancy protection in all payment-sensitive contracts
- Pausable contract lifecycle controls
- Audit logging for all backend actions
- Rate limiting on API endpoints
- Wallet-based authentication and signature verification
