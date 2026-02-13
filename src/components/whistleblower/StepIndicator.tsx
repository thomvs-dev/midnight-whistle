import React from 'react';
import { Shield, FileWarning, Lock, CheckCircle2 } from 'lucide-react';
import { Step } from '../../types';

interface StepIndicatorProps {
  currentStep: Step;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 'register', icon: Shield },
    { id: 'report', icon: FileWarning },
    { id: 'commit', icon: Lock },
    { id: 'success', icon: CheckCircle2 },
  ];

  return (
    <div className="flex justify-between items-center px-4">
      {steps.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div className={`flex flex-col items-center gap-2 ${currentStep === s.id ? 'text-primary' : 'text-foreground/20'}`}>
            <div className={`p-3 rounded-full border ${currentStep === s.id ? 'border-primary bg-primary/10' : 'border-current'}`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
          {idx < 3 && <div className="h-px flex-1 bg-white/10 mx-2" />}
        </React.Fragment>
      ))}
    </div>
  );
};
