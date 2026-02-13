import React from 'react';
import { ShieldCheck, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';

interface SuccessViewProps {
  onNewReport: () => void;
  onSwitchToInvestigator: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  onNewReport,
  onSwitchToInvestigator,
}) => {
  return (
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
        <Button
          variant="secondary"
          onClick={onNewReport}
          className="px-10 py-4 rounded-2xl font-semibold"
        >
          New Report
        </Button>
        <Button
          variant="primary"
          onClick={onSwitchToInvestigator}
          className="px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-all"
        >
          Switch to Investigator
        </Button>
      </div>
    </div>
  );
};
