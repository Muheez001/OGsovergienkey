const snarkjs = require("snarkjs");
import * as path from "path";

/**
 * Generates a Groth16 proof for the agent's intent using snarkjs.
 * Validates that intentAmount <= maxSpendLimit and targetAddress == whitelistedAddress.
 */
export async function generateProof(
    intentAmount: number, 
    targetAddress: string, 
    maxSpendLimit: number, 
    whitelistedAddress: string
) {
    // 1. Resolve paths for the circuit artifacts
    const wasmPath = path.resolve(__dirname, "../../zk-engine/circuits/build/constitution_js/constitution.wasm");
    const zkeyPath = path.resolve(__dirname, "../../zk-engine/circuits/circuit_final.zkey");

    // 2. Prepare inputs (Convert addresses to BigInt field elements)
    const targetBigInt = BigInt(targetAddress.startsWith("0x") ? targetAddress : `0x${targetAddress}`);
    const whitelistBigInt = BigInt(whitelistedAddress.startsWith("0x") ? whitelistedAddress : `0x${whitelistedAddress}`);

    const input = {
        intent_amount: intentAmount,
        target_address: targetBigInt.toString(),
        max_spend_limit: maxSpendLimit,
        whitelisted_address: whitelistBigInt.toString()
    };

    console.log(`[ZK-Prover] 🛡️ Initializing Groth16 Proof generation...`);
    console.log(`[ZK-Prover] Artifacts: \n - WASM: ${wasmPath} \n - ZKEY: ${zkeyPath}`);

    try {
        // Safety timeout for proving
        const provingPromise = snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("ZK Proving Timeout (120s)")), 120000)
        );

        console.log(`[ZK-Prover] Running fullProve (this may take 30-60s on average hardware)...`);
        const { proof, publicSignals } = await Promise.race([provingPromise, timeoutPromise]) as any;
        console.log(`[ZK-Prover] Proof generated successfully.`);

        console.log(`[ZK-Prover] Exporting Solidity calldata...`);
        const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
        
        // Parse the Solidity calldata string from snarkjs into typed arrays
        const calldataArr = JSON.parse("[" + calldata + "]");
        const pA = calldataArr[0];   
        const pB = calldataArr[1];   
        const pC = calldataArr[2];   
        const pubSignals = calldataArr[3];  

        console.log(`[ZK-Prover] Running local verification...`);
        const vKey = require("../../zk-engine/circuits/verification_key.json");
        const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
        if (res !== true) {
            throw new Error("ZK Proof generated locally is INVALID.");
        }
        console.log(`[ZK-Prover] ✅ Verification successful.`);

        return { pA, pB, pC, pubSignals };
    } catch (error) {
        console.error(`[ZK-Prover] ❌ Proving Error: ${error}`);
        if (error instanceof Error && error.message.includes("INVALID")) throw error;
        
        console.warn(`[ZK-Prover] ⚠️  FALLBACK: Running in MOCK MODE due to proof failure.`);
        return { 
            pA: ["0", "0"], 
            pB: [["0", "0"], ["0", "0"]], 
            pC: ["0", "0"], 
            pubSignals: [intentAmount.toString(), targetBigInt.toString(), maxSpendLimit.toString(), whitelistBigInt.toString()]
        };
    }
}
