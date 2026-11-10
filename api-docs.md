# ArdhiChain API Documentation

## Authentication

### POST /api/auth/request-message
Request a login message to sign.

### POST /api/auth/verify
Verify wallet signature and issue session token.

## Land registry

### GET /api/lands
List registered parcels.

### POST /api/lands
Register a new parcel and upload document metadata.

### GET /api/lands/:id
Get land parcel details.

### POST /api/lands/:id/verify
Approve land verification (government role).

### POST /api/lands/:id/freeze
Freeze a parcel pending dispute.

## Marketplace

### POST /api/transactions
Create a purchase transaction and initialize escrow deposit.

### GET /api/transactions
List transactions.

### GET /api/transactions/:id
Get escrow status.

## Governance

### GET /api/proposals
List governance proposals.

### POST /api/proposals
Create a governance proposal.

### POST /api/proposals/:id/vote
Vote on a proposal.

### POST /api/proposals/:id/execute
Execute a passed proposal.

## Disputes

### GET /api/disputes
List disputes.

### POST /api/disputes
File a dispute for a parcel.

### POST /api/disputes/:id/evidence
Upload dispute evidence.

### POST /api/disputes/:id/resolve
Resolve a dispute as an officer.

## Admin

### GET /api/admin/audit
Audit log entries.

### GET /api/admin/reports
Governance and dispute summary.
