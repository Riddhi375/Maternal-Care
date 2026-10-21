import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { TabSelector } from '../components/common/TabSelector';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Pill, 
  Filter, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const HealthHistoryPage: React.FC = () => {
  const { 
    patient, 
    readings, 
    appointments, 
    medicationLogs, 
    alerts, 
    ashaWorker, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'readings' | 'alerts' | 'appointments' | 'meds'>('readings');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d'>('all');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Generate downloadable text / html report
  const handleDownloadReport = () => {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MatriCare Maternal Health Summary - ${patient.name}</title>
        <style>
          body { font-family: sans-serif; padding: 24px; color: #29213A; }
          .header { border-bottom: 2px solid #8B5FBF; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 24px; font-bold; color: #503477; }
          .demo-notice { background: #FAF6FE; border: 1px dashed #DCBEEF; padding: 8px; font-size: 11px; margin: 12px 0; color: #766C82; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
          th, td { border: 1px solid #EDE3F7; padding: 8px; text-align: left; }
          th { background: #FAF6FE; color: #503477; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">MatriCare — Maternal Clinical Health Record</div>
          <p>Generated for: <strong>${patient.name}</strong> (DOB: ${patient.dob}, Phone: ${patient.phone})</p>
          <p>Gestational Stage: <strong>Week ${patient.pregnancyWeek} (Trimester ${patient.trimester})</strong> • EDD: <strong>${patient.estimatedDueDate}</strong></p>
          <p>Assigned ASHA Worker: ${ashaWorker.name} (${ashaWorker.phone}) • Sub-centre: ${ashaWorker.subCentre}</p>
        </div>

        <div class="demo-notice">
          <strong>DEMO CLINICAL DATA NOTICE:</strong> This exported record is generated from the MatriCare demonstration environment for evaluation and health tracking awareness. It does not replace signed medical certifications.
        </div>

        <h3>Recent Vitals & Sensor Readings</h3>
        <table>
          <tr><th>Metric</th><th>Value</th><th>Status</th><th>Source</th><th>Timestamp</th></tr>
          ${readings.map(r => `<tr><td>${r.type}</td><td>${r.value} ${r.unit}</td><td>${r.status}</td><td>${r.source}</td><td>${r.timestamp}</td></tr>`).join('')}
        </table>

        <h3>Antenatal Appointments</h3>
        <table>
          <tr><th>Visit</th><th>Date</th><th>Doctor / Facility</th><th>Type</th><th>Status</th></tr>
          ${appointments.map(a => `<tr><td>${a.title}</td><td>${a.date} (${a.time})</td><td>${a.doctorName} • ${a.facility}</td><td>${a.type}</td><td>${a.status}</td></tr>`).join('')}
        </table>

        <h3>Medication History Logs</h3>
        <table>
          <tr><th>Medication</th><th>Dosage</th><th>Scheduled</th><th>Logged At</th><th>Status</th></tr>
          ${medicationLogs.map(m => `<tr><td>${m.medicationName}</td><td>${m.dosage}</td><td>${m.scheduledTime}</td><td>${m.date} ${m.actionTime}</td><td>${m.status}</td></tr>`).join('')}
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MatriCare_Report_${patient.name.replace(/\s+/g, '_')}_Week${patient.pregnancyWeek}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('Downloaded Maternal Health Summary Report', 'success');
    setIsExportModalOpen(false);
  };

  const isWithinDateFilter = (dateOrTimestampStr: string, filter: 'all' | '7d' | '30d'): boolean => {
    if (filter === 'all') return true;
    const lower = (dateOrTimestampStr || '').toLowerCase();
    if (lower.includes('today') || lower.includes('just now') || lower.includes('yesterday') || lower.includes('3 days ago')) {
      return true;
    }
    const parsed = new Date(dateOrTimestampStr);
    if (!isNaN(parsed.getTime())) {
      const refDate = new Date('2026-10-21');
      const diffDays = Math.abs((refDate.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24));
      if (filter === '7d') return diffDays <= 7;
      if (filter === '30d') return diffDays <= 30;
    }
    return filter === '30d';
  };

  const filteredReadings = readings.filter((r) => isWithinDateFilter(r.timestamp, dateFilter));
  const filteredAppointments = appointments.filter((a) => isWithinDateFilter(a.date, dateFilter));
  const filteredMedicationLogs = medicationLogs.filter((m) => isWithinDateFilter(m.date, dateFilter));
  const filteredAlerts = alerts.filter((a) => isWithinDateFilter(a.timestamp, dateFilter));

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Health History & Reports"
        subtitle="Patient Care Records"
        showBack
        backTo="/home"
        rightAction={
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsExportModalOpen(true)}
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Export Banner Card */}
        <Card variant="highlight" className="p-4 border-[#DCBEEF]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#8B5FBF] uppercase tracking-wide">
                Comprehensive Maternal Dossier
              </span>
              <h2 className="text-sm font-bold text-[#29213A] mt-0.5">
                Generate Doctor-Ready Summary
              </h2>
              <p className="text-xs text-[#766C82] mt-0.5">
                Download a clean report of your vitals, scans, and medicines to share with your obstetrician.
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsExportModalOpen(true)}
              icon={<FileText className="w-4 h-4" />}
            >
              Preview
            </Button>
          </div>
        </Card>

        {/* Tab Selector */}
        <TabSelector
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          tabs={[
            { id: 'readings', label: 'Vitals', badge: filteredReadings.length },
            { id: 'appointments', label: 'Check-ups', badge: filteredAppointments.length },
            { id: 'meds', label: 'Med Logs', badge: filteredMedicationLogs.length },
            { id: 'alerts', label: 'Alerts', badge: filteredAlerts.length },
          ]}
        />

        {/* Date Filter Pills */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[#766C82] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#8B5FBF]" /> Filter Interval:
          </span>
          <div className="flex gap-1.5">
            {[
              { id: 'all', label: 'All Records' },
              { id: '7d', label: 'Past 7 Days' },
              { id: '30d', label: 'Past 30 Days' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDateFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  dateFilter === f.id
                    ? 'bg-[#8B5FBF] text-white shadow-soft-sm'
                    : 'bg-white text-[#766C82] border border-[#EDE3F7]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Vitals Readings */}
        {activeTab === 'readings' && (
          <div className="space-y-2.5">
            {filteredReadings.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#766C82] bg-white rounded-2xl border border-[#EDE3F7]">
                No vital readings recorded within the selected timeframe.
              </div>
            ) : (
              filteredReadings.map((reading) => (
                <Card key={reading.id} className="p-3.5 bg-white border-[#EDE3F7]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#29213A] uppercase tracking-wide">
                          {reading.type}
                        </h3>
                        <p className="text-sm font-extrabold text-[#503477]">
                          {reading.value} <span className="text-xs font-normal text-[#766C82]">{reading.unit}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge variant={reading.status === 'normal' ? 'normal' : 'attention'} size="sm">
                        {reading.status === 'normal' ? 'Normal' : 'Attention'}
                      </Badge>
                      <p className="text-[10px] text-[#766C82] mt-1">
                        {reading.source} • {reading.timestamp}
                      </p>
                    </div>
                  </div>

                  {reading.notes && (
                    <p className="text-[11px] text-[#766C82] mt-2 pt-2 border-t border-[#F6F0FC] italic">
                      "{reading.notes}"
                    </p>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Check-up Records */}
        {activeTab === 'appointments' && (
          <div className="space-y-2.5">
            {filteredAppointments.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#766C82] bg-white rounded-2xl border border-[#EDE3F7]">
                No check-ups found within the selected timeframe.
              </div>
            ) : (
              filteredAppointments.map((apt) => (
                <Card key={apt.id} className="p-3.5 bg-white border-[#EDE3F7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="lavender" size="sm">{apt.type}</Badge>
                    <Badge variant={apt.status === 'completed' ? 'success' : apt.status === 'upcoming' ? 'normal' : 'skipped'} size="sm">
                      {apt.status}
                    </Badge>
                  </div>
                  <h3 className="text-xs font-bold text-[#29213A]">{apt.title}</h3>
                  <p className="text-[11px] text-[#766C82]">
                    {apt.doctorName} • {apt.facility} • {apt.date} at {apt.time}
                  </p>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Medication Logs */}
        {activeTab === 'meds' && (
          <div className="space-y-2.5">
            {filteredMedicationLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#766C82] bg-white rounded-2xl border border-[#EDE3F7]">
                No medication logs recorded within the selected timeframe.
              </div>
            ) : (
              filteredMedicationLogs.map((log) => (
                <Card key={log.id} className="p-3 bg-white border-[#EDE3F7] flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-[#29213A]">{log.medicationName}</h3>
                    <p className="text-[10px] text-[#766C82]">
                      {log.dosage} • {log.date} at {log.actionTime}
                    </p>
                  </div>
                  <Badge variant={log.status === 'taken' ? 'taken' : 'skipped'} size="sm">
                    {log.status === 'taken' ? 'Taken' : 'Skipped'}
                  </Badge>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-2.5">
            {filteredAlerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#766C82] bg-white rounded-2xl border border-[#EDE3F7]">
                No alerts logged within the selected timeframe.
              </div>
            ) : (
              filteredAlerts.map((al) => (
                <Card key={al.id} className="p-3 bg-white border-[#EDE3F7] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#29213A]">{al.title}</span>
                    <Badge variant={al.status === 'resolved' ? 'success' : 'attention'} size="sm">
                      {al.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#766C82]">{al.description}</p>
                  <p className="text-[10px] text-[#8B5FBF] pt-1">{al.timestamp}</p>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Export Report Preview Modal */}
      {isExportModalOpen && (
        <Modal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          title="Maternal Health Summary Export"
          description="Doctor-ready clinical snapshot for antenatal consultations."
          footer={
            <div className="w-full flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadReport}
                icon={<Download className="w-4 h-4" />}
              >
                Download HTML / PDF Format
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FAF6FE] rounded-2xl border border-[#EDE3F7] space-y-1">
              <p className="font-bold text-[#503477]">
                Patient: {patient.name} (Week {patient.pregnancyWeek})
              </p>
              <p className="text-[11px] text-[#766C82]">
                Due Date: {patient.estimatedDueDate} • Blood Group: {patient.bloodGroup}
              </p>
              <p className="text-[11px] text-[#766C82]">
                Primary Contact: {patient.phone} • ASHA Worker: {ashaWorker.name}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#EDE3F7] space-y-1 text-[11px] text-[#766C82]">
              <p>• Includes {readings.length} latest vital records (Heart Rate, SpO2, Temp, BP, Kicks)</p>
              <p>• Includes {appointments.length} antenatal ultrasound & clinical visits</p>
              <p>• Includes {medicationLogs.length} verified supplement adherence entries</p>
              <p>• Clearly labeled with demo provenance badge for ethical review</p>
            </div>
          </div>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
};
