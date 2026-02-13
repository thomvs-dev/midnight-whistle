import { useState } from 'react';

declare global {
  interface Window {
    midnight?: any;
  }
}

interface UseWalletReturn {
  walletAddr: string | null;
  isConnecting: boolean;
  isMocked: boolean;
  connectWallet: (addLog: (msg: string) => void) => Promise<void>;
}

export const useWallet = (): UseWalletReturn => {
  const [walletAddr, setWalletAddr] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMocked, setIsMocked] = useState(false);

  const connectWallet = async (addLog: (msg: string) => void) => {
    setIsConnecting(true);
    addLog('Secure: Searching for Midnight Lace extension...');

    try {
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

  return { walletAddr, isConnecting, isMocked, connectWallet };
};
