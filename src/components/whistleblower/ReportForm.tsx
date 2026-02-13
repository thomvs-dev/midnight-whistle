import React from 'react';
import { Hash } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { REPORT_CATEGORIES } from '../../constants/categories';

interface ReportFormProps {
  reportData: {
    category: string;
    description: string;
    severity: string;
    financialImpact: string;
    witnessCount: string;
  };
  setReportData: (data: any) => void;
  handleSubmitReport: () => void;
  isProcessing: boolean;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  reportData,
  setReportData,
  handleSubmitReport,
  isProcessing,
}) => {
  return (
    <div className="flex flex-col gap-8 py-4 animate-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">File Anonymous Report</h2>
        <p className="text-foreground/60">
          Describe the misconduct. Your report is hashed locally — only the cryptographic fingerprint is published.
        </p>
      </div>

      {/* Category Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Report Category *</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {REPORT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setReportData({ ...reportData, category: cat.id })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                reportData.category === cat.id
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-white/5 border-white/10 text-foreground/40 hover:text-white hover:bg-white/10'
              }`}
            >
              <cat.icon className={`w-5 h-5 ${reportData.category === cat.id ? 'text-primary' : cat.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Description *</label>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10 resize-none h-24"
          placeholder="Describe what happened (this text is hashed locally, never stored or sent anywhere)"
          value={reportData.description}
          onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Severity (1-10) *"
          type="number"
          min={1}
          max={10}
          placeholder="8"
          value={reportData.severity}
          onChange={(e) => setReportData({ ...reportData, severity: e.target.value })}
        />
        <Input
          label="Financial Impact ($K)"
          type="number"
          placeholder="500"
          value={reportData.financialImpact}
          onChange={(e) => setReportData({ ...reportData, financialImpact: e.target.value })}
        />
        <Input
          label="Witnesses"
          type="number"
          placeholder="3"
          value={reportData.witnessCount}
          onChange={(e) => setReportData({ ...reportData, witnessCount: e.target.value })}
        />
      </div>

      <Button
        onClick={handleSubmitReport}
        isLoading={isProcessing}
        loadingText="Hashing Report..."
        fullWidth
      >
        Generate Report Hash <Hash className="w-5 h-5" />
      </Button>
    </div>
  );
};
