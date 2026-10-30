import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { TabSelector } from '../components/common/TabSelector';
import { MULTI_PATIENT_ROSTER, DemoPatientSummary } from '../data/mockData';
import { 
  Search, 
  CheckCircle2, 
  Phone, 
  ChevronRight, 
  HeartHandshake,
  MapPin,
  Check
} from 'lucide-react';

export const AshaDashboardPage: React.FC = () => {
  const { 
    ashaWorker, 
    alerts, 
    acknowledgeAlert, 
    ashaFollowUps, 
    updateFollowUpStatus, 
    patient, 
    readings, 
    currentRiskAssessment,
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'roster' | 'followups' | 'alerts'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<DemoPatientSummary | null>(null);
  const [visitModalPatient, setVisitModalPatient] = useState<DemoPatientSummary | null>(null);
  const [visitNotes, setVisitNotes] = useState('Checked blood pressure, reviewed IFA tablets. Patient advised on left-side sleeping posture.');

  // Synchronize our active live patient (Ananya Sharma) into the roster dynamically
  const liveRoster: DemoPatientSummary[] = MULTI_PATIENT_ROSTER.map((p) => {
    if (p.id === patient.id) {
      const latestHr = readings.find((r) => r.type === 'heartRate')?.value || 78;
      const latestSpo2 = readings.find((r) => r.type === 'spo2')?.value || 98;
      const latestBp = readings.find((r) => r.type === 'bloodPressure')?.value || '118/76';
      return {
        ...p,
        pregnancyWeek: patient.pregnancyWeek,
        trimester: patient.trimester,
        riskCategory: currentRiskAssessment.category,
        priorityOrder: currentRiskAssessment.category === 'Possible Emergency' ? 0 : currentRiskAssessment.category === 'Warning' ? 2 : 4,
        latestVitals: {
          heartRate: Number(latestHr),
          spo2: Number(latestSpo2),
          bp: String(latestBp),
          temperature: 98.4,
          movement: 'Normal',
        },
        latestAlertReason: currentRiskAssessment.reason,
      };
    }
    return p;
  });

  // Sort by risk priority: Possible Emergency (top) -> Warning -> Normal
  const sortedRoster = [...liveRoster].sort((a, b) => {
    const riskRank = { 'Possible Emergency': 1, 'Warning': 2, 'Normal': 3 };
    return riskRank[a.riskCategory] - riskRank[b.riskCategory];
  });

  const filteredRoster = sortedRoster.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.riskCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emergencyCount = liveRoster.filter((p) => p.riskCategory === 'Possible Emergency').length;
  const warningCount = liveRoster.filter((p) => p.riskCategory === 'Warning').length;

  const handleLogVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitModalPatient) return;
    addToast(`Home visit logged for ${visitModalPatient.name}. Recorded in health dossier.`, 'success');
    setVisitModalPatient(null);
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="ASHA / ANM Priority Dashboard"
        subtitle={`Worker: ${ashaWorker.name} (${ashaWorker.workerId})`}
        showBack
        backTo="/home"
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* ASHA Info Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE3F7] shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF6FE] border border-[#DCBEEF] flex items-center justify-center font-bold text-[#503477]">
                <HeartHandshake className="w-6 h-6 text-[#8B5FBF]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#29213A]">{ashaWorker.name}</h2>
                <p className="text-xs text-[#766C82]">
                  {ashaWorker.village} · {ashaWorker.assignedBlock}
                </p>
                <p className="text-[10px] text-[#8B5FBF] font-semibold">
                  Sub-Centre: {ashaWorker.subCentre}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#8B5FBF] uppercase block">
                Assigned Mothers
              </span>
              <span className="text-xl font-extrabold text-[#503477]">
                {liveRoster.length}
              </span>
            </div>
          </div>

          {/* Priority Triage Summary Chips */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F6F0FC] text-center text-xs">
            <div className="p-2 rounded-xl bg-[#FDECEF] border border-[#F8BCC7]">
              <span className="block text-base font-extrabold text-[#D6455D]">{emergencyCount}</span>
              <span className="text-[10px] font-bold text-[#D6455D]">Emergencies</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FEF6EC] border border-[#FBE1C2]">
              <span className="block text-base font-extrabold text-[#D58A35]">{warningCount}</span>
              <span className="text-[10px] font-bold text-[#D58A35]">Warnings</span>
            </div>
            <div className="p-2 rounded-xl bg-[#EAF5F1] border border-[#B6E2D3]">
              <span className="block text-base font-extrabold text-[#36866A]">
                {liveRoster.length - emergencyCount - warningCount}
              </span>
              <span className="text-[10px] font-bold text-[#36866A]">Stable / Normal</span>
            </div>
          </div>
        </div>

        <DisclaimerBanner />

        {/* Tab Selector */}
        <TabSelector
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          tabs={[
            { id: 'roster', label: 'Patient Priority Queue', badge: liveRoster.length },
            { id: 'followups', label: 'Follow-ups & Visits', badge: ashaFollowUps.filter((f) => f.status === 'pending').length },
            { id: 'alerts', label: 'Active Alerts', badge: alerts.filter((a) => a.status === 'attention').length },
          ]}
        />

        {/* Tab 1: Patient Priority Queue */}
        {activeTab === 'roster' && (
          <div className="space-y-3">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#766C82]" />
              <input
                type="text"
                placeholder="Search by patient name, village, or risk level..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white rounded-2xl border border-[#EDE3F7] text-xs text-[#29213A] placeholder-[#766C82] focus:outline-none focus:ring-2 focus:ring-[#8B5FBF]"
              />
            </div>

            <div className="space-y-2.5">
              {filteredRoster.map((p) => {
                const isEmergency = p.riskCategory === 'Possible Emergency';
                const isWarning = p.riskCategory === 'Warning';
                return (
                  <Card
                    key={p.id}
                    className={`p-4 bg-white border-[#EDE3F7] space-y-2.5 transition-all ${
                      isEmergency
                        ? 'border-2 border-[#D6455D] bg-gradient-to-r from-[#FDECEF]/30 to-white'
                        : isWarning
                        ? 'border-l-4 border-l-[#D58A35]'
                        : 'border-l-4 border-l-[#36866A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              isEmergency ? 'critical' : isWarning ? 'warning' : 'normal'
                            }
                            size="sm"
                          >
                            {p.riskCategory}
                          </Badge>
                          <span className="text-xs font-semibold text-[#8B5FBF]">
                            Week {p.pregnancyWeek} (T{p.trimester})
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#29213A] mt-1">
                          {p.name} ({p.age} yrs)
                        </h3>
                        <p className="text-[11px] text-[#766C82] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#8B5FBF]" />
                          {p.address}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <a
                          href={`tel:${p.phone}`}
                          className="p-2 rounded-xl bg-[#EDE3F7] hover:bg-[#DCBEEF] text-[#503477] transition-all flex items-center gap-1 text-xs font-bold"
                          title="Call Patient"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>

                    {/* Vitals Summary Strip */}
                    <div className="p-2.5 rounded-xl bg-[#FAF6FE] grid grid-cols-4 gap-1 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[#766C82] block">Pulse</span>
                        <strong className="text-[#503477]">{p.latestVitals.heartRate} bpm</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#766C82] block">SpO2</span>
                        <strong className="text-[#503477]">{p.latestVitals.spo2}%</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#766C82] block">BP</span>
                        <strong className="text-[#503477]">{p.latestVitals.bp}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#766C82] block">Missed Meds</span>
                        <strong className={p.missedMedicinesCount > 0 ? 'text-[#D6455D]' : 'text-[#36866A]'}>
                          {p.missedMedicinesCount}
                        </strong>
                      </div>
                    </div>

                    {p.latestAlertReason && (
                      <p className={`text-[11px] p-2 rounded-xl ${isEmergency ? 'bg-[#FDECEF] text-[#D6455D] font-bold' : 'text-[#766C82] bg-[#F6F0FC]'}`}>
                        {isEmergency && '🚨 '}
                        {p.latestAlertReason}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#F6F0FC] text-xs">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="text-[#8B5FBF] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View 9-Month Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setVisitModalPatient(p)}
                          className="px-2.5 py-1 rounded-xl bg-[#EDE3F7] hover:bg-[#DCBEEF] text-[#503477] font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Log Home Visit
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Follow-ups */}
        {activeTab === 'followups' && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#8B5FBF] uppercase tracking-wide">
              Pending ASHA Action Items ({ashaFollowUps.length})
            </h3>

            {ashaFollowUps.map((fol) => (
              <Card key={fol.id} className="p-3.5 bg-white border-[#EDE3F7] space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={fol.status === 'completed' ? 'success' : fol.type === 'fall_check' ? 'critical' : 'warning'} size="sm">
                    {fol.status === 'completed' ? 'Completed' : fol.status === 'in_progress' ? 'In Progress' : 'Action Required'}
                  </Badge>
                  <span className="text-[10px] text-[#766C82]">{fol.createdDate}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#29213A]">{fol.title}</h4>
                  <p className="text-[11px] font-semibold text-[#8B5FBF]">
                    Patient: {fol.patientName}
                  </p>
                  <p className="text-xs text-[#766C82] mt-0.5 leading-relaxed">
                    {fol.description}
                  </p>
                </div>

                {fol.notes && (
                  <p className="p-2 rounded-xl bg-[#FAF6FE] text-[10px] text-[#503477] italic">
                    Note: "{fol.notes}"
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#F6F0FC]">
                  {fol.status !== 'completed' ? (
                    <button
                      onClick={() => updateFollowUpStatus(fol.id, 'completed', 'Verified in person during home visit.')}
                      className="px-3 py-1.5 rounded-xl bg-[#EAF5F1] hover:bg-[#B6E2D3] text-[#24634E] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#36866A]" />
                      <span>Mark Follow-up Done</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-[#36866A] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#8B5FBF] uppercase tracking-wide">
              Recent Safety Signals
            </h3>

            {alerts.map((alt) => (
              <Card key={alt.id} className="p-3.5 bg-white border-[#EDE3F7] space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={alt.severity === 'critical' ? 'critical' : 'warning'} size="sm">
                    {alt.severity}
                  </Badge>
                  <span className="text-[10px] text-[#766C82]">{alt.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-[#29213A]">{alt.title}</h4>
                <p className="text-xs text-[#766C82] leading-relaxed">{alt.description}</p>

                <div className="flex items-center justify-between pt-1 border-t border-[#F6F0FC]">
                  <span className="text-[10px] text-[#766C82]">
                    Status: <strong className="text-[#503477]">{alt.status}</strong>
                  </span>
                  {alt.status === 'attention' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => acknowledgeAlert(alt.id, `ASHA ${ashaWorker.name}`)}
                    >
                      Acknowledge as ASHA
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`Patient Dossier: ${selectedPatient.name}`}
          description={`Week ${selectedPatient.pregnancyWeek} · Priority Rank #${selectedPatient.priorityOrder}`}
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#DCBEEF] space-y-1">
              <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p>
                <strong>Emergency Family Contact:</strong> {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relation}) —{' '}
                <a href={`tel:${selectedPatient.emergencyContact.phone}`} className="text-[#8B5FBF] underline font-bold">
                  {selectedPatient.emergencyContact.phone}
                </a>
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#EDE3F7] space-y-1.5">
              <h5 className="font-bold text-[#503477]">Latest Telemetry Stream:</h5>
              <p>Pulse: {selectedPatient.latestVitals.heartRate} bpm · SpO2: {selectedPatient.latestVitals.spo2}%</p>
              <p>Blood Pressure: {selectedPatient.latestVitals.bp} mmHg · Temp: {selectedPatient.latestVitals.temperature}°F</p>
              <p>Fetal Movement: {selectedPatient.latestVitals.movement}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Log Home Visit Modal */}
      {visitModalPatient && (
        <Modal
          isOpen={!!visitModalPatient}
          onClose={() => setVisitModalPatient(null)}
          title={`Log Home Visit: ${visitModalPatient.name}`}
          description="Record in-person maternal health review."
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setVisitModalPatient(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleLogVisit}>
                Save Visit Record
              </Button>
            </div>
          }
        >
          <form onSubmit={handleLogVisit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#29213A] block mb-1">
                Clinical Observation Notes
              </label>
              <textarea
                rows={3}
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                className="w-full p-2.5 bg-[#F6F0FC] rounded-xl text-xs text-[#29213A] focus:outline-none focus:ring-2 focus:ring-[#8B5FBF]"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
