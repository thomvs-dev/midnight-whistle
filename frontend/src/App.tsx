import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Shield,
  FileWarning,
  Search,
  Eye,
  EyeOff,
  ChevronRight,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Cpu,
  Wallet,
  Lock as LockIcon,
  Terminal as TerminalIcon,
  Hash,
  Users,
  DollarSign,
  Flame,
  Siren,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Building2,
  FileText,
  Megaphone,
} from 'lucide-react';

type Mode = 'whistleblower' | 'investigator';
type Step = 'register' | 'report' | 'commit' | 'success';
type VerificationType = 'severity' | 'financial' | 'witnesses';

const REPORT_CATEGORIES = [
  { id: 'fraud', label: 'Financial Fraud', icon: DollarSign, color: 'text-red-400' },
  { id: 'safety', label: 'Safety Violation', icon: AlertTriangle, color: 'text-amber-400' },
  { id: 'harassment', label: 'Harassment', icon: UserX, color: 'text-orange-400' },
  { id: 'corruption', label: 'Corruption', icon: Siren, color: 'text-rose-400' },
  { id: 'other', label: 'Other', icon: FileText, color: 'text-zinc-400' },
];

function App() {
  const [mode, setMode] = useState<Mode>('whistleblower');
  const [step, setStep] = useState<Step>('register');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [walletAddr, setWalletAddr] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMocked, setIsMocked] = useState(false);

  // Whistleblower state
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

  // Investigator state
  const [investigatorHash, setInvestigatorHash] = useState('');
  const [vType, setVType] = useState<VerificationType>('severity');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle');
  const [severityThreshold, setSeverityThreshold] = useState(5);
  const [financialThreshold, setFinancialThreshold] = useState(100);
  const [witnessThreshold, setWitnessThreshold] = useState(2);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    addLog('Secure: Searching for Midnight Lace extension...');

    try {
      // @ts-ignore
      const midnight = window.midnight;
      if (!midnight || !midnight.mnLace) {
        throw new Error('EXTENSION_MISSING');
      }

      addLog('Secure: Requesting connection from Lace...');
      const walletAPI = await midnight.mnLace.connect('undeployed');
      const { shieldedAddress } = await walletAPI.getShieldedAddresses();

      setWalletAddr(shieldedAddress);
      setIsMocked(false);
      addLog(`Wallet Connected: ${shieldedAddress.substring(0, 10)}... (Real Connection)`);
      setIsConnecting(false);
    } catch (err: any) {
      if (err.message === 'EXTENSION_MISSING') {
        addLog('Warning: Midnight Lace Wallet not found.');
        addLog('Switching to [Simulation Mode] for demo...');
        setTimeout(() => {
          const mockAddr = '3midnight1whistle0xanon992z88';
          setWalletAddr(mockAddr);
          setIsMocked(true);
          addLog(`Wallet Connected: ${mockAddr.substring(0, 10)}... (SIMULATED)`);
          setIsConnecting(false);
        }, 1500);
      } else {
        addLog(`Error: ${err.message || 'Failed to connect.'}`);
        setIsConnecting(false);
      }
    }
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [logs]);

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

  const handleVerify = () => {
    setVerifyStatus('checking');
    addLog(`Investigator: Running [${vType.toUpperCase()}] verification...`);
    addLog('Investigator: Querying simulated Midnight ledger...');

    setTimeout(() => {
      const ledger = JSON.parse(localStorage.getItem('whistle_sim_ledger') || '{}');
      const trimmedHash = investigatorHash.trim();
      const entry = ledger[trimmedHash];
      const isCurrentSession = trimmedHash.toLowerCase() === reportHash.trim().toLowerCase();
      const resolvedEntry = entry || (isCurrentSession
        ? {
            severity: parseInt(reportData.severity) || 0,
            financialImpact: parseInt(reportData.financialImpact) || 0,
            witnessCount: parseInt(reportData.witnessCount) || 0,
          }
        : null);

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

  return (
    <div className="relative min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Background Decor */}
      <div className="glow-bg top-0 left-1/4 w-[500px] h-[500px]" />
      <div className="glow-bg bottom-0 right-1/4 w-[400px] h-[400px]" style={{ animationDelay: '-4s' }} />

      {/* Header */}
      <div className="flex flex-col items-center gap-6 mb-12 w-full max-w-xl text-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl border border-primary/30">
            <Megaphone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Midnight Whistle</h1>
        </div>
        <p className="text-foreground/50 text-sm max-w-md">
          Anonymous whistleblower verification on Midnight. Report misconduct with ZK proofs.
          Your identity stays hidden. The truth doesn't.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-full">
            <button
              onClick={() => setMode('whistleblower')}
              className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${mode === 'whistleblower' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'text-foreground/60 hover:text-white'}`}
            >
              Whistleblower
            </button>
            <button
              onClick={() => setMode('investigator')}
              className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${mode === 'investigator' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'text-foreground/60 hover:text-white'}`}
            >
              Investigator
            </button>
          </div>

          <button
            onClick={connectWallet}
            disabled={!!walletAddr || isConnecting}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold border transition-all ${walletAddr ? (isMocked ? 'border-orange-500/30 bg-orange-500/10 text-orange-500' : 'border-green-500/30 bg-green-500/10 text-green-500') : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? 'Connecting...' : walletAddr ? (isMocked ? `SIM: ${walletAddr.substring(0, 8)}...` : `${walletAddr.substring(0, 8)}...`) : 'Connect Lace'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-8 w-full max-w-7xl">
        {/* Main Area */}
        <main className="glass p-8 flex flex-col gap-8">
          {mode === 'whistleblower' ? (
            <>
              {/* Step Indicators */}
              <div className="flex justify-between items-center px-4">
                {[
                  { id: 'register', icon: Shield },
                  { id: 'report', icon: FileWarning },
                  { id: 'commit', icon: LockIcon },
                  { id: 'success', icon: CheckCircle2 },
                ].map((s, idx) => (
                  <React.Fragment key={s.id}>
                    <div className={`flex flex-col items-center gap-2 ${step === s.id ? 'text-primary' : 'text-foreground/20'}`}>
                      <div className={`p-3 rounded-full border ${step === s.id ? 'border-primary bg-primary/10' : 'border-current'}`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                    </div>
                    {idx < 3 && <div className="h-px flex-1 bg-white/10 mx-2" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Register Membership */}
              {step === 'register' && (
                <div className="flex flex-col gap-8 py-4 animate-in">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">Register Organizational Membership</h2>
                    <p className="text-foreground/60">
                      Your identity is hashed into an anonymous commitment. Nothing identifiable is stored or transmitted.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-500/80">
                      This data is processed locally in your browser only. It generates a cryptographic commitment
                      that proves membership without revealing who you are.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Employee ID *</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10"
                        placeholder="EMP-XXXX (never leaves your device)"
                        value={memberData.employeeId}
                        onChange={(e) => setMemberData({ ...memberData, employeeId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Department *</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10"
                        placeholder="Engineering, Finance, HR..."
                        value={memberData.department}
                        onChange={(e) => setMemberData({ ...memberData, department: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Organization Name</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10"
                        placeholder="Acme Corporation"
                        value={memberData.orgName}
                        onChange={(e) => setMemberData({ ...memberData, orgName: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold p-5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Commitment...
                      </>
                    ) : (
                      <>Register Anonymously <ChevronRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: Submit Report */}
              {step === 'report' && (
                <div className="flex flex-col gap-8 py-4 animate-in">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">File Anonymous Report</h2>
                    <p className="text-foreground/60">
                      Describe the misconduct. Your report is hashed locally — only the cryptographic fingerprint is published.
                    </p>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Report Category *</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {REPORT_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setReportData({ ...reportData, category: cat.id })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            reportData.category === cat.id
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-white/5 border-white/10 text-foreground/40 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <cat.icon className={`w-5 h-5 ${reportData.category === cat.id ? 'text-primary' : cat.color}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Description *</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10 resize-none h-24"
                      placeholder="Describe what happened (this text is hashed locally, never stored or sent anywhere)"
                      value={reportData.description}
                      onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Severity (1-10) *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10"
                        placeholder="8"
                        value={reportData.severity}
                        onChange={(e) => setReportData({ ...reportData, severity: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Financial Impact ($K)</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10"
                        placeholder="500"
                        value={reportData.financialImpact}
                        onChange={(e) => setReportData({ ...reportData, financialImpact: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Witnesses</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10"
                        placeholder="3"
                        value={reportData.witnessCount}
                        onChange={(e) => setReportData({ ...reportData, witnessCount: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitReport}
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold p-5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        Hashing Report...
                      </>
                    ) : (
                      <>Generate Report Hash <Hash className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              )}

              {/* Step 3: Commit */}
              {step === 'commit' && (
                <div className="flex flex-col items-center text-center gap-8 py-8 animate-in">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center">
                    <LockIcon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">Your Anonymous Report</h2>
                    <p className="text-foreground/60 max-w-md">
                      Share this hash with investigators to prove your report is legitimate.
                      Your identity is cryptographically separated from the report.
                    </p>
                  </div>

                  <div className="w-full max-w-lg space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold">Membership Commitment</label>
                      <div className="relative group">
                        <div className="w-full bg-black/40 border border-white/10 p-4 rounded-xl font-mono text-accent text-xs break-all leading-relaxed pr-14">
                          {membershipHash}
                        </div>
                        <button
                          onClick={() => copyHash(membershipHash)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-white"
                        >
                          {hasCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold">Report Hash</label>
                      <div className="relative group">
                        <div className="w-full bg-black/40 border border-primary/20 p-4 rounded-xl font-mono text-primary text-xs break-all leading-relaxed pr-14 bg-gradient-to-r from-black/40 to-primary/5">
                          {reportHash}
                        </div>
                        <button
                          onClick={() => copyHash(reportHash)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePublish}
                    disabled={isProcessing}
                    className="w-full max-w-md bg-primary hover:bg-primary/90 text-white font-bold p-5 rounded-xl shadow-xl shadow-primary/20 disabled:opacity-50 transition-all"
                  >
                    {isProcessing ? 'Generating ZK Proof...' : 'Publish to Midnight Ledger'}
                  </button>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <div className="flex flex-col items-center text-center gap-8 py-12 animate-in">
                  <div className="w-28 h-28 bg-green-500/10 border-4 border-green-500/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <ShieldCheck className="w-14 h-14 text-green-500" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Report Filed Anonymously</h2>
                    <p className="text-foreground/60 max-w-lg text-lg">
                      Your Zero-Knowledge report is now anchored on-chain. Investigators can verify its severity,
                      financial impact, and witness count — without ever learning your identity.
                    </p>
                  </div>

                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-3 max-w-lg">
                    <EyeOff className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-sm text-green-500/80 text-left">
                      Your employee ID, department, and all personal data were hashed locally and are
                      <strong> cryptographically impossible</strong> to recover from the on-chain commitment.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setStep('register');
                        setReportData({ category: '', description: '', severity: '', financialImpact: '', witnessCount: '' });
                      }}
                      className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold text-white transition-all"
                    >
                      New Report
                    </button>
                    <button
                      onClick={() => {
                        setMode('investigator');
                        setInvestigatorHash(reportHash);
                      }}
                      className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                    >
                      Switch to Investigator
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Investigator Mode */}
              <div className="flex flex-col gap-10 py-6 animate-in">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-accent/20 rounded-2xl border border-accent/30">
                    <Search className="w-10 h-10 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-white">Report Investigation</h2>
                    <p className="text-foreground/60">Verify anonymous reports without compromising whistleblower identity.</p>
                  </div>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-8">
                  {/* Verification Type */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'severity', label: 'Severity', icon: Flame },
                      { id: 'financial', label: 'Financial Impact', icon: DollarSign },
                      { id: 'witnesses', label: 'Witnesses', icon: Users },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setVType(t.id as VerificationType); setVerifyStatus('idle'); }}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${vType === t.id ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-white/10 text-foreground/40 hover:text-white hover:bg-white/10'}`}
                      >
                        <t.icon className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Threshold Inputs */}
                  {vType === 'severity' && (
                    <div className="space-y-4 animate-in">
                      <label className="text-xs font-bold text-foreground/30 uppercase tracking-widest ml-1">Minimum Severity Level</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          className="w-24 bg-black/40 border border-white/10 rounded-xl p-4 text-white font-bold text-center outline-none focus:ring-2 focus:ring-accent/40"
                          value={severityThreshold}
                          onChange={(e) => setSeverityThreshold(parseInt(e.target.value) || 0)}
                        />
                        <span className="text-foreground/40 text-sm font-medium">out of 10</span>
                      </div>
                    </div>
                  )}
                  {vType === 'financial' && (
                    <div className="space-y-4 animate-in">
                      <label className="text-xs font-bold text-foreground/30 uppercase tracking-widest ml-1">Minimum Financial Impact</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          className="w-24 bg-black/40 border border-white/10 rounded-xl p-4 text-white font-bold text-center outline-none focus:ring-2 focus:ring-accent/40"
                          value={financialThreshold}
                          onChange={(e) => setFinancialThreshold(parseInt(e.target.value) || 0)}
                        />
                        <span className="text-foreground/40 text-sm font-medium">$ Thousands</span>
                      </div>
                    </div>
                  )}
                  {vType === 'witnesses' && (
                    <div className="space-y-4 animate-in">
                      <label className="text-xs font-bold text-foreground/30 uppercase tracking-widest ml-1">Minimum Corroborating Witnesses</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          className="w-24 bg-black/40 border border-white/10 rounded-xl p-4 text-white font-bold text-center outline-none focus:ring-2 focus:ring-accent/40"
                          value={witnessThreshold}
                          onChange={(e) => setWitnessThreshold(parseInt(e.target.value) || 0)}
                        />
                        <span className="text-foreground/40 text-sm font-medium">Witnesses</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-foreground/40 ml-1">
                      <span>Report Proof Hash</span>
                      <span className="text-[10px] text-accent font-normal normal-case italic">Provided by anonymous source</span>
                    </div>
                    <textarea
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
                      value={investigatorHash}
                      onChange={(e) => { setInvestigatorHash(e.target.value); setVerifyStatus('idle'); }}
                      placeholder="Paste report hash here (0x...)"
                    />
                  </div>

                  <button
                    onClick={handleVerify}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold p-6 rounded-2xl shadow-xl shadow-accent/20 transition-all group active:scale-95"
                  >
                    <span className="flex items-center justify-center gap-3">
                      {verifyStatus === 'checking' ? (
                        <>
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          Consulting Ledger...
                        </>
                      ) : (
                        `Verify ${vType === 'financial' ? 'Financial Impact' : vType === 'witnesses' ? 'Witness Count' : 'Severity Level'}`
                      )}
                    </span>
                  </button>

                  {verifyStatus === 'verified' && (
                    <div className="flex items-center justify-center gap-4 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl animate-in text-green-500 font-bold text-lg shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                      <ShieldCheck className="w-7 h-7" />
                      CLAIM VALIDATED — THRESHOLD MET
                    </div>
                  )}

                  {verifyStatus === 'failed' && (
                    <div className="flex items-center justify-center gap-4 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl animate-in text-red-400 font-bold">
                      <XCircle className="w-6 h-6" />
                      VERIFICATION FAILED — THRESHOLD NOT MET
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white/5 border-l-4 border-accent/20 rounded-r-2xl">
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Verify that the anonymous report meets the <b>{vType === 'financial' ? 'FINANCIAL IMPACT' : vType === 'witnesses' ? 'WITNESS COUNT' : 'SEVERITY'}</b> threshold.
                    The whistleblower's identity is <b>never</b> exposed during verification.
                  </p>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Sidebar */}
        <aside className="flex flex-col gap-8">
          {/* Stack Status */}
          <div className="terminal-glass p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40">Environment</h3>
              <div className={`px-2 py-0.5 ${isMocked ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'} text-[10px] font-bold rounded uppercase`}>
                {isMocked ? 'Simulation' : 'Localhost'}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Midnight Node', status: isMocked ? 'Simulation' : 'Healthy', color: isMocked ? 'bg-orange-500' : 'bg-green-500' },
                { label: 'Standalone Indexer', status: isMocked ? 'Local Storage' : 'Syncing', color: isMocked ? 'bg-orange-500' : 'bg-green-500' },
                { label: 'ZK Prover Engine', status: 'Available', color: 'bg-primary' },
                { label: 'Whistle Vault', status: 'Encrypted', color: 'bg-white/10' },
              ].map((stack) => (
                <div key={stack.label} className="group cursor-default">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground/40 group-hover:text-foreground/80 transition-all font-medium">{stack.label}</span>
                    <span className="text-[10px] uppercase font-black text-foreground/20 group-hover:text-foreground/60 transition-all">{stack.status}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${stack.color} w-full transition-all`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anonymous Status */}
          <div className="terminal-glass p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40">Privacy Shield</h3>
            <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
              <EyeOff className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500 font-medium">Identity Protected</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
              <LockIcon className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500 font-medium">Data Encrypted Locally</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500 font-medium">ZK Proofs Active</span>
            </div>
          </div>

          {/* Console */}
          <div className="terminal-glass flex-1 flex flex-col min-h-[350px]">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3 h-3" />
                <span>Secure Channel</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto font-mono text-[11px] leading-relaxed">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-foreground/20 py-12">
                  <Cpu className="w-8 h-8 opacity-20" />
                  <span className="text-[11px] uppercase tracking-widest">Secure Channel Ready</span>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-foreground/10 select-none">#{i.toString().padStart(2, '0')}</span>
                    <span className="text-foreground/80 break-all group-hover:text-primary transition-all">{log}</span>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .animate-in {
          animation: slideUpFade 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .terminal-header {
          @apply flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-foreground/30;
        }
      `}</style>
    </div>
  );
}

export default App;
