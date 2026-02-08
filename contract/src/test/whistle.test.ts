import { describe, it, expect } from 'vitest';
import { WhistleSimulator } from './whistle-simulator.js';
import * as crypto from 'crypto';

describe('MidnightWhistle', () => {
  it('should allow membership registration', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    expect(() => simulator.registerMembership(commitment)).not.toThrow();
  });

  it('should prove membership with correct secret', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    simulator.registerMembership(commitment);
    expect(() => simulator.proveMembership(secret)).not.toThrow();
  });

  it('should reject membership proof with wrong secret', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const wrongSecret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    simulator.registerMembership(commitment);
    expect(() => simulator.proveMembership(wrongSecret)).toThrow();
  });

  it('should allow anonymous report submission with valid membership', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();
    const reportHash = crypto.createHash('sha256').update('financial-fraud-evidence-2026').digest();

    simulator.registerMembership(commitment);
    expect(() => simulator.submitReport(reportHash, secret)).not.toThrow();
  });

  it('should reject report submission with invalid membership', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const wrongSecret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();
    const reportHash = crypto.createHash('sha256').update('fake-report').digest();

    simulator.registerMembership(commitment);
    expect(() => simulator.submitReport(reportHash, wrongSecret)).toThrow();
  });

  it('should prove severity when threshold is met', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    simulator.registerMembership(commitment);
    // Actual severity 8, required minimum 5
    expect(() => simulator.proveSeverity(5n, 8n, secret)).not.toThrow();
  });

  it('should reject severity proof when threshold is not met', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    simulator.registerMembership(commitment);
    // Actual severity 3, required minimum 7
    expect(() => simulator.proveSeverity(7n, 3n, secret)).toThrow();
  });

  it('should prove financial impact when threshold is met', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    simulator.registerMembership(commitment);
    // Actual $500K impact, required minimum $100K
    expect(() => simulator.proveFinancialImpact(100n, 500n, secret)).not.toThrow();
  });

  it('should reject financial impact proof when threshold is not met', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    simulator.registerMembership(commitment);
    // Actual $50K impact, required minimum $200K
    expect(() => simulator.proveFinancialImpact(200n, 50n, secret)).toThrow();
  });

  it('should prove witness count when requirement is met', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    simulator.registerMembership(commitment);
    // 5 witnesses, requires 3 minimum
    expect(() => simulator.proveWitnessCount(3n, 5n, secret)).not.toThrow();
  });

  it('should reject witness count proof when requirement is not met', () => {
    const simulator = new WhistleSimulator();
    const secret = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256').update(secret).digest();

    simulator.registerMembership(commitment);
    // 1 witness, requires 3 minimum
    expect(() => simulator.proveWitnessCount(3n, 1n, secret)).toThrow();
  });
});
