import { useState } from 'react';
import { Step } from '../types';

export const useWhistleblower = (
  addLog: (msg: string) => void,
  walletAddr: string | null
) => {
  const [step, setStep] = useState<Step>('register');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [memberData, setMemberData] = useState({
    employeeId: '',
    department: '',
    orgName: '',
  });
  const [reportData, setReportData] = useState({
    category: '',
    description: '',
    severity: '',
    financialImpact: '',
    witnessCount: '',
  });
  const [membershipHash, setMembershipHash] = useState('');
  const [reportHash, setReportHash] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setHasCopied(true);
    addLog('Secure: Hash copied to clipboard.');
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleRegister = async () => {
    if (!memberData.employeeId || !memberData.department) {
      addLog('Error: Employee ID and Department are required.');
      return;
    }
    setIsProcessing(true);
    addLog('ZK Engine: Generating membership commitment...');
    addLog('Note: Your employee ID is NEVER stored or transmitted.');

    const secret = 'midnight_whistle_member_2026';
    const dataString = `${memberData.employeeId}-${memberData.department}-${memberData.orgName}-${secret}-${walletAddr || 'no_wallet'}`;

    const msgUint8 = new TextEncoder().encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    setTimeout(() => {
      setMembershipHash(hashHex);
      addLog(`Membership commitment: ${hashHex.substring(0, 16)}...`);
      addLog('Your identity is now cryptographically shielded.');
      setIsProcessing(false);
      setStep('report');
    }, 1000);
  };

  const handleSubmitReport = async () => {
    if (!reportData.category || !reportData.description || !reportData.severity) {
      addLog('Error: Category, description, and severity are required.');
      return;
    }
    setIsProcessing(true);
    addLog(`Report: Category [${reportData.category.toUpperCase()}]`);
    addLog('ZK Engine: Hashing report content...');
    addLog('Note: Report text stays on YOUR device. Only the hash goes on-chain.');

    const reportString = `${reportData.category}-${reportData.description}-${reportData.severity}-${reportData.financialImpact}-${reportData.witnessCount}-${membershipHash}-${Date.now()}`;
    const msgUint8 = new TextEncoder().encode(reportString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    setTimeout(() => {
      setReportHash(hashHex);
      addLog(`Report hash: ${hashHex.substring(0, 16)}...`);
      setIsProcessing(false);
      setStep('commit');
    }, 800);
  };

  const handlePublish = () => {
    setIsProcessing(true);
    addLog('Midnight Prover: Generating ZK proof of membership + report...');
    addLog('Midnight Node: Submitting anonymous report transaction...');

    setTimeout(() => {
      const ledger = JSON.parse(localStorage.getItem('whistle_sim_ledger') || '{}');
      if (!ledger[reportHash]) {
        ledger[reportHash] = {
          membershipHash,
          category: reportData.category,
          severity: parseInt(reportData.severity) || 0,
          financialImpact: parseInt(reportData.financialImpact) || 0,
          witnessCount: parseInt(reportData.witnessCount) || 0,
          timestamp: Date.now(),
        };
        localStorage.setItem('whistle_sim_ledger', JSON.stringify(ledger));
      }

      addLog(`Success: Report ${reportHash.substring(0, 12)}... anchored on-chain.`);
      addLog('Your identity remains COMPLETELY anonymous.');
      setIsProcessing(false);
      setStep('success');
    }, 2500);
  };
  
  const resetForm = () => {
      setStep('register');
      setReportData({ category: '', description: '', severity: '', financialImpact: '', witnessCount: '' });
  };

  return {
    step,
    setStep,
    isProcessing,
    memberData,
    setMemberData,
    reportData,
    setReportData,
    membershipHash,
    reportHash,
    hasCopied,
    copyHash,
    handleRegister,
    handleSubmitReport,
    handlePublish,
    resetForm
  };
};
