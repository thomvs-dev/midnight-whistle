# Midnight Whistle

**Anonymous Whistleblower Verification on the Midnight Network**

Employees can report organizational misconduct with Zero-Knowledge proofs. They prove they are legitimate insiders without ever revealing their identity. Investigators verify report severity, financial impact, and corroboration — all without compromising the source.

## Why This Matters

Traditional whistleblower systems have a fatal flaw: metadata leaks. Even "anonymous" tip lines can be traced through access logs, IP addresses, and timing analysis. Midnight Whistle eliminates this entirely by using Zero-Knowledge Proofs — the organization can verify a report came from a real insider, but **cannot determine which insider filed it**.

## Architecture

```
midnight-whistle/
├── contract/           # Compact ZK smart contract
│   ├── src/
│   │   ├── whistle.compact       # 7 ZK circuits
│   │   ├── witnesses.ts          # Private state types
│   │   ├── index.ts              # Contract exports
│   │   └── test/                 # Vitest test suite
│   └── package.json
├── cli/                # Node.js CLI for blockchain interaction
│   ├── src/
│   │   ├── api.ts                # Contract deployment & circuits
│   │   ├── index.ts              # Interactive CLI
│   │   ├── config.ts             # Network configs
│   │   └── common-types.ts       # TypeScript types
│   └── package.json
├── frontend/           # React + Vite + Tailwind DApp
│   ├── src/
│   │   ├── App.tsx               # Whistleblower + Investigator UI
│   │   ├── main.tsx              # React entry point
│   │   └── index.css             # Tailwind theme (amber/dark)
│   └── package.json
├── docker-compose.yml  # Local Midnight infrastructure
└── package.json        # Root workspace
```

## ZK Circuits

| Circuit | Purpose | What Verifier Learns |
|---------|---------|---------------------|
| `register_membership` | Anchor org membership commitment | Only that a commitment exists |
| `prove_membership` | Prove you're an org member | PASS/FAIL (not who you are) |
| `submit_report` | Submit anonymous report hash | Report hash + membership verified |
| `prove_severity` | Prove severity >= threshold | PASS/FAIL (not actual severity) |
| `prove_financial_impact` | Prove impact >= threshold | PASS/FAIL (not actual amount) |
| `prove_witness_count` | Prove witnesses >= minimum | PASS/FAIL (not actual count) |
| `verify_report` | Check if report hash exists | Hash match result |

## Quick Start

### 1. Start Local Infrastructure

```bash
docker compose up -d
```

This spins up:
- **Midnight Node** (port 9944) — Local blockchain
- **Standalone Indexer** (port 8088) — Transaction indexer
- **Proof Server** (port 6300) — ZK proof generation

### 2. Compile the Contract

```bash
cd contract
npm install
npm run compact    # Compile .compact → ZK circuits
npm run build      # TypeScript build
npm run test       # Run test suite
```

### 3. Run the CLI

```bash
cd cli
npm install
npm run build
npm run start
```

### 4. Launch the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — the DApp runs in simulation mode when the Midnight Lace wallet extension is not detected.

## How It Works

### Whistleblower Flow

1. **Register** — Enter your employee credentials (processed locally, never transmitted)
2. **Report** — Select category, describe misconduct, rate severity
3. **Commit** — Your report is SHA-256 hashed; only the hash goes on-chain
4. **Publish** — ZK proof verifies your membership + anchors the report

### Investigator Flow

1. **Receive** — Get the report hash from the anonymous source
2. **Select** — Choose what to verify (severity, financial impact, witnesses)
3. **Set Threshold** — Define minimum acceptable values
4. **Verify** — The ZK proof returns PASS/FAIL without revealing actual values

## Privacy Guarantees

- **Employee ID** → Hashed into commitment, never stored
- **Report content** → Hashed locally, only fingerprint on-chain
- **Severity/Impact/Witnesses** → Range proofs reveal only pass/fail
- **Identity linkage** → Cryptographically impossible to link reports to individuals

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Compact (ZK circuit language) |
| Runtime | `@midnight-ntwrk/compact-runtime` 0.14.0 |
| Blockchain | Midnight Network (local/preprod) |
| CLI | TypeScript + Midnight JS SDK |
| Frontend | React 18 + Vite + Tailwind CSS 4 |
| Testing | Vitest + Compact Simulator |

## License

Apache-2.0
