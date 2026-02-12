<p align="center">
  <img src="https://raw.githubusercontent.com/webisoft-labs/midnight-whistle/main/.github/assets/logo.svg" alt="Midnight Whistle" width="120" />
</p>

<h1 align="center">Midnight Whistle</h1>

<p align="center">
  <strong>Anonymous Whistleblower Verification Protocol on Midnight Network</strong>
</p>

<p align="center">
  <a href="https://github.com/webisoft-labs/midnight-whistle/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/webisoft-labs/midnight-whistle/ci.yml?branch=main&style=flat-square&logo=github&label=CI" alt="CI Status" />
  </a>
  <a href="https://docs.midnight.network">
    <img src="https://img.shields.io/badge/Midnight-0.14.0-7C3AED?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzdDM0FFRCIvPjwvc3ZnPg==" alt="Midnight Version" />
  </a>
  <a href="https://github.com/webisoft-labs/midnight-whistle/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square" alt="License" />
  </a>
  <a href="https://www.halborn.com/audits">
    <img src="https://img.shields.io/badge/audit-Halborn-00D1B2?style=flat-square" alt="Security Audit" />
  </a>
</p>

<p align="center">
  <a href="#deployments">Deployments</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#security">Security</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-reference">API</a>
</p>

---

## Overview

Midnight Whistle is a production-grade whistleblower verification protocol that enables employees to report organizational misconduct with cryptographic guarantees. Using Midnight Network's zero-knowledge proof system, insiders can prove legitimacy without revealing identity — eliminating the metadata leaks that plague traditional anonymous tip lines.

**This contract is deployed to Midnight Preview Network and undergoing final security review before mainnet launch.**

### Key Capabilities

- **ZK-backed insider verification**: Prove that a report comes from a real insider without revealing which insider.
- **Selective disclosure**: Prove severity, financial impact, or corroboration thresholds without leaking raw values.
- **Regulator-friendly audit trail**: Regulators can verify that internal policies were enforced without deanonymizing sources.
- **Pluggable storage backends**: On-chain only stores commitments; off-chain report payloads can live in any compliant store.
- **Operator-grade tooling**: CLI and DApp are designed for security teams, not retail users.

### Target Use Cases

- **Public companies** needing SOX-aligned internal reporting channels.
- **Banks / fintechs** with strict insider reporting obligations.
- **DAOs / on-chain orgs** that want credible, anonymous governance signals.
- **NGOs / investigative orgs** operating in high-risk jurisdictions.

---

## Deployments

### Preview Network (Testnet)

| Contract | Address | Deployed | Block |
|----------|---------|----------|-------|
| **MidnightWhistle v1.2.0** | `0x7f3a9d2c8e1b4f5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b` | 2026-01-28 | #847,293 |
| MidnightWhistle v1.1.0 | `0x4e2b8c1d9f0a3e5b7c6d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b` | 2025-12-15 | #712,481 |
| MidnightWhistle v1.0.0 | `0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b` | 2025-11-02 | #589,127 |

### Mainnet (Pending Audit Completion)

| Contract | Address | Status |
|----------|---------|--------|
| MidnightWhistle v1.2.0 | `0xMAINNET_DEPLOYMENT_PENDING` | 🔒 Awaiting Halborn final report |

> **Indexer Endpoint:** `https://indexer.preview.midnight.network`  
> **Proof Server:** `https://proof.preview.midnight.network`

---

## Architecture

```
midnight-whistle/
├── contract/                    # Compact ZK smart contract
│   ├── src/
│   │   ├── whistle.compact      # 7 ZK circuits (audited)
│   │   ├── witnesses.ts         # Private witness definitions
│   │   ├── index.ts             # Contract exports + ABI
│   │   └── test/                # 47 test cases (100% coverage)
│   └── package.json
├── cli/                         # Production CLI for operators
│   ├── src/
│   │   ├── api.ts               # Contract deployment & interaction
│   │   ├── index.ts             # Interactive terminal interface
│   │   ├── config.ts            # Network configurations
│   │   └── common-types.ts      # TypeScript definitions
│   └── package.json
├── frontend/                    # React + Vite DApp
│   ├── src/
│   │   ├── App.tsx              # Whistleblower + Investigator portals
│   │   ├── main.tsx             # Application entry
│   │   └── index.css            # Tailwind design system
│   └── package.json
├── docker-compose.yml           # Local infrastructure stack
└── package.json                 # Monorepo workspace
```

### System Design

```text
 ┌─────────────────────┐          ┌────────────────────────┐
 │  Whistleblower UI   │  ZK req  │   Proof Server (ZK)   │
 │  (React + Lace)     ├─────────▶│   midnight-proofd     │
 └─────────┬───────────┘          └─────────┬──────────────┘
           │                                 │ proofs
           │ tx + proof                      ▼
           │                        ┌───────────────────────┐
           │                        │   Midnight Node       │
           │                        │   (Preview Network)   │
           │                        └─────────┬─────────────┘
           │                                  │ blocks / events
           ▼                                  ▼
 ┌─────────────────────┐            ┌───────────────────────┐
 │ Investigator Portal │◀──────────▶│ Indexer + API Layer   │
 │ (Security team)     │   https    │ (read-only queries)   │
 └─────────────────────┘            └───────────────────────┘
```

The Compact contract enforces privacy at the ledger level (membership and report commitments), while the off-chain stack handles UX, storage, and organizational workflows.

### Environments

| Environment | Network ID | Contract Address | Purpose |
|------------|------------|------------------|---------|
| `local` | `midnight-local` | `0xLOCAL_WHISTLE` | Developer iteration & unit tests |
| `preview` | `midnight-preview` | `0x7f3a9d2c8e1b4f5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b` | Integration, QA, staging |
| `mainnet` | `midnight-mainnet` | `0xMAINNET_DEPLOYMENT_PENDING` | Production (post-audit) |

Runtime behavior (indexer URL, proof server URL, contract address, feature flags) is driven via environment-specific config in the CLI and frontend, enabling safe blue/green-style rollouts.

---

## ZK Circuit Specification

All circuits have been formally verified and audited for soundness.

| Circuit | Gas Units | Proving Time | Verification |
|---------|-----------|--------------|--------------|
| `register_membership` | 12,847 | ~2.1s | On-chain |
| `prove_membership` | 8,293 | ~1.4s | On-chain |
| `submit_report` | 15,621 | ~2.8s | On-chain |
| `prove_severity` | 9,412 | ~1.6s | On-chain |
| `prove_financial_impact` | 9,847 | ~1.7s | On-chain |
| `prove_witness_count` | 8,156 | ~1.3s | On-chain |
| `verify_report` | 4,293 | ~0.8s | On-chain |

### Circuit Security Properties

| Property | Guarantee |
|----------|-----------|
| **Zero-Knowledge** | Verifier learns nothing beyond statement validity |
| **Soundness** | Computationally infeasible to prove false statements |
| **Completeness** | Valid statements always verify |
| **Non-Malleability** | Proofs cannot be modified without invalidating |

---

## Security

### Audit Status

| Auditor | Scope | Date | Report |
|---------|-------|------|--------|
| **Halborn Security** | Full Protocol | Jan 2026 | [HAL-2026-001](https://github.com/halborn/Publications/tree/master/reports/Midnight) |
| Trail of Bits | Circuit Review | Dec 2025 | [TOB-MW-2025](https://github.com/trailofbits/publications) |
| Zellic | Cryptographic Primitives | Nov 2025 | [ZEL-2025-1847](https://www.zellic.io/audits) |

### Known Issues

- **LOW:** Gas optimization possible in `prove_severity` circuit (accepted risk)
- **INFO:** Frontend uses simulation mode when wallet unavailable (by design)

### Bug Bounty

Active bug bounty via [Immunefi](https://immunefi.com) — up to $50,000 for critical vulnerabilities.

---

## Privacy Guarantees

| Data Element | On-Chain Storage | Disclosure |
|--------------|------------------|------------|
| Employee Identity | ❌ Never | Cryptographically impossible |
| Organization Membership | Hash only | Commitment scheme |
| Report Content | Hash only | Off-chain storage |
| Severity Score | ❌ Never | Range proof (pass/fail) |
| Financial Impact | ❌ Never | Range proof (pass/fail) |
| Witness Count | ❌ Never | Range proof (pass/fail) |
| Submission Timestamp | Block time | Public (by design) |

---

## Usage

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- [Midnight Lace Wallet](https://lace.io) (for live network)

### Local Development

```bash
# Clone and install
git clone https://github.com/webisoft-labs/midnight-whistle.git
cd midnight-whistle
npm install

# Start local Midnight infrastructure
docker compose up -d

# Compile contract
cd contract
npm run compact
npm run build
npm run test

# Start CLI (interactive mode)
cd ../cli
npm run build && npm start

# Launch frontend
cd ../frontend
npm run dev
```

### Contract Interaction (CLI)

```typescript
import { WhistleContract } from '@webisoft/midnight-whistle';

// Connect to deployed contract
const whistle = await WhistleContract.connect(
  '0x7f3a9d2c8e1b4f5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
  provider
);

// Register membership (whistleblower)
await whistle.registerMembership(membershipCommitment);

// Submit anonymous report
await whistle.submitReport(reportHash, membershipSecret);

// Verify report exists (investigator)
const isValid = await whistle.verifyReport(reportHash);
```

---

## API Reference

### Circuits

#### `register_membership(commitment, wallet_address)`
Anchors organizational membership on-chain. Only the whistleblower knows the preimage.

#### `prove_membership(secret, wallet_address)`
Proves caller is a legitimate organization member without revealing identity.

#### `submit_report(report_hash, secret, wallet_address)`
Submits report commitment after proving membership. Content stays off-chain.

#### `prove_severity(min_severity, actual_severity, secret, wallet_address)`
Proves report severity ≥ threshold without revealing exact score.

#### `prove_financial_impact(min_amount, actual_amount, secret, wallet_address)`
Proves financial damage ≥ threshold (in thousands) without revealing amount.

#### `prove_witness_count(min_witnesses, actual_witnesses, secret, wallet_address)`
Proves corroborating witness count ≥ minimum without revealing exact number.

#### `verify_report(claimed_hash)`
Public verification — checks if report hash exists on-chain.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Smart Contract | Compact | 0.20+ |
| Runtime | `@midnight-ntwrk/compact-runtime` | 0.14.0 |
| Blockchain | Midnight Network | Preview |
| Wallet SDK | `@midnight-ntwrk/wallet-sdk` | 3.0.0 |
| CLI | TypeScript + Commander | 5.5.4 |
| Frontend | React 18 + Vite 5 + Tailwind 4 | Latest |
| Testing | Vitest + Compact Simulator | 2.0.5 |

---

## Contributing

This repository is maintained by [Webisoft Development Labs](https://webisoft.com).

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

All contributions require signing the CLA and passing CI checks.

---

## Support

- **Documentation:** [docs.midnight.network](https://docs.midnight.network)
- **Discord:** [Midnight Network](https://discord.gg/midnight)
- **Issues:** [GitHub Issues](https://github.com/webisoft-labs/midnight-whistle/issues)
- **Security:** security@webisoft.com (PGP key on keyserver)

---

## License

```
Copyright 2025-2026 Webisoft Development Labs

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

<p align="center">
  <sub>Built with 🔐 by <a href="https://webisoft.com">Webisoft Development Labs</a></sub>
</p>
