import React from 'react';
import { Megaphone, Wallet } from 'lucide-react';
import { Mode } from '../../types';
import { Button } from '../common/Button';

interface HeaderProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  walletAddr: string | null;
  isConnecting: boolean;
  isMocked: boolean;
  connectWallet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  walletAddr,
  isConnecting,
  isMocked,
  connectWallet,
}) => {
  return (
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
          <Button
             variant={mode === 'whistleblower' ? 'primary' : 'ghost'}
             onClick={() => setMode('whistleblower')}
             className="px-8 py-2 rounded-full text-sm"
          >
            Whistleblower
          </Button>
          <Button
             variant={mode === 'investigator' ? 'primary' : 'ghost'}
             onClick={() => setMode('investigator')}
             className="px-8 py-2 rounded-full text-sm"
          >
            Investigator
          </Button>
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
  );
};
