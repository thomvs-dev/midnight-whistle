import React from 'react';
import { Lock, Copy, Check } from 'lucide-react';
import { Button } from '../common/Button';

interface CommitViewProps {
  membershipHash: string;
  reportHash: string;
  hasCopied: boolean;
  copyHash: (hash: string) => void;
  handlePublish: () => void;
  isProcessing: boolean;
}

export const CommitView: React.FC<CommitViewProps> = ({
  membershipHash,
  reportHash,
  hasCopied,
  copyHash,
  handlePublish,
  isProcessing,
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-8 animate-in">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center">
        <Lock className="w-10 h-10 text-primary" />
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
            <div className="w-full bg-black/40 border border-white/10 p-4 rounded-xl font-mono text-accent text-xs break-all leading-relaxed pr-14 text-left">
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
            <div className="w-full bg-black/40 border border-primary/20 p-4 rounded-xl font-mono text-primary text-xs break-all leading-relaxed pr-14 bg-gradient-to-r from-black/40 to-primary/5 text-left">
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

      <Button
        onClick={handlePublish}
        isLoading={isProcessing}
        loadingText="Generating ZK Proof..."
        className="w-full max-w-md"
      >
        Publish to Midnight Ledger
      </Button>
    </div>
  );
};
