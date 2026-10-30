import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Modal } from '../components/common/Modal';
import { 
  Heart, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Phone, 
  Clock, 
  MapPin, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  User, 
  Check,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export const FamilyDashboardPage: React.FC = () => {
  const { 
    patient, 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    ashaWorker, 
    currentRiskAssessment, 
    readings, 
    appointments, 
    sosActive, 
    fallState,
    addToast 
  } = useApp();

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  const isEmergency = sosActive || (!fallState.resolved && fallState.secondsRemaining === 0) || currentRiskAssessment.category === 'Possible Emergency';
  const isWarning = currentRiskAssessment.category === 'Warning';

  const nextApt = appointments.find((a) => a.status === 'upcoming');
  const latestHr = readings.find((r) => r.type === 'heartRate')?.value || 78;
  const latestBp = readings.find((r) => r.type === 'bloodPressure')?.value || '118/76';

  const handleMarkSafe = (alertId?: string) => {
    if (alertId) {
      resolveAlert(alertId, 'Husband (Rohan Sharma)');
    }
    setIsVerifyModalOpen(false);
    addToast(`Marked ${patient.name} as Safe after verification phone call. Logged across dashboards.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Family Care Dashboard"
        subtitle="Peace of Mind From Far Away"
        showBack
        backTo="/home"
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Active Safety Status Card */}
        <Card
          variant="highlight"
          className={`p-5 rounded-3xl border-2 transition-all ${
            isEmergency
              ? 'border-[#D6455D] bg-gradient-to-br from-[#FDECEF] to-white shadow-sos'
              : isWarning
              ? 'border-[#D58A35] bg-gradient-to-br from-[#FEF6EC] to-white'
              : 'border-[#B6E2D3] bg-gradient-to-br from-[#EAF5F1] to-white'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isEmergency
                    ? 'bg-[#D6455D] text-white animate-beacon'
                    : isWarning
                    ? 'bg-[#D58A35] text-white'
                    : 'bg-[#36866A] text-white'
                }`}
              >
                {isEmergency ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : isWarning ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#503477]">
                  Remote Family Monitor · Rohan Sharma
                </span>
                <h2 className="text-lg font-extrabold text-[#29213A] mt-0.5">
                  {isEmergency
                    ? `⚠️ Urgent: Check on ${patient.name}!`
                    : isWarning
                    ? `Notice: Elevated Reading for ${patient.name}`
                    : `${patient.name} is Currently Safe`}
                </h2>
                <p className="text-xs text-[#766C82] mt-0.5 leading-relaxed">
                  {isEmergency
                    ? 'Possible fall or emergency alert flagged. Please verify with a phone call.'
                    : isWarning
                    ? currentRiskAssessment.reason
                    : 'Smart Band connected. All vitals and movements are normal today.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Calling & Verification Actions */}
          <div className="mt-4 pt-3 border-t border-black/5 flex flex-wrap gap-2">
            <a
              href={`tel:${patient.phone}`}
              className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-[#503477] hover:bg-[#3D265C] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {patient.name}</span>
            </a>

            <button
              onClick={() => setIsVerifyModalOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-white border border-[#36866A] text-[#36866A] hover:bg-[#EAF5F1] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark as Safe</span>
            </button>

            <a
              href={`tel:${ashaWorker.phone}`}
              className="py-2.5 px-3 rounded-xl bg-white border border-[#EDE3F7] text-[#503477] hover:bg-[#FAF6FE] font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#8B5FBF]" />
              <span>Call ASHA Sunita</span>
            </a>
          </div>
        </Card>

        <DisclaimerBanner />

        {/* Clear Wording Emergency Alerts Feed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#29213A] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8B5FBF]" />
              <span>Plain-Language Safety Alerts</span>
            </h3>
            <span className="text-[10px] text-[#766C82]">Instant Notification Feed</span>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 4).map((alt) => (
              <Card
                key={alt.id}
                className={`p-3.5 bg-white border-[#EDE3F7] space-y-2 ${
                  alt.severity === 'critical' ? 'border-l-4 border-l-[#D6455D]' : 'border-l-4 border-l-[#D58A35]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={alt.severity === 'critical' ? 'critical' : 'warning'} size="sm">
                      {alt.severity === 'critical' ? 'Urgent Alert' : 'Advisory'}
                    </Badge>
                    <span className="text-[10px] text-[#766C82]">{alt.timestamp}</span>
                  </div>
                  <Badge variant={alt.status === 'resolved' ? 'success' : 'attention'} size="sm">
                    {alt.status === 'resolved' ? 'Verified Safe' : 'Needs Check'}
                  </Badge>
                </div>

                <h4 className="text-xs font-bold text-[#29213A]">{alt.title}</h4>
                <p className="text-xs text-[#766C82] leading-relaxed">
                  {alt.description}
                </p>

                <div className="p-2 rounded-xl bg-[#FAF6FE] text-[11px] text-[#503477] font-medium flex items-center justify-between">
                  <span>Recommendation: {alt.actionRecommended || 'Check in with her via phone.'}</span>
                </div>

                {alt.status === 'attention' && (
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#F6F0FC]">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleMarkSafe(alt.id)}
                    >
                      Acknowledge & Confirm Safe
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Authorized Patient Overview (Consent Governed) */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE3F7] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#503477] uppercase tracking-wide">
              Authorized Pregnancy Summary
            </h3>
            <span className="text-xs font-bold text-[#8B5FBF]">
              Week {patient.pregnancyWeek} (Trimester {patient.trimester})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#EDE3F7]">
              <span className="text-[10px] text-[#766C82] block">Current Pulse</span>
              <strong className="text-base text-[#503477]">{latestHr} bpm</strong>
              <span className="text-[10px] text-[#36866A] block mt-0.5">● Resting Target OK</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#EDE3F7]">
              <span className="text-[10px] text-[#766C82] block">Blood Pressure</span>
              <strong className="text-base text-[#503477]">{latestBp}</strong>
              <span className="text-[10px] text-[#36866A] block mt-0.5">● Normal Range</span>
            </div>
          </div>

          {nextApt && (
            <div className="p-3 rounded-2xl bg-[#F6F0FC] text-xs space-y-1">
              <span className="text-[10px] font-bold text-[#8B5FBF] uppercase">Next Planned Clinic Check-up:</span>
              <p className="font-bold text-[#29213A]">{nextApt.title}</p>
              <p className="text-[11px] text-[#766C82]">
                {nextApt.date} at {nextApt.time} • {nextApt.facility} ({nextApt.doctorName})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verify & Mark Safe Modal */}
      {isVerifyModalOpen && (
        <Modal
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          title={`Confirm Safety of ${patient.name}`}
          description="Did you speak with her or have someone verify her situation in person?"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsVerifyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" size="sm" onClick={() => handleMarkSafe(activeAlertId || undefined)}>
                Yes, She is Safe
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs text-[#766C82]">
            <p>
              By confirming, this safety alert will be recorded as <strong>Resolved</strong> by family member Rohan Sharma. The updated status will be transmitted immediately to ASHA worker Sunita Devi and the hospital system.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

