import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  AlertOctagon, 
  PhoneCall, 
  Users, 
  UserCheck, 
  ShieldAlert, 
  XCircle, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Clock,
  Ambulance,
  HeartPulse
} from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    sosActive, 
    sosEventTime, 
    triggerSOS, 
    cancelSOS, 
    contacts, 
    ashaWorker, 
    patient 
  } = useApp();

  const [activeCallModal, setActiveCallModal] = useState<{
    name: string;
    role: string;
    phone: string;
  } | null>(null);

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  const handleToggleSOS = () => {
    if (sosActive) {
      cancelSOS();
    } else {
      triggerSOS();
    }
  };

  const handleSimulateCall = (name: string, role: string, phone: string) => {
    setActiveCallModal({ name, role, phone });
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Emergency SOS Support"
        subtitle="Critical Medical Assistance"
        showBack
        backTo="/home"
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Big High-Contrast SOS Trigger Button & Status */}
        <Card
          className={`p-6 text-center transition-all ${
            sosActive
              ? 'bg-gradient-to-b from-[#FDECEF] to-white border-2 border-[#D6455D] shadow-sos'
              : 'bg-white border-[#EDE3F7] shadow-soft-md'
          }`}
        >
          <div className="flex flex-col items-center">
            {/* Pulsing Beacon Button */}
            <div className="relative my-2">
              {sosActive && (
                <div className="absolute inset-0 rounded-full bg-[#D6455D]/20 animate-ping" />
              )}
              <button
                onClick={handleToggleSOS}
                className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer ${
                  sosActive
                    ? 'bg-gradient-to-br from-[#D6455D] via-[#B0263E] to-[#801B2E] text-white shadow-sos animate-beacon'
                    : 'bg-gradient-to-br from-[#8B5FBF] to-[#503477] hover:from-[#7346A8] hover:to-[#3e2461] text-white shadow-floating'
                }`}
                aria-label={sosActive ? 'Deactivate Emergency SOS' : 'Activate Emergency SOS'}
              >
                <AlertOctagon className="w-12 h-12 sm:w-14 sm:h-14 mb-1" />
                <span className="text-xl sm:text-2xl font-black tracking-widest uppercase">
                  {sosActive ? 'ACTIVE' : 'SOS'}
                </span>
                <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider mt-0.5">
                  {sosActive ? 'Tap to Stop' : 'Tap for Help'}
                </span>
              </button>
            </div>

            {/* State Announcement */}
            {sosActive ? (
              <div className="mt-4 space-y-1.5 animate-in fade-in duration-200">
                <Badge variant="critical" size="md" dot>
                  EMERGENCY BEACON ACTIVE
                </Badge>
                <p className="text-xs font-bold text-[#B0263E]">
                  Simulated Event Logged at {sosEventTime || 'Just now'}
                </p>
                <p className="text-[11px] text-[#766C82] max-w-xs mx-auto">
                  Alert records generated. Call primary family contact or national ambulance 108 below.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelSOS}
                    className="border-[#D6455D]/50 text-[#D6455D]"
                  >
                    Deactivate SOS Alarm
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-1 text-center">
                <span className="text-xs font-bold text-[#503477]">
                  Tap button above in any maternal emergency
                </span>
                <p className="text-[11px] text-[#766C82] max-w-xs mx-auto">
                  Instantly records emergency event and connects to emergency ambulance (108 / 102), husband & ASHA worker.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Emergency Hotlines Directory */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-[#29213A] flex items-center gap-1.5">
            <Ambulance className="w-4 h-4 text-[#D6455D]" />
            <span>National Emergency Ambulances & Hotlines</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 108 Emergency Ambulance */}
            <Card className="p-3.5 bg-white border-[#EDE3F7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FDECEF] text-[#D6455D] flex items-center justify-center font-black text-sm">
                  108
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#29213A]">
                    National Ambulance (108)
                  </h3>
                  <p className="text-[10px] text-[#766C82]">
                    Free 24x7 Emergency Medical Dispatch
                  </p>
                </div>
              </div>
              <a
                href="tel:108"
                onClick={(e) => {
                  e.preventDefault();
                  handleSimulateCall('National Emergency Ambulance', 'Dispatch Control', '108');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#D6455D] hover:bg-[#B0263E] text-white text-xs font-bold flex items-center gap-1 shadow-soft-sm cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 108</span>
              </a>
            </Card>

            {/* 102 JSSK Free Transport */}
            <Card className="p-3.5 bg-white border-[#EDE3F7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center font-black text-sm">
                  102
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#29213A]">
                    Janani Shishu (102)
                  </h3>
                  <p className="text-[10px] text-[#766C82]">
                    Free Maternity Transport Scheme
                  </p>
                </div>
              </div>
              <a
                href="tel:102"
                onClick={(e) => {
                  e.preventDefault();
                  handleSimulateCall('Janani Shishu Suraksha Transport', 'Maternity Helpline', '102');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#8B5FBF] hover:bg-[#7346A8] text-white text-xs font-bold flex items-center gap-1 shadow-soft-sm cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 102</span>
              </a>
            </Card>
          </div>
        </div>

        {/* Priority Personal Emergency Contacts */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-[#29213A] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#8B5FBF]" />
            <span>Instant Personal Contact Dialers</span>
          </h2>

          <div className="space-y-2.5">
            {/* Primary Trusted Contact */}
            {primaryContact && (
              <Card className="p-3.5 bg-white border-[#EDE3F7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#8B5FBF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-[#29213A]">
                        {primaryContact.name} ({primaryContact.relationship})
                      </h3>
                      <Badge variant="success" size="sm">Primary</Badge>
                    </div>
                    <p className="text-[10px] text-[#766C82] mt-0.5">
                      {primaryContact.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleSimulateCall(
                      primaryContact.name,
                      primaryContact.relationship,
                      primaryContact.phone
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#36866A] hover:bg-[#24634E] text-white text-xs font-bold flex items-center gap-1 shadow-soft-sm cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
              </Card>
            )}

            {/* ASHA Worker */}
            <Card className="p-3.5 bg-white border-[#EDE3F7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F7DCE8] text-[#D95783] flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-[#D95783]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-[#29213A]">
                      ASHA: {ashaWorker.name}
                    </h3>
                    <Badge variant="lavender" size="sm">Local Care</Badge>
                  </div>
                  <p className="text-[10px] text-[#766C82] mt-0.5">
                    {ashaWorker.phone} • {ashaWorker.village}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handleSimulateCall(
                    ashaWorker.name,
                    'ASHA Community Health Worker',
                    ashaWorker.phone
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-[#8B5FBF] hover:bg-[#7346A8] text-white text-xs font-bold flex items-center gap-1 shadow-soft-sm cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call</span>
              </button>
            </Card>
          </div>
        </div>

        {/* Emergency Preparedness Card */}
        <Card className="p-4 bg-[#FAF6FE] border-[#DCBEEF]/80 space-y-2">
          <div className="flex items-center gap-2 text-[#503477]">
            <HeartPulse className="w-4 h-4 text-[#8B5FBF]" />
            <h3 className="text-xs font-bold">What Happens When You Tap SOS?</h3>
          </div>
          <p className="text-[11px] text-[#766C82] leading-relaxed">
            1. An emergency event is logged into your personal maternal care history.
            <br />
            2. Your location coordinates and MCP card number are queued for direct dispatch sharing.
            <br />
            3. Instant call dialers are opened to connect you with 108 ambulance, your husband ({primaryContact?.name}), and your ASHA worker ({ashaWorker.name}).
          </p>
        </Card>
      </div>

      {/* Simulated Call Modal */}
      {activeCallModal && (
        <Modal
          isOpen={Boolean(activeCallModal)}
          onClose={() => setActiveCallModal(null)}
          title={`Calling ${activeCallModal.name}...`}
          description={`Number: ${activeCallModal.phone} (${activeCallModal.role})`}
          footer={
            <div className="w-full flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCallModal(null)}
              >
                Close Simulator
              </Button>
              <a
                href={`tel:${activeCallModal.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#36866A] text-white text-xs font-bold shadow-soft"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Launch Device Phone Dialer</span>
              </a>
            </div>
          }
        >
          <div className="p-4 bg-[#FAF6FE] rounded-2xl border border-[#EDE3F7] text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#EAF5F1] text-[#36866A] flex items-center justify-center mx-auto animate-pulse">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#29213A]">
                Simulating Connection to {activeCallModal.name}
              </p>
              <p className="text-xs text-[#766C82] mt-1">
                Role: {activeCallModal.role}
              </p>
            </div>
            <p className="text-[11px] text-[#766C82] bg-white p-2.5 rounded-xl border border-[#EDE3F7]">
              In production, this triggers your device's native telephony dialer (<code className="text-[#8B5FBF]">tel:{activeCallModal.phone}</code>) directly.
            </p>
          </div>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
};
