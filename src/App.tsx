import React, { useState } from 'react';
import { Mode } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StepIndicator } from './components/whistleblower/StepIndicator';
import { RegisterForm } from './components/whistleblower/RegisterForm';
import { ReportForm } from './components/whistleblower/ReportForm';
import { CommitView } from './components/whistleblower/CommitView';
import { SuccessView } from './components/whistleblower/SuccessView';
import { VerificationPanel } from './components/investigator/VerificationPanel';

import { useLogConsole } from './hooks/useLogConsole';
import { useWallet } from './hooks/useWallet';
import { useWhistleblower } from './hooks/useWhistleblower';
import { useInvestigator } from './hooks/useInvestigator';

function App() {
  const [mode, setMode] = useState<Mode>('whistleblower');
  const { logs, addLog } = useLogConsole();
  const { walletAddr, isConnecting, isMocked, connectWallet } = useWallet();

  const whistleblower = useWhistleblower(addLog, walletAddr);
  
  // We need to pass a callback to resolve the current session report for simulation
  const getLocalReport = () => {
     return {
        severity: parseInt(whistleblower.reportData.severity) || 0,
        financialImpact: parseInt(whistleblower.reportData.financialImpact) || 0,
        witnessCount: parseInt(whistleblower.reportData.witnessCount) || 0,
     };
  };

  const investigator = useInvestigator(addLog, whistleblower.reportHash);

  return (
    <div className="relative min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Background Decor */}
      <div className="glow-bg top-0 left-1/4 w-[500px] h-[500px]" />
      <div className="glow-bg bottom-0 right-1/4 w-[400px] h-[400px]" style={{ animationDelay: '-4s' }} />

      <Header
        mode={mode}
        setMode={setMode}
        walletAddr={walletAddr}
        isConnecting={isConnecting}
        isMocked={isMocked}
        connectWallet={() => connectWallet(addLog)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-8 w-full max-w-7xl">
        <main className="glass p-8 flex flex-col gap-8">
          {mode === 'whistleblower' ? (
            <>
              <StepIndicator currentStep={whistleblower.step} />
              
              {whistleblower.step === 'register' && (
                <RegisterForm 
                    memberData={whistleblower.memberData} 
                    setMemberData={whistleblower.setMemberData}
                    handleRegister={whistleblower.handleRegister}
                    isProcessing={whistleblower.isProcessing}
                />
              )}

              {whistleblower.step === 'report' && (
                <ReportForm
                    reportData={whistleblower.reportData}
                    setReportData={whistleblower.setReportData}
                    handleSubmitReport={whistleblower.handleSubmitReport}
                    isProcessing={whistleblower.isProcessing}
                />
              )}

              {whistleblower.step === 'commit' && (
                <CommitView
                    membershipHash={whistleblower.membershipHash}
                    reportHash={whistleblower.reportHash}
                    hasCopied={whistleblower.hasCopied}
                    copyHash={whistleblower.copyHash}
                    handlePublish={whistleblower.handlePublish}
                    isProcessing={whistleblower.isProcessing}
                />
              )}

              {whistleblower.step === 'success' && (
                <SuccessView
                    onNewReport={() => whistleblower.resetForm()}
                    onSwitchToInvestigator={() => {
                        setMode('investigator');
                        investigator.setInvestigatorHash(whistleblower.reportHash);
                    }}
                />
              )}
            </>
          ) : (
            <VerificationPanel
                investigatorHash={investigator.investigatorHash}
                setInvestigatorHash={investigator.setInvestigatorHash}
                vType={investigator.vType}
                setVType={investigator.setVType}
                verifyStatus={investigator.verifyStatus}
                setVerifyStatus={investigator.setVerifyStatus}
                severityThreshold={investigator.severityThreshold}
                setSeverityThreshold={investigator.setSeverityThreshold}
                financialThreshold={investigator.financialThreshold}
                setFinancialThreshold={investigator.setFinancialThreshold}
                witnessThreshold={investigator.witnessThreshold}
                setWitnessThreshold={investigator.setWitnessThreshold}
                handleVerify={() => investigator.handleVerify(getLocalReport)}
            />
          )}
        </main>

        <Sidebar isMocked={isMocked} logs={logs} />
      </div>

      <style>{`
        .animate-in {
          animation: slideUpFade 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
