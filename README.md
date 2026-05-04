# Sovereign Agent Keys (SAK)

> **AI agents with cryptographic sovereignty on the 0G Galileo Testnet**

[![Network](https://img.shields.io/badge/Network-0G%20Galileo%20Testnet-blue)](https://chainscan-galileo.0g.ai)
[![Chain ID](https://img.shields.io/badge/Chain%20ID-16602-green)](https://evmrpc-testnet.0g.ai)
[![ZK-SNARK](https://img.shields.io/badge/ZK%20Prover-Groth16%20%2F%20Circom%202.0-orange)](https://github.com/iden3/snarkjs)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## What Is This?

Every AI agent managing crypto today stores its private key in a `.env` file on someone's laptop. One compromised server = total loss.

**Sovereign Agent Keys fixes this:**

- 🔐 **Key Sharding** — The agent's private key is split into 3 pieces (Shamir 2-of-3). No single party can reconstruct it.
- 🛡️ **ZK-Enforced Rules** — Every transaction must pass a Groth16 proof on-chain before it can settle. The agent physically can't break its own rules.
- 🧠 **Immutable Memory** — Every decision the agent makes is permanently logged to 0G DA. Full audit trail, forever.
- ⛓️ **On-Chain Identity** — Agents are registered in a smart contract with their public key and constitution hash. Not just anonymous wallets.

Built for the **0G Labs APAC Hackathon (Akon's Quest)**.

---

## Pipeline Status — 100% Real ✅

Every step below produces a **real, verifiable transaction** on 0G Galileo Testnet.

| Step | What Happens | Status |
|---|---|---|
| 1. Key Sharding | Agent private key split via Shamir 2-of-3, shard uploaded to 0G Storage | ✅ Real TX |
| 2. Agent Registration | Agent identity registered in AgentRegistry contract | ✅ Real TX |
| 3. ZK Proof | Groth16 proof generated (~1.5s) and verified locally | ✅ Real Proof |
| 4. DA Memory Log | Raw intent uploaded to 0G Data Availability | ✅ Real TX |
| 5. Settlement | `AgentRegistry.logIntent()` called with ZK proof — verified on-chain by Verifier contract | ✅ Real TX |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Mission Control (Next.js)                       │
│              Spawn agents • Monitor fleet • View logs               │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ API calls
┌──────────────────────────────▼──────────────────────────────────────┐
│                     AI Orchestrator (TypeScript)                     │
│         Generates MPC shards • Builds intents • Calls prover        │
├──────────────┬───────────────┬───────────────┬──────────────────────┤
│  0G Storage  │    0G DA      │  ZK Engine    │   0G Chain (EVM)     │
│  Key shards  │  Agent memory │  Groth16 proof│   AgentRegistry      │
│  (Turbo idx) │  (immutable)  │  (snarkjs)    │   + Verifier.sol     │
└──────────────┴───────────────┴───────────────┴──────────────────────┘
```

| Module | Stack | Role |
|---|---|---|
| `contracts/` | Solidity 0.8.24 + Hardhat | AgentRegistry + Groth16 Verifier on 0G EVM |
| `zk-engine/` | Circom 2.0 + snarkjs | ZK circuit enforcing agent constitution rules |
| `ai-orchestrator/` | TypeScript + `@0gfoundation/0g-ts-sdk` | Agent brain: MPC, storage, DA, proving |
| `mission-control/` | Next.js 16 + Tailwind CSS v4 | Operator dashboard with real-time telemetry |

---

## Repository Structure

```
OGsovergienkey/
├── contracts/                   # Solidity smart contracts
│   ├── contracts/
│   │   ├── AgentRegistry.sol    # Core registry + intent logger
│   │   ├── Verifier.sol         # Groth16 Verifier (from circom export)
│   │   └── interfaces/
│   │       └── IZKVerifier.sol
│   ├── scripts/deploy.ts        # Deployment script
│   └── hardhat.config.ts
├── zk-engine/                   # ZK Proving
│   ├── circuits/
│   │   ├── constitution.circom  # The ZK circuit (spend limit + whitelist)
│   │   ├── compile.sh           # Builds .wasm, .zkey, verification_key.json
│   │   └── build/               # Compiled circuit artifacts (gitignored)
│   └── test/                    # Circuit tests
├── ai-orchestrator/             # TypeScript agent brain
│   ├── src/
│   │   ├── agent.ts             # Orchestrator entry point
│   │   ├── prover.ts            # snarkjs Groth16 proof wrapper
│   │   └── 0g-service.ts        # 0G Storage & DA client
│   └── .env.example             # Environment template
├── mission-control/             # Next.js dashboard
│   └── src/
│       ├── app/page.tsx         # Main dashboard
│       ├── app/api/             # spawn-agent, get-agents, network-status
│       └── components/          # AgentCard, TerminalLog, StatsCard, etc.
├── ARCHITECTURE.md              # Detailed technical deep-dive
├── RUN_GUIDE.md                 # Quick start guide
├── update.md                    # Changelog
└── report.md                    # Auto-generated spawn execution log
```

---

## Contributor Setup Guide

### Prerequisites

| Tool | Version | Required By |
|---|---|---|
| Node.js | >= 20.x | All JS modules |
| npm | >= 9.x | Package manager |
| Git | any | Clone the repo |
| Circom 2.0 | >= 2.0.0 | ZK circuit compilation (only if modifying circuits) |
| snarkjs | bundled via npm | Proof generation |

> **Note:** You do NOT need Rust or SP1. The ZK engine was migrated from SP1/Rust to Circom/snarkjs — everything runs in Node.js now.

### Step 1: Clone & Install

```bash
git clone https://github.com/barneybo18/OGsovergienkey.git
cd OGsovergienkey

# Install all module dependencies
cd contracts && npm install && cd ..
cd ai-orchestrator && npm install && cd ..
cd mission-control && npm install && cd ..
```

### Step 2: Get a Funded Galileo Wallet

1. Create a new wallet (e.g., in MetaMask) or use an existing one
2. Get testnet 0G tokens from the [0G Faucet](https://faucet.0g.ai)
3. You'll need your **private key** (with the `0x` prefix)

### Step 3: Configure Environment Files

**ai-orchestrator/.env** — Create this file:
```env
PRIVATE_KEY=0xYOUR_GALILEO_WALLET_PRIVATE_KEY
RPC_ENDPOINT=https://evmrpc-testnet.0g.ai/
INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai
STORAGE_NODE_URL=https://storage-testnet-rpc.0g.ai
```

**mission-control/.env** — Create this file (same values):
```env
PRIVATE_KEY=0xYOUR_GALILEO_WALLET_PRIVATE_KEY
RPC_ENDPOINT=https://evmrpc-testnet.0g.ai/
INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai
STORAGE_NODE_URL=https://storage-testnet-rpc.0g.ai
```

> ⚠️ **Never commit your `.env` files.** They are already in `.gitignore`.

### Step 4: Compile Contracts

The contracts need to be compiled so the ABI artifacts exist for the orchestrator and dashboard:

```bash
cd contracts
npx hardhat compile
```

This generates `artifacts/` and `typechain-types/`. If you need to redeploy (new contracts):

```bash
npx hardhat run scripts/deploy.ts --network 0g-testnet
```

This writes the deployed addresses to `contracts/addresses.json`.

### Step 5: ZK Circuit Artifacts

The pre-compiled circuit artifacts (`.wasm`, `.zkey`, `verification_key.json`) are already committed to the repo. You do NOT need to recompile unless you modify `constitution.circom`.

If you do need to recompile:

```bash
cd zk-engine/circuits
bash compile.sh
```

> **Important:** If you recompile the circuit, you must also redeploy the `Verifier.sol` contract — the verification key is baked into the Solidity verifier.

### Step 6: Run the Pipeline

**Option A — Via Dashboard (recommended):**
```bash
cd mission-control
npm run dev
# Open http://localhost:3000 → Click "Spawn Agent"
```

**Option B — CLI only:**
```bash
cd ai-orchestrator
npx ts-node --transpile-only src/agent.ts
```

Both options produce real on-chain transactions on Galileo.

---

## How It Works — End-to-End Flow

```
User clicks "Spawn Agent"
         │
         ▼
Phase 1: GENESIS
  ├─ Ephemeral keypair generated
  ├─ Private key split into 3 shards (Shamir 2-of-3)
  ├─ Shard 1 uploaded to 0G Storage → real TX ✅
  └─ Agent registered in AgentRegistry.sol → real TX ✅
         │
         ▼
Phase 2: INTENT + ZK PROVING
  ├─ Intent struct built (amount, target, asset)
  ├─ Constitution rules loaded (max_spend_limit, whitelist)
  ├─ Groth16 proof generated by snarkjs (~1.5s)
  └─ Proof verified locally before submission
         │
         ▼
Phase 3: DA COMMIT
  └─ Raw intent posted to 0G DA → real TX ✅
         │
         ▼
Phase 4: ON-CHAIN SETTLEMENT
  ├─ AgentRegistry.logIntent() called with (proof, pubSignals, daRoot)
  ├─ Verifier.sol checks Groth16 proof on-chain
  └─ If valid → IntentLogged event emitted → real TX ✅
         │
         ▼
  🚀 MISSION SUCCESSFUL — logged to report.md
```

---

## Deployed Contracts (0G Galileo Testnet)

| Contract | Address | Explorer |
|---|---|---|
| AgentRegistry | `0xA480C11842404b36481524cE9dAAC830EeC60e32` | [View on Chainscan](https://chainscan-galileo.0g.ai/address/0xA480C11842404b36481524cE9dAAC830EeC60e32) |
| Verifier (Groth16) | `0x1972f5024a4A480cE9b248F7179826dACe393335` | [View on Chainscan](https://chainscan-galileo.0g.ai/address/0x1972f5024a4A480cE9b248F7179826dACe393335) |
| 0G Storage Flow | `0x22E03a6A89B950F1c82ec5e74F8eCa321a105296` | [View on Chainscan](https://chainscan-galileo.0g.ai/address/0x22E03a6A89B950F1c82ec5e74F8eCa321a105296) |

---

## The ZK Constitution Circuit

The heart of SAK. This Circom circuit enforces two hard constraints:

```circom
// 1. Target must be on the whitelist
target_address === whitelisted_address;

// 2. Amount must not exceed the spending cap
component leq = LessEqThan(64);
leq.in[0] <== intent_amount;
leq.in[1] <== max_spend_limit;
leq.out === 1;
```

**Private inputs:** `intent_amount`, `target_address` (the agent's actual intent — never revealed)
**Public inputs:** `max_spend_limit`, `whitelisted_address` (the rules — visible to everyone)

The proof says: *"I have a valid intent that satisfies these public rules"* — without revealing what the intent actually is.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module 'snarkjs'` | Run `npm install` in `ai-orchestrator/` |
| `Missing RPC_ENDPOINT or PRIVATE_KEY` | Create `.env` in both `ai-orchestrator/` AND `mission-control/` |
| `require(false)` on `registerAgent()` | Your wallet isn't the contract owner or an authorized operator. Ask the owner to call `setOperator(yourAddress, true)` |
| `ZK Proof is invalid` on settlement | Circuit artifacts don't match the deployed Verifier. Recompile circuits (`compile.sh`) and redeploy Verifier |
| `-32000: no matching receipts found` | Known Galileo RPC quirk. The `waitForReceipt()` helper handles this automatically |
| Dashboard shows "Syncing" | 0G Testnet may be under load. Click the refresh icon or wait |
| `npx hardhat compile` fails | Run `npm install @openzeppelin/contracts` in `contracts/` |

---

## Why 0G Labs?

We use **three** distinct 0G primitives — this is a deep integration, not a wrapper:

| 0G Layer | What SAK Uses It For |
|---|---|
| **0G Storage** | Stores MPC key shards. Decentralised, immutable, high-availability retrieval. |
| **0G DA** | The agent's immutable memory. Every intent is logged before settlement — permanent audit trail without on-chain gas costs. |
| **0G Chain (EVM)** | Source of truth. Agent identity (AgentRegistry), ZK verification (Verifier.sol), and intent settlement all anchor here. |

---

## Links

| Resource | URL |
|---|---|
| GitHub Repo | [barneybo18/OGsovergienkey](https://github.com/barneybo18/OGsovergienkey) |
| Galileo Chain Explorer | [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai) |
| Galileo Storage Explorer | [storagescan-galileo.0g.ai](https://storagescan-galileo.0g.ai) |
| 0G Docs | [docs.0g.ai](https://docs.0g.ai) |
| 0G Faucet | [faucet.0g.ai](https://faucet.0g.ai) |
| snarkjs | [github.com/iden3/snarkjs](https://github.com/iden3/snarkjs) |
| Circom Docs | [docs.circom.io](https://docs.circom.io) |

---

## Update Log

For detailed session-by-session changes, see [update.md](./update.md).

---

> *"An agent is only as powerful as its autonomy. True autonomy requires sovereignty."*
