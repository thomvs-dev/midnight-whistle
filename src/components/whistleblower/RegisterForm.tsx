import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface RegisterFormProps {
  memberData: {
    employeeId: string;
    department: string;
    orgName: string;
  };
  setMemberData: (data: any) => void;
  handleRegister: () => void;
  isProcessing: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  memberData,
  setMemberData,
  handleRegister,
  isProcessing,
}) => {
  return (
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
        <Input
          label="Employee ID *"
          placeholder="EMP-XXXX (never leaves your device)"
          value={memberData.employeeId}
          onChange={(e) => setMemberData({ ...memberData, employeeId: e.target.value })}
        />
        <Input
          label="Department *"
          placeholder="Engineering, Finance, HR..."
          value={memberData.department}
          onChange={(e) => setMemberData({ ...memberData, department: e.target.value })}
        />
        <div className="md:col-span-2">
           <Input
            label="Organization Name"
            placeholder="Acme Corporation"
            value={memberData.orgName}
            onChange={(e) => setMemberData({ ...memberData, orgName: e.target.value })}
          />
        </div>
      </div>

      <Button
        onClick={handleRegister}
        isLoading={isProcessing}
        loadingText="Generating Commitment..."
        fullWidth
      >
        Register Anonymously <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
