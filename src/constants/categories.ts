import { DollarSign, AlertTriangle, UserX, Siren, FileText } from 'lucide-react';
import { ReportCategory } from '../types';

export const REPORT_CATEGORIES: ReportCategory[] = [
  { id: 'fraud', label: 'Financial Fraud', icon: DollarSign, color: 'text-red-400' },
  { id: 'safety', label: 'Safety Violation', icon: AlertTriangle, color: 'text-amber-400' },
  { id: 'harassment', label: 'Harassment', icon: UserX, color: 'text-orange-400' },
  { id: 'corruption', label: 'Corruption', icon: Siren, color: 'text-rose-400' },
  { id: 'other', label: 'Other', icon: FileText, color: 'text-zinc-400' },
];
