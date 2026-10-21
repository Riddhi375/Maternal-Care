import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#EDE3F7]/90 border border-[#DCBEEF] rounded-2xl p-3 text-xs text-[#503477] shadow-soft-sm transition-all mb-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-full bg-[#8B5FBF] text-white flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </span>
          <p className="font-semibold text-xs text-[#503477]">
            Demo Healthcare Prototype — Strictly for Awareness & Simulation
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[#8B5FBF] hover:text-[#503477] p-1 rounded-lg transition-colors flex items-center gap-0.5 text-xs font-medium cursor-pointer"
          aria-expanded={expanded}
        >
          <span>{expanded ? 'Less' : 'Details'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-2.5 pt-2.5 border-t border-[#DCBEEF]/60 text-[11px] leading-relaxed text-[#766C82] space-y-1.5 animate-in fade-in duration-150">
          <p>
            • <strong>No Medical Diagnosis:</strong> MatriCare is an educational and communication prototype. It does not provide clinical diagnoses, medical prescriptions, or replace obstetricians and nurses.
          </p>
          <p>
            • <strong>Simulated Vitals & Sensors:</strong> Health metrics and Smart Band sync statuses are simulated sample data for evaluation.
          </p>
          <p>
            • <strong>Emergency SOS Protocol:</strong> The emergency SOS feature records demo alert events and provides direct dialers (108/102). It does not automatically dispatch live emergency ambulances without real emergency infrastructure integration.
          </p>
          <p className="flex items-center gap-1 text-[#36866A] font-semibold pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Always consult your registered doctor or ASHA worker for any maternal health concerns.
          </p>
        </div>
      )}
    </div>
  );
};
