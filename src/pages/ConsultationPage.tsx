import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FormField } from '../components/common/FormField';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { consultationService, ConsultationSession } from '../services/consultationService';
import { 
  Video, 
  Calendar, 
  Clock, 
  Plus, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  User 
} from 'lucide-react';

export const ConsultationPage: React.FC = () => {
  const { appointments, addAppointment, addToast } = useApp();
  const [activeSession, setActiveSession] = useState<ConsultationSession | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [consultType, setConsultType] = useState<'Video Consultation' | 'Phone Consultation' | 'Routine Antenatal'>('Video Consultation');
  const [doctorName, setDoctorName] = useState('Dr. Meera Nambiar');
  const [consultDate, setConsultDate] = useState('2026-11-05');
  const [consultTime, setConsultTime] = useState('02:30 PM');
  const [consultNotes, setConsultNotes] = useState('Follow-up review for blood pressure and fetal movement frequency.');

  // In-call controls
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const unsub = consultationService.subscribe((s) => setActiveSession(s));
    return () => unsub();
  }, []);

  useEffect(() => {
    let interval: any;
    if (activeSession && activeSession.status === 'active') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeSession?.status]);

  const handleStartDemoVideoCall = (doc = 'Dr. Meera Nambiar', spec = 'Obstetrician & Gynecologist') => {
    consultationService.startDemoVideoConsultation(doc, spec);
    addToast('Connecting to simulated doctor video consultation...', 'info');
  };

  const handleEndCall = () => {
    consultationService.endConsultation();
    addToast('Consultation ended. Clinical notes logged in your record.', 'info');
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      title: `${consultType} with ${doctorName}`,
      doctorName,
      specialty: 'Obstetrics & Maternal Care',
      facility: consultType === 'Routine Antenatal' ? 'District Women’s Hospital' : 'MatriCare Tele-Health Portal',
      date: consultDate,
      time: consultTime,
      type: consultType,
      location: consultType === 'Routine Antenatal' ? 'OPD Room 12' : 'Encrypted Video Room',
      notes: consultNotes,
      status: 'upcoming',
      reminderEnabled: true,
      isTeleconsult: consultType !== 'Routine Antenatal',
      meetingLink: consultType !== 'Routine Antenatal' ? `https://tele.matricare.gov.in/room-${Date.now()}` : undefined,
    });
    setIsBookModalOpen(false);
  };

  const teleconsultList = appointments.filter((a) => a.isTeleconsult || a.type === 'Phone Consultation' || a.type === 'Video Consultation');

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Tele-Consultation & Clinic Visits"
        subtitle="Module 5F: Online & In-Person Care"
        showBack
        backTo="/home"
        rightAction={
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsBookModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Book
          </Button>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Intro Banner */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE3F7] shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8B5FBF] uppercase">
              Module 5F: Online and Offline Appointments (Proposed)
            </span>
            <Badge variant="lavender" size="sm">Tele-Health</Badge>
          </div>
          <h2 className="text-sm font-bold text-[#29213A]">
            Connect with Doctors When Travel is Difficult
          </h2>
          <p className="text-xs text-[#766C82] leading-relaxed">
            Book in-person ANC visits at your community hospital or join an encrypted phone/video consult when road or weather conditions prevent travel.
          </p>
        </div>

        <DisclaimerBanner />

        {/* Quick Launch Instant Demo Call */}
        <Card variant="highlight" className="p-4 border-[#DCBEEF] space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-[#8B5FBF] uppercase">
                Interactive Video Consultation Room
              </span>
              <h3 className="text-sm font-bold text-[#29213A] mt-0.5">
                Launch Doctor Video Demo Call
              </h3>
              <p className="text-xs text-[#766C82]">
                Test the simulated two-way consultation workflow with Dr. Meera Nambiar.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleStartDemoVideoCall()}
              icon={<Video className="w-4 h-4" />}
            >
              Start Call
            </Button>
          </div>
        </Card>

        {/* Scheduled Tele-consultations */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#29213A] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8B5FBF]" />
              <span>Upcoming Consultations ({teleconsultList.length})</span>
            </h3>
            <span className="text-[10px] text-[#766C82]">Scheduled Sessions</span>
          </div>

          {teleconsultList.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#766C82] bg-white rounded-2xl border border-[#EDE3F7]">
              No tele-consultations booked yet. Tap "Book" above to schedule an online or offline check-up.
            </div>
          ) : (
            teleconsultList.map((apt) => (
              <Card key={apt.id} className="p-4 bg-white border-[#EDE3F7] space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="lavender" size="sm">{apt.type}</Badge>
                  <Badge variant={apt.status === 'completed' ? 'success' : 'normal'} size="sm">
                    {apt.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#29213A]">{apt.title}</h4>
                  <p className="text-xs text-[#766C82]">
                    {apt.doctorName} • {apt.facility}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6FE] text-xs text-[#503477] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8B5FBF]" />
                    {apt.date} at {apt.time}
                  </span>
                  {apt.type.includes('Video') && apt.status === 'upcoming' && (
                    <button
                      onClick={() => handleStartDemoVideoCall(apt.doctorName, apt.specialty)}
                      className="px-2.5 py-1 rounded-lg bg-[#8B5FBF] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join Room</span>
                    </button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Video Consultation Simulation Modal / Interface */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#1E172B] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[520px] animate-scale-up">
            {/* Top Bar */}
            <div className="p-3 bg-black/40 flex items-center justify-between text-white text-xs border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#36866A] animate-pulse" />
                <span className="font-bold">
                  {activeSession.doctorName} ({activeSession.specialty})
                </span>
              </div>
              <div className="font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded-full">
                {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Video Viewport */}
            <div className="flex-1 relative bg-gradient-to-br from-[#29213A] to-[#120D1A] flex items-center justify-center p-4">
              {activeSession.status === 'connecting' ? (
                <div className="text-center text-white/70 space-y-2">
                  <div className="w-12 h-12 rounded-full border-2 border-[#8B5FBF] border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs">Connecting to Dr. Meera Nambiar (Secured Channel)...</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#8B5FBF] to-[#D95783] flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/20">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Dr. Meera Nambiar
                    </h3>
                    <p className="text-xs text-[#DCBEEF]">
                      Simulated Doctor Stream · Two-Way Audio Active
                    </p>
                  </div>

                  {/* Doctor Notes Box */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-left text-xs text-white/80 max-w-sm space-y-1">
                    <span className="text-[10px] text-[#DCBEEF] font-bold uppercase block">
                      Live Clinical Notes:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {activeSession.doctorNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Self Camera PIP */}
              <div className="absolute bottom-3 right-3 w-28 h-20 rounded-2xl bg-black/60 border border-white/20 overflow-hidden flex items-center justify-center text-white text-[10px]">
                {cameraOff ? (
                  <span className="text-white/60">Camera Off</span>
                ) : (
                  <span>Self (Ananya)</span>
                )}
              </div>
            </div>

            {/* Call Action Bar */}
            <div className="p-3 bg-black/50 flex items-center justify-center gap-4 border-t border-white/10">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  micMuted ? 'bg-[#D6455D] text-white' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
                title={micMuted ? 'Unmute' : 'Mute'}
              >
                {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setCameraOff(!cameraOff)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  cameraOff ? 'bg-[#D6455D] text-white' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
                title={cameraOff ? 'Turn On Video' : 'Turn Off Video'}
              >
                {cameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={handleEndCall}
                className="p-3 rounded-full bg-[#D6455D] hover:bg-[#B0263E] text-white shadow-lg transition-all cursor-pointer"
                title="End Consultation"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Consult Modal */}
      {isBookModalOpen && (
        <Modal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          title="Book Appointment or Tele-Consult"
          description="Schedule an in-person ANC checkup or remote doctor consult."
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsBookModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleBookSubmit}>
                Confirm Booking
              </Button>
            </div>
          }
        >
          <form onSubmit={handleBookSubmit} className="space-y-3">
            <FormField
              label="Consultation Format"
              as="select"
              value={consultType}
              onChange={(e) => setConsultType(e.target.value as any)}
              options={[
                { label: 'Video Consultation (Tele-health)', value: 'Video Consultation' },
                { label: 'Phone Consultation (Audio Only)', value: 'Phone Consultation' },
                { label: 'In-Person Antenatal Hospital Visit', value: 'Routine Antenatal' },
              ]}
            />

            <FormField
              label="Attending Obstetrician / Provider"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                label="Date"
                type="date"
                value={consultDate}
                onChange={(e) => setConsultDate(e.target.value)}
                required
              />
              <FormField
                label="Time"
                type="text"
                value={consultTime}
                onChange={(e) => setConsultTime(e.target.value)}
                required
              />
            </div>

            <FormField
              label="Consultation Reason / Notes"
              value={consultNotes}
              onChange={(e) => setConsultNotes(e.target.value)}
            />
          </form>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
};
