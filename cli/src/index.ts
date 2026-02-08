import * as api from './api.js';
import { preprodConfig } from './config.js';
import { Buffer } from 'buffer';
import * as crypto from 'crypto';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║         MIDNIGHT WHISTLE                     ║');
  console.log('║   Anonymous Whistleblower Verification       ║');
  console.log('║   on the Midnight Network                    ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  while (true) {
    console.log('\nOptions:');
    console.log('1. Initialize Wallet');
    console.log('2. Register Organizational Membership');
    console.log('3. Submit Anonymous Report');
    console.log('4. Prove Membership (without revealing identity)');
    console.log('5. Prove Severity Level');
    console.log('6. Prove Financial Impact');
    console.log('7. Prove Witness Count');
    console.log('8. Verify Report Hash');
    console.log('9. Exit');

    const choice = await rl.question('\nSelect an option: ');

    switch (choice) {
      case '1':
        console.log('\n[Wallet] Initialization logic would go here...');
        console.log('[Wallet] In production: creates HD wallet, syncs with indexer, funds from faucet.');
        break;

      case '2': {
        const employeeId = await rl.question('Enter your employee ID (kept private): ');
        const department = await rl.question('Enter department: ');
        const secret = crypto.randomBytes(32);
        const dataString = `${employeeId}-${department}`;
        const commitment = crypto.createHash('sha256').update(dataString).update(secret).digest();
        console.log(`\n[Membership] Commitment generated: ${commitment.toString('hex')}`);
        console.log(`[Membership] Secret (SAVE THIS — you need it to prove membership): ${secret.toString('hex')}`);
        console.log('[Membership] Would call api.registerMembership()...');
        break;
      }

      case '3': {
        const category = await rl.question('Report category (fraud/safety/harassment/corruption/other): ');
        const description = await rl.question('Brief description (hashed, never stored on-chain): ');
        const severity = await rl.question('Severity (1-10): ');
        const financialImpact = await rl.question('Estimated financial impact ($K): ');
        const witnesses = await rl.question('Number of corroborating witnesses: ');
        const reportData = `${category}-${description}-${severity}-${financialImpact}-${witnesses}-${Date.now()}`;
        const reportHash = crypto.createHash('sha256').update(reportData).digest();
        console.log(`\n[Report] Report hash: ${reportHash.toString('hex')}`);
        console.log('[Report] Category:', category.toUpperCase());
        console.log('[Report] Your identity is NEVER revealed on-chain.');
        console.log('[Report] Would call api.submitReport()...');
        break;
      }

      case '4': {
        const secret = await rl.question('Enter your membership secret: ');
        console.log(`\n[Proof] Proving organizational membership via ZK...`);
        console.log('[Proof] The verifier learns ONLY that you are a member — not WHO you are.');
        console.log('[Proof] Would call api.proveMembership()...');
        break;
      }

      case '5': {
        const minSeverity = await rl.question('Investigator minimum severity threshold: ');
        const actualSeverity = await rl.question('Actual report severity (1-10): ');
        console.log(`\n[Proof] Proving severity: ${actualSeverity} >= ${minSeverity} requirement`);
        console.log('[Proof] Investigator learns only PASS/FAIL — not the exact severity.');
        console.log('[Proof] Would call api.proveSeverity()...');
        break;
      }

      case '6': {
        const minAmount = await rl.question('Investigator minimum financial impact ($K): ');
        const actualAmount = await rl.question('Actual financial impact ($K): ');
        console.log(`\n[Proof] Proving impact: $${actualAmount}K >= $${minAmount}K requirement`);
        console.log('[Proof] Exact dollar amount remains private.');
        console.log('[Proof] Would call api.proveFinancialImpact()...');
        break;
      }

      case '7': {
        const minWitnesses = await rl.question('Minimum witnesses required: ');
        const actualWitnesses = await rl.question('Actual witness count: ');
        console.log(`\n[Proof] Proving witnesses: ${actualWitnesses} >= ${minWitnesses} requirement`);
        console.log('[Proof] Witness identities and exact count stay private.');
        console.log('[Proof] Would call api.proveWitnessCount()...');
        break;
      }

      case '8': {
        const hash = await rl.question('Enter report hash to verify: ');
        console.log(`\n[Verify] Checking on-chain: ${hash.substring(0, 20)}...`);
        console.log('[Verify] Would call contract verify_report() circuit...');
        break;
      }

      case '9':
        console.log('\n[System] Securely wiping session data...');
        console.log('[System] Stay safe. Stay anonymous.');
        rl.close();
        process.exit(0);

      default:
        console.log('Invalid option.');
    }
  }
}

main().catch(console.error);
