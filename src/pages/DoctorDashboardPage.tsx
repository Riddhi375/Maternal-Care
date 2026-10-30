import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { TabSelector } from '../components/common/TabSelector';
import { HealthMetricChart } from '../components/charts/HealthMetricChart';
import { AiSummaryService } from '../services/aiSummaryService';
import { 
  Stethoscope, 
  Lock, 
  FileText, 
  Calendar, 
  Activity, 
  Heart, 
  Sparkles, 
  Download, 
  Share2, 
  Pill, 
  ShieldCheck, 
  Clock,
  Send
} from 'lucide-react';
import { ShareableRecordModal } from '../components/common/ShareableRecordModal';

export const DoctorDashboardPage: React.FC = () => {
  const { 
    patient, 
    readings, 
    appointments, 
    medications, 
    medicationLogs, 
    alerts, 
    chartData24h, 
    currentRiskAssessment,
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'ai_summary' | 'meds'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<'heartRate' | 'spo2' | 'temperature' | 'bloodPressure'>('heartRate');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Generate dynamic AI clinical summary
  const summary = AiSummaryService.generateSummary(
    'weekly',
    patient,
    readings,
    medications,
    medicationLogs,
    alerts,
    appointments
  );

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Doctor & PHC Clinical Portal"
        subtitle="Read-Only 9-Month Longitudinal Review"
        showBack
        backTo="/home"
        rightAction={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsShareModalOpen(true)}
            icon={<FileText className="w-4 h-4" />}
          >
            Export Dossier
          </Button>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Clinician Access Banner */}
        <div className="p-3.5 bg-white rounded-3xl border border-[#EDE3F7] shadow-soft-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EDE3F7] text-[#503477] flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5 text-[#8B5FBF]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#29213A]">Dr. Meera Nambiar</span>
                <span className="text-[10px] bg-[#EDE3F7] text-[#503477] px-2 py-0.5 rounded-full font-bold">
                  Obstetrician
                </span>
              </div>
              <p className="text-xs text-[#766C82]">
                District Women's Hospital · Medical Reg: MCI-UP-88219
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#766C82] bg-[#FAF6FE] px-2.5 py-1 rounded-xl border border-[#DCBEEF]">
            <Lock className="w-3.5 h-3.5 text-[#8B5FBF]" />
            <span>Read-Only Portal</span>
          </div>
        </div>

        {/* Patient Clinical Profile Header */}
        <Card variant="highlight" className="p-4 border-[#DCBEEF] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#8B5FBF] uppercase">
                Active Patient Record
              </span>
              <h2 className="text-base font-extrabold text-[#29213A] mt-0.5">
                {patient.name} (DOB: {patient.dob}, Blood Group: {patient.bloodGroup})
              </h2>
              <p className="text-xs text-[#766C82]">
                Gestational Age: <strong>Week {patient.pregnancyWeek} (Trimester {patient.trimester})</strong> · Gravida {patient.gravida}, Para {patient.para}
              </p>
            </div>

            <Badge
              variant={
                currentRiskAssessment.category === 'Possible Emergency'
                  ? 'critical'
                  : currentRiskAssessment.category === 'Warning'
                  ? 'warning'
                  : 'normal'
              }
              size="sm"
            >
              {currentRiskAssessment.category}
            </Badge>
          </div>

          <div className="p-2.5 rounded-2xl bg-white border border-[#EDE3F7] grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#766C82] block">Estimated Due Date</span>
              <strong className="text-[#503477]">{patient.estimatedDueDate}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#766C82] block">Primary Location</span>
              <strong className="text-[#503477]">{patient.city}, {patient.state}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#766C82] block">Telemetry Status</span>
              <strong className="text-[#36866A]">● Active Stream</strong>
            </div>
          </div>
        </Card>

        <DisclaimerBanner />

        {/* Tab Navigation */}
        <TabSelector
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          tabs={[
            { id: 'overview', label: 'Clinical Overview' },
            { id: 'trends', label: 'Vitals Trends' },
            { id: 'ai_summary', label: 'AI Health Summary' },
            { id: 'meds', label: 'Prescription Adherence' },
          ]}
        />

        {/* Tab 1: Clinical Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* Explainable Risk Assessment Box */}
            <div className="p-4 rounded-3xl bg-white border border-[#EDE3F7] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#503477] uppercase tracking-wide">
                  Explainable Risk Analysis (Rule-Based AI)
                </h3>
                <span className="text-[10px] text-[#766C82]">{currentRiskAssessment.timestamp}</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#DCBEEF] space-y-1.5 text-xs">
                <p className="font-bold text-[#29213A]">{currentRiskAssessment.title}</p>
                <p className="text-[#766C82] leading-relaxed">
                  Reason: {currentRiskAssessment.reason}
                </p>
                <div className="pt-1 text-[11px] text-[#8B5FBF]">
                  <strong>Recommended Clinical Protocol:</strong> {currentRiskAssessment.recommendedAction}
                </div>
              </div>
            </div>

            {/* Antenatal Checkups & Scans */}
            <div className="p-4 rounded-3xl bg-white border border-[#EDE3F7] space-y-2.5">
              <h3 className="text-xs font-bold text-[#503477] uppercase tracking-wide">
                Antenatal Check-up Timeline ({appointments.length} Total)
              </h3>

              <div className="space-y-2">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#EDE3F7] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#29213A]">{apt.title}</span>
                      <p className="text-[10px] text-[#766C82]">
                        {apt.date} ({apt.time}) · {apt.facility}
                      </p>
                    </div>
                    <Badge variant={apt.status === 'completed' ? 'success' : 'normal'} size="sm">
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vitals Trends */}
        {activeTab === 'trends' && (
          <div className="space-y-3">
            <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
              {[
                { id: 'heartRate', label: 'Heart Rate (bpm)' },
                { id: 'spo2', label: 'SpO2 Oxygen (%)' },
                { id: 'bloodPressure', label: 'Blood Pressure' },
                { id: 'temperature', label: 'Temperature (°F)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMetric(m.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedMetric === m.id
                      ? 'bg-[#8B5FBF] text-white shadow-soft-sm'
                      : 'bg-white text-[#766C82] border border-[#EDE3F7]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <HealthMetricChart
              data={chartData24h}
              type={selectedMetric}
              timeframe="24h"
              unit={selectedMetric === 'heartRate' ? 'bpm' : selectedMetric === 'spo2' ? '%' : selectedMetric === 'bloodPressure' ? 'mmHg' : '°F'}
            />
          </div>
        )}

        {/* Tab 3: AI Health Summary (Module 2D Planned) */}
        {activeTab === 'ai_summary' && (
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-[#FAF6FE] to-white rounded-2xl border border-[#DCBEEF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8B5FBF]" />
                <div>
                  <h4 className="text-xs font-bold text-[#29213A]">
                    Module 2D: AI Plain-Language Health Summary
                  </h4>
                  <p className="text-[10px] text-[#766C82]">
                    Generated from past 7 days of sensor readings, alerts & compliance logs.
                  </p>
                </div>
              </div>
              <Badge variant="lavender" size="sm">Planned in PDF</Badge>
            </div>

            {/* ASHA / Doctor Clinical View */}
            <Card className="p-4 bg-white border-[#EDE3F7] space-y-2">
              <span className="text-[10px] font-bold text-[#8B5FBF] uppercase">
                1. Clinical Overview (For Doctor / ASHA)
              </span>
              <pre className="font-sans text-xs text-[#29213A] whitespace-pre-wrap leading-relaxed bg-[#FAF6FE] p-3 rounded-2xl border border-[#EDE3F7]">
                {summary.ashaSummary}
              </pre>
            </Card>

            {/* Mother Plain Language Summary */}
            <Card className="p-4 bg-white border-[#EDE3F7] space-y-2">
              <span className="text-[10px] font-bold text-[#8B5FBF] uppercase">
                2. Mother Summary (Simple Language)
              </span>
              <p className="text-xs text-[#29213A] leading-relaxed bg-[#FAF6FE] p-3 rounded-2xl border border-[#EDE3F7]">
                {summary.motherSummary}
              </p>
            </Card>

            {/* Key Metric Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {summary.keyMetricsSummary.map((k, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white border border-[#EDE3F7] space-y-1">
                  <span className="text-[10px] font-bold text-[#8B5FBF] block">{k.metric}</span>
                  <Badge variant={k.status === 'Stable' ? 'success' : 'attention'} size="sm">
                    {k.status}
                  </Badge>
                  <p className="text-[10px] text-[#766C82]">{k.detail}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#766C82] text-center italic">
              {summary.disclaimer}
            </p>
          </div>
        )}

        {/* Tab 4: Medications */}
        {activeTab === 'meds' && (
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-2xl border border-[#EDE3F7] flex items-center justify-between text-xs">
              <span className="font-bold text-[#29213A]">Medication Adherence Compliance</span>
              <strong className="text-[#36866A] text-sm">{summary.adherenceRate}% Logged</strong>
            </div>

            <div className="space-y-2">
              {medications.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-white rounded-2xl border border-[#EDE3F7] flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-[#29213A]">{m.name}</h5>
                    <p className="text-[10px] text-[#766C82]">
                      {m.dosage} · {m.frequency} (Scheduled: {m.scheduledTime})
                    </p>
                  </div>
                  <Badge variant={m.status === 'taken' ? 'success' : 'pending'} size="sm">
                    {m.status === 'taken' ? 'Taken Today' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ShareableRecordModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};
