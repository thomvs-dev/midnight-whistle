import { useState, useCallback } from 'react';

export const useLogConsole = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  return { logs, addLog };
};
