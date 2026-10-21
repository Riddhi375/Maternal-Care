import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FormField } from '../components/common/FormField';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  UserCheck, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Award,
  Send,
  Building
} from 'lucide-react';

export const AshaContactPage: React.FC = () => {
  const { ashaWorker, addToast } = useApp();

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsMessageModalOpen(false);
      setMessageText('');
      addToast(`Simulated message queued for ASHA Worker ${ashaWorker.name}`, 'info');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="My ASHA Worker"
        subtitle="Community Healthcare Support"
        showBack
        backTo="/home"
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* ASHA Worker Hero Card */}
        <Card variant="highlight" className="p-5 border-[#DCBEEF] text-center relative overflow-hidden">
          <div className="flex flex-col items-center">
            {/* Avatar / Photo */}
            <div className="relative mb-3">
              <img
                src={ashaWorker.avatarUrl}
                alt={ashaWorker.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-soft-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-[#36866A] text-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#29213A]">
                  {ashaWorker.name}
                </h1>
                <Badge variant="success" size="sm">
                  Verified ASHA
                </Badge>
              </div>

              <p className="text-xs font-semibold text-[#8B5FBF]">
                Worker ID: {ashaWorker.workerId} • {ashaWorker.experienceYears} Years Experience
              </p>
              <p className="text-xs text-[#766C82]">
                Accredited Social Health Activist (NHM, Uttar Pradesh)
              </p>
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="flex items-center gap-3 w-full max-w-xs mt-4 pt-3 border-t border-[#EDE3F7]/80">
              <Button
                fullWidth
                size="md"
                variant="primary"
                onClick={() => setIsCallModalOpen(true)}
                icon={<Phone className="w-4 h-4" />}
              >
                Call ASHA
              </Button>

              <Button
                fullWidth
                size="md"
                variant="secondary"
                onClick={() => setIsMessageModalOpen(true)}
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Message
              </Button>
            </div>
          </div>
        </Card>

        {/* Next Planned Home Visit Card */}
        <Card className="p-4 bg-white border-[#EDE3F7] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#29213A] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#8B5FBF]" />
              <span>Next Scheduled Home Visit</span>
            </h2>
            <Badge variant="lavender" size="sm">Confirmed</Badge>
          </div>

          <div className="p-3 bg-[#FAF6FE] rounded-2xl border border-[#EDE3F7] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#503477]">
              <Clock className="w-4 h-4 text-[#8B5FBF]" />
              <span>{ashaWorker.nextPlannedVisit}</span>
            </div>
            <p className="text-xs text-[#766C82] leading-relaxed">
              <strong>Agenda:</strong> {ashaWorker.visitPurpose}
            </p>
          </div>
        </Card>

        {/* Assigned Service Area & Healthcare Facilities */}
        <Card className="p-4 bg-white border-[#EDE3F7] space-y-3">
          <h2 className="text-sm font-bold text-[#29213A] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#D95783]" />
            <span>Assigned Area & Health Centres</span>
          </h2>

          <div className="space-y-2 text-xs text-[#503477]">
            <div className="p-2.5 rounded-xl bg-[#FAF6FE] flex items-start gap-2.5">
              <Building className="w-4 h-4 text-[#8B5FBF] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#29213A]">Sub-Centre</span>
                <span className="text-[#766C82]">{ashaWorker.subCentre} (Village: {ashaWorker.village})</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF6FE] flex items-start gap-2.5">
              <Building className="w-4 h-4 text-[#8B5FBF] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#29213A]">Primary / Community Health Centre</span>
                <span className="text-[#766C82]">{ashaWorker.primaryHealthCentre}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF6FE] flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#8B5FBF] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#29213A]">Consultation Hours</span>
                <span className="text-[#766C82]">{ashaWorker.availabilityHours}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* What your ASHA worker helps with */}
        <Card className="p-4 bg-[#FAF6FE] border-[#DCBEEF]/80 space-y-2.5">
          <div className="flex items-center gap-2 text-[#503477]">
            <Heart className="w-4 h-4 text-[#D95783]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              How Your ASHA Worker Supports You
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#503477]">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5FBF] mt-1.5 flex-shrink-0" />
              <span>
                <strong>Mother & Child Protection (MCP) Card:</strong> Tracking routine antenatal checkups and TT vaccinations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5FBF] mt-1.5 flex-shrink-0" />
              <span>
                <strong>Nutrition & Supplements:</strong> Distributing Iron-Folic Acid (IFA) and Calcium tablets.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5FBF] mt-1.5 flex-shrink-0" />
              <span>
                <strong>Delivery & Ambulance Transport:</strong> Arranging free 102 transport to the hospital for safe institutional delivery.
              </span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Call Modal */}
      {isCallModalOpen && (
        <Modal
          isOpen={isCallModalOpen}
          onClose={() => setIsCallModalOpen(false)}
          title={`Call ASHA ${ashaWorker.name}`}
          description={`Phone: ${ashaWorker.phone}`}
          footer={
            <div className="w-full flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsCallModalOpen(false)}>
                Cancel
              </Button>
              <a
                href={`tel:${ashaWorker.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5FBF] text-white text-xs font-bold shadow-soft"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Native Dialer</span>
              </a>
            </div>
          }
        >
          <div className="p-4 bg-[#FAF6FE] rounded-2xl border border-[#EDE3F7] text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center mx-auto">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#29213A]">{ashaWorker.name}</p>
              <p className="text-xs text-[#766C82]">{ashaWorker.village} Service Area</p>
            </div>
            <p className="text-[11px] text-[#766C82] bg-white p-2.5 rounded-xl border border-[#EDE3F7]">
              This connects you via phone dialer to your registered community health activist.
            </p>
          </div>
        </Modal>
      )}

      {/* Message Modal */}
      {isMessageModalOpen && (
        <Modal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          title={`Message ASHA ${ashaWorker.name}`}
          description="Send a health update or request a home visit."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsMessageModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendMessage}
                disabled={sentSuccess}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                {sentSuccess ? 'Sending...' : 'Send Message'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSendMessage} className="space-y-3">
            {sentSuccess ? (
              <div className="p-4 bg-[#EAF5F1] rounded-2xl border border-[#B6E2D3] text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-[#36866A] mx-auto animate-bounce" />
                <p className="text-xs font-bold text-[#24634E]">
                  Message Queued in Demo System
                </p>
                <p className="text-[11px] text-[#766C82]">
                  Note: In this prototype, message delivery is simulated without SMS carrier charges.
                </p>
              </div>
            ) : (
              <>
                <FormField
                  label="Quick Query or Note"
                  as="textarea"
                  rows={3}
                  placeholder="e.g. Namaste Didi, my IFA tablets are finishing this week. Please let me know when you visit next."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                />
                <p className="text-[11px] text-[#766C82]">
                  For urgent pain, bleeding, or emergencies, please use the <strong>SOS Screen</strong> or call 108 directly instead of messaging.
                </p>
              </>
            )}
          </form>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
};
