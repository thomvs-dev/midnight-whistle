import { DollarSign, AlertTriangle, UserX, Siren, FileText } from 'lucide-react';

export type Mode = 'whistleblower' | 'investigator';
export type Step = 'register' | 'report' | 'commit' | 'success';
export type VerificationType = 'severity' | 'financial' | 'witnesses';

export interface ReportCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
}
