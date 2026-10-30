import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Download, Share2, ShieldCheck, Check, Copy, FileText, KeyRound } from 'lucide-react';

export const ShareableRecordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { patient, readings, appointments, medicationLogs, alerts, ashaWorker, addToast } = useApp();

  // Granular Sharing Consent State
  const [includeVitals, setIncludeVitals] = useState(true);
  const [includeAppointments, setIncludeAppointments] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(false);

  const [sharePin] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [copied, setCopied] = useState(false);

  const handleCopyPin = () => {
    navigator.clipboard.writeText(sharePin);
    setCopied(true);
    addToast(`Copied secure sharing PIN (${sharePin}) to clipboard`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportHtml = () => {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MatriCare Maternal Dossier - ${patient.name}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #29213A; max-width: 800px; margin: auto; }
          .header { border-bottom: 2px solid #8B5FBF; padding-bottom: 14px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #503477; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; background: #EDE3F7; color: #503477; }
          .consent-box { background: #FAF6FE; border: 1px solid #DCBEEF; padding: 12px; border-radius: 8px; font-size: 12px; margin: 16px 0; color: #503477; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #EDE3F7; padding: 8px 10px; text-align: left; }
          th { background: #FAF6FE; color: #503477; }
          .footer { margin-top: 30px; font-size: 11px; color: #766C82; border-top: 1px solid #EDE3F7; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">MatriCare — Comprehensive Maternal Health Dossier</div>
          <p>Patient: <strong>${patient.name}</strong> • DOB: ${patient.dob} • Phone: ${patient.phone}</p>
          <p>Stage: <strong>Week ${patient.pregnancyWeek} (Trimester ${patient.trimester})</strong> • Due Date (EDD): <strong>${patient.estimatedDueDate}</strong></p>
          <p>Assigned ASHA: <strong>${ashaWorker.name}</strong> (${ashaWorker.phone}) • Sub-centre: ${ashaWorker.subCentre}</p>
          <span class="badge">Consent-Authorized Clinical Export · PIN: ${sharePin}</span>
        </div>

        <div class="consent-box">
          <strong>PATIENT PRIVACY & CONSENT STATEMENT:</strong> This electronic dossier was exported directly with patient consent. Shared categories: ${includeVitals ? 'Vitals, ' : ''}${includeAppointments ? 'Check-ups, ' : ''}${includeMedications ? 'Medications, ' : ''}${includeAlerts ? 'Safety Alerts' : ''}.
        </div>

        ${
          includeVitals
            ? `
          <h3>Recorded Sensor Telemetry & Vitals</h3>
          <table>
            <tr><th>Metric</th><th>Value</th><th>Status</th><th>Source</th><th>Timestamp</th></tr>
            ${readings.map((r) => `<tr><td>${r.type}</td><td>${r.value} ${r.unit}</td><td>${r.status}</td><td>${r.source}</td><td>${r.timestamp}</td></tr>`).join('')}
          </table>
        `
            : ''
        }

        ${
          includeAppointments
            ? `
          <h3>Antenatal Appointments & Scans</h3>
          <table>
            <tr><th>Check-up / Scan</th><th>Date & Time</th><th>Facility & Doctor</th><th>Status</th></tr>
            ${appointments.map((a) => `<tr><td>${a.title}</td><td>${a.date} at ${a.time}</td><td>${a.facility} (${a.doctorName})</td><td>${a.status}</td></tr>`).join('')}
          </table>
        `
            : ''
        }

        ${
          includeMedications
            ? `
          <h3>Prescribed Supplement Adherence Logs</h3>
          <table>
            <tr><th>Medication</th><th>Dosage</th><th>Scheduled</th><th>Date & Time</th><th>Status</th></tr>
            ${medicationLogs.map((m) => `<tr><td>${m.medicationName}</td><td>${m.dosage}</td><td>${m.scheduledTime}</td><td>${m.date} at ${m.actionTime}</td><td>${m.status}</td></tr>`).join('')}
          </table>
        `
            : ''
        }

        ${
          includeAlerts
            ? `
          <h3>Historical Safety & Risk Alerts</h3>
          <table>
            <tr><th>Alert Title</th><th>Severity</th><th>Timestamp</th><th>Status</th></tr>
            ${alerts.map((a) => `<tr><td>${a.title}</td><td>${a.severity}</td><td>${a.timestamp}</td><td>${a.status}</td></tr>`).join('')}
          </table>
        `
            : ''
        }

        <div class="footer">
          Generated via MatriCare Maternal Care Companion · Verified for doctor review. Confidential health record.
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MatriCare_HealthRecord_${patient.name.replace(/\s+/g, '_')}_Week${patient.pregnancyWeek}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('Downloaded Shareable Maternal Health Record', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shareable Maternal Health Record"
      description="Module 5D (Planned in PDF): Show full history to your doctor without repeating tests."
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportHtml}
            icon={<Download className="w-4 h-4" />}
          >
            Export Dossier (HTML/PDF)
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Consent Options */}
        <div className="p-3 bg-[#FAF6FE] rounded-2xl border border-[#EDE3F7] space-y-2">
          <h4 className="text-xs font-bold text-[#503477] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8B5FBF]" />
            <span>Patient Consent & Shared Information</span>
          </h4>
          <p className="text-[11px] text-[#766C82]">
            You decide which sections to include in your clinical dossier:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EDE3F7] cursor-pointer">
              <input
                type="checkbox"
                checked={includeVitals}
                onChange={(e) => setIncludeVitals(e.target.checked)}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF]"
              />
              <span className="font-semibold text-[#29213A]">Vitals & Telemetry</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EDE3F7] cursor-pointer">
              <input
                type="checkbox"
                checked={includeAppointments}
                onChange={(e) => setIncludeAppointments(e.target.checked)}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF]"
              />
              <span className="font-semibold text-[#29213A]">Checkups & Scans</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EDE3F7] cursor-pointer">
              <input
                type="checkbox"
                checked={includeMedications}
                onChange={(e) => setIncludeMedications(e.target.checked)}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF]"
              />
              <span className="font-semibold text-[#29213A]">Medication Logs</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EDE3F7] cursor-pointer">
              <input
                type="checkbox"
                checked={includeAlerts}
                onChange={(e) => setIncludeAlerts(e.target.checked)}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF]"
              />
              <span className="font-semibold text-[#29213A]">Emergency Alerts</span>
            </label>
          </div>
        </div>

        {/* Doctor PIN Access Card */}
        <div className="p-3 bg-white rounded-2xl border border-[#DCBEEF] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#8B5FBF] uppercase tracking-wide flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              Doctor Access PIN
            </span>
            <p className="text-lg font-mono font-extrabold text-[#503477] tracking-wider mt-0.5">
              {sharePin}
            </p>
            <p className="text-[10px] text-[#766C82]">Valid for 24 hours for PHC / Doctor consult</p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopyPin}
            icon={copied ? <Check className="w-3.5 h-3.5 text-[#36866A]" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy PIN'}
          </Button>
        </div>

        {/* Summary Preview */}
        <div className="p-3 bg-white rounded-2xl border border-[#EDE3F7] text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#503477] font-bold">
            <span>Dossier Summary:</span>
            <span className="text-[11px] text-[#8B5FBF]">Week {patient.pregnancyWeek}</span>
          </div>
          <p className="text-[11px] text-[#766C82]">
            Patient: {patient.name} ({patient.dob}) • Blood Group: {patient.bloodGroup}
          </p>
          <p className="text-[11px] text-[#766C82]">
            Readings: {readings.length} records • Checkups: {appointments.length} visits • Medicines: {medicationLogs.length} doses logged
          </p>
        </div>
      </div>
    </Modal>
  );
};

