# ArdhiChain Tanzania

ArdhiChain Tanzania is a production-grade MVP for blockchain-enabled land governance built for Avalanche Fuji Testnet.

## Overview

This repo includes:

- `contracts/` — Solidity smart contracts for land registry, escrow, governance, and disputes
- `backend/` — Express API, PostgreSQL, Redis, Prisma, IPFS metadata, authentication
- `frontend/` — Next.js 15, TypeScript, Tailwind, Mapbox GIS dashboard
- `docker-compose.yml` — Local developer environment with PostgreSQL and Redis

## Quick Start

1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Start local services: `docker-compose up --build`
4. Deploy contracts: `npm --workspace contracts run deploy:local`
5. Run seed: `npm --workspace backend run seed`
6. Start frontend: `npm --workspace frontend run dev`

## Architecture

See `architecture.md` for the system diagram and integration details.

## Technical Documentation

See `TECHNICAL_DOCUMENTATION.md` for the complete developer reference covering setup, architecture, API routes, database models, smart contracts, frontend flows, deployment, security notes, testing, and known implementation gaps.

## Contacts

Designed for Avalanche Hackathon judges, Tanzanian land authorities, investors, NGOs, and government agencies.
# ArdhiChain
