import React, { useRef, useEffect } from 'react';
import { EyeOff, Lock, Shield, Terminal as TerminalIcon, Cpu } from 'lucide-react';
import { Card } from '../common/Card';

interface SidebarProps {
  isMocked: boolean;
  logs: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isMocked, logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [logs]);

  return (
    <aside className="flex flex-col gap-8">
      {/* Stack Status */}
      <Card variant="terminal" className="space-y-4">
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
      </Card>

      {/* Anonymous Status */}
      <Card variant="terminal" className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40">Privacy Shield</h3>
        <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
          <EyeOff className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-500 font-medium">Identity Protected</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
          <Lock className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-500 font-medium">Data Encrypted Locally</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-500 font-medium">ZK Proofs Active</span>
        </div>
      </Card>

      {/* Console */}
      <Card variant="terminal" className="flex-1 flex flex-col min-h-[350px]">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-foreground/30 mb-4">
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
        <div className="p-4 space-y-3 overflow-y-auto font-mono text-[11px] leading-relaxed flex-1">
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
      </Card>
    </aside>
  );
};
