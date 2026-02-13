import React from 'react';
import { Search, Flame, DollarSign, Users, ShieldCheck, XCircle } from 'lucide-react';
import { VerificationType } from '../../types';
import { Button } from '../common/Button';

interface VerificationPanelProps {
  investigatorHash: string;
  setInvestigatorHash: (hash: string) => void;
  vType: VerificationType;
  setVType: (type: VerificationType) => void;
  verifyStatus: 'idle' | 'checking' | 'verified' | 'failed';
  setVerifyStatus: (status: 'idle') => void;
  severityThreshold: number;
  setSeverityThreshold: (val: number) => void;
  financialThreshold: number;
  setFinancialThreshold: (val: number) => void;
  witnessThreshold: number;
  setWitnessThreshold: (val: number) => void;
  handleVerify: () => void;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  investigatorHash,
  setInvestigatorHash,
  vType,
  setVType,
  verifyStatus,
  setVerifyStatus,
  severityThreshold,
  setSeverityThreshold,
  financialThreshold,
  setFinancialThreshold,
  witnessThreshold,
  setWitnessThreshold,
  handleVerify,
}) => {
  return (
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

        <Button
          onClick={handleVerify}
          variant="accent"
          isLoading={verifyStatus === 'checking'}
          loadingText="Consulting Ledger..."
          fullWidth
          className="p-6 rounded-2xl shadow-xl shadow-accent/20"
        >
          Verify {vType === 'financial' ? 'Financial Impact' : vType === 'witnesses' ? 'Witness Count' : 'Severity Level'}
        </Button>

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
  );
};
