import { useState } from 'react';
import { VerificationType } from '../types';

export const useInvestigator = (
  addLog: (msg: string) => void,
  reportHash: string
) => {
  const [investigatorHash, setInvestigatorHash] = useState('');
  const [vType, setVType] = useState<VerificationType>('severity');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle');
  const [severityThreshold, setSeverityThreshold] = useState(5);
  const [financialThreshold, setFinancialThreshold] = useState(100);
  const [witnessThreshold, setWitnessThreshold] = useState(2);

  const handleVerify = (
     getLocalReport?: () => { severity: number, financialImpact: number, witnessCount: number } | null
  ) => {
    setVerifyStatus('checking');
    addLog(`Investigator: Running [${vType.toUpperCase()}] verification...`);
    addLog('Investigator: Querying simulated Midnight ledger...');

    setTimeout(() => {
      const ledger = JSON.parse(localStorage.getItem('whistle_sim_ledger') || '{}');
      const trimmedHash = investigatorHash.trim();
      const entry = ledger[trimmedHash];
      
      let resolvedEntry = entry;
      if (!resolvedEntry && getLocalReport && trimmedHash.toLowerCase() === reportHash.trim().toLowerCase()) {
         resolvedEntry = getLocalReport();
      }

      if (!resolvedEntry) {
        setVerifyStatus('failed');
        addLog('Verification Error: Report hash not found on ledger.');
        return;
      }

      if (vType === 'severity') {
        if (resolvedEntry.severity >= severityThreshold) {
          setVerifyStatus('verified');
          addLog(`VERIFIED: Severity ${resolvedEntry.severity}/10 meets the ${severityThreshold}+ threshold.`);
        } else {
          setVerifyStatus('failed');
          addLog(`FAILED: Severity ${resolvedEntry.severity}/10 is below ${severityThreshold}+ threshold.`);
        }
      } else if (vType === 'financial') {
        if (resolvedEntry.financialImpact >= financialThreshold) {
          setVerifyStatus('verified');
          addLog(`VERIFIED: Financial impact $${resolvedEntry.financialImpact}K meets the $${financialThreshold}K+ threshold.`);
        } else {
          setVerifyStatus('failed');
          addLog(`FAILED: Financial impact $${resolvedEntry.financialImpact}K is below $${financialThreshold}K+ threshold.`);
        }
      } else if (vType === 'witnesses') {
        if (resolvedEntry.witnessCount >= witnessThreshold) {
          setVerifyStatus('verified');
          addLog(`VERIFIED: ${resolvedEntry.witnessCount} witnesses meets the ${witnessThreshold}+ requirement.`);
        } else {
          setVerifyStatus('failed');
          addLog(`FAILED: ${resolvedEntry.witnessCount} witnesses is below the ${witnessThreshold}+ requirement.`);
        }
      }
    }, 2500);
  };

  return {
    investigatorHash, setInvestigatorHash,
    vType, setVType,
    verifyStatus, setVerifyStatus,
    severityThreshold, setSeverityThreshold,
    financialThreshold, setFinancialThreshold,
    witnessThreshold, setWitnessThreshold,
    handleVerify
  };
};
