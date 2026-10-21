import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FormField } from '../components/common/FormField';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { LanguageCode } from '../types';
import { 
  User, 
  Settings, 
  Globe2, 
  Bell, 
  Shield, 
  Wifi, 
  HelpCircle, 
  LogOut, 
  RefreshCw, 
  ChevronRight, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  Heart,
  AlertCircle
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    patient, 
    updatePatient, 
    setLanguage, 
    resetToDefaultData, 
    logout, 
    addToast 
  } = useApp();

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Edit form state
  const [name, setName] = useState(patient.name);
  const [phone, setPhone] = useState(patient.phone);
  const [city, setCity] = useState(patient.city);
  const [bloodGroup, setBloodGroup] = useState(patient.bloodGroup);
  const [pregnancyWeek, setPregnancyWeek] = useState(patient.pregnancyWeek);
  const [edd, setEdd] = useState(patient.estimatedDueDate);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const wk = Number(pregnancyWeek);
    const trim = wk <= 13 ? 1 : wk <= 27 ? 2 : 3;

    updatePatient({
      name,
      phone,
      city,
      bloodGroup,
      pregnancyWeek: wk,
      estimatedDueDate: edd,
      trimester: trim,
    });
    setIsEditProfileModalOpen(false);
  };

  const handleSyncDevice = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updatePatient({ lastSyncTime: 'Just now' });
    addToast('Simulated band sync completed with MatriBand Pro', 'success');
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Profile & Settings"
        subtitle="Account Preferences"
        showBack
        backTo="/home"
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Patient Profile Card */}
        <Card variant="highlight" className="p-4 sm:p-5 border-[#DCBEEF]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8B5FBF] to-[#D95783] text-white flex items-center justify-center font-bold text-xl shadow-soft flex-shrink-0">
                {patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold text-[#29213A]">
                    {patient.name}
                  </h1>
                  <Badge variant="lavender" size="sm">
                    Week {patient.pregnancyWeek}
                  </Badge>
                </div>
                <p className="text-xs text-[#766C82] mt-0.5">
                  {patient.phone} • {patient.city}, {patient.state}
                </p>
                <p className="text-xs text-[#503477] font-semibold mt-1">
                  EDD: {patient.estimatedDueDate} (Trimester {patient.trimester})
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setName(patient.name);
                setPhone(patient.phone);
                setCity(patient.city);
                setBloodGroup(patient.bloodGroup);
                setPregnancyWeek(patient.pregnancyWeek);
                setEdd(patient.estimatedDueDate);
                setIsEditProfileModalOpen(true);
              }}
              className="text-xs font-bold text-[#8B5FBF] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
        </Card>

        {/* Section 1: Language Preference */}
        <Card className="p-4 bg-white border-[#EDE3F7] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe2 className="w-4 h-4 text-[#8B5FBF]" />
              <div>
                <h2 className="text-xs font-bold text-[#29213A]">
                  Application Language
                </h2>
                <p className="text-[11px] text-[#766C82]">
                  Select preferred regional language
                </p>
              </div>
            </div>

            <select
              value={patient.language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="text-xs font-semibold text-[#503477] bg-[#FAF6FE] border border-[#DCBEEF] rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
        </Card>

        {/* Section 2: Connected Wearable Device */}
        <Card className="p-4 bg-white border-[#EDE3F7] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wifi className="w-4 h-4 text-[#36866A]" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-bold text-[#29213A]">
                    {patient.deviceModel}
                  </h2>
                  <Badge variant="success" size="sm">Paired</Badge>
                </div>
                <p className="text-[11px] text-[#766C82]">
                  Last synced: {patient.lastSyncTime}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleSyncDevice}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync
            </Button>
          </div>
        </Card>

        {/* Section 3: Notification & Alert Toggles */}
        <Card className="p-4 bg-white border-[#EDE3F7] space-y-3">
          <div className="flex items-center gap-2 text-[#503477]">
            <Bell className="w-4 h-4 text-[#8B5FBF]" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#29213A] block">
                  Medicine & Supplement Reminders
                </span>
                <span className="text-[11px] text-[#766C82]">
                  Scheduled daily alerts for Iron and Calcium
                </span>
              </div>
              <input
                type="checkbox"
                checked={patient.notificationsEnabled}
                onChange={(e) => updatePatient({ notificationsEnabled: e.target.checked })}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#29213A] block">
                  Simulated SMS Notifications
                </span>
                <span className="text-[11px] text-[#766C82]">
                  Send SMS dispatches to primary contact
                </span>
              </div>
              <input
                type="checkbox"
                checked={patient.smsAlertsEnabled}
                onChange={(e) => updatePatient({ smsAlertsEnabled: e.target.checked })}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#29213A] block">
                  Emergency Location & Dispatch Consent
                </span>
                <span className="text-[11px] text-[#766C82]">
                  Share GPS coordinates with 108/ASHA in SOS
                </span>
              </div>
              <input
                type="checkbox"
                checked={patient.emergencySharingEnabled}
                onChange={(e) => updatePatient({ emergencySharingEnabled: e.target.checked })}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </Card>

        {/* Section 4: Helplines & Support */}
        <Card className="p-4 bg-white border-[#EDE3F7] space-y-2.5">
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#8B5FBF]" />
              <div>
                <h3 className="text-xs font-bold text-[#29213A]">
                  Help, FAQs & Government Helplines
                </h3>
                <p className="text-[11px] text-[#766C82]">
                  Maternal 104 helpline, Women's helpline 181
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8B5FBF]" />
          </button>
        </Card>

        {/* Section 5: Demo Data Reset & Logout Actions */}
        <div className="pt-2 space-y-2">
          <Button
            fullWidth
            variant="outline"
            size="md"
            onClick={() => setIsResetModalOpen(true)}
            icon={<RefreshCw className="w-4 h-4 text-[#8B5FBF]" />}
          >
            Reset Demo Data to Default
          </Button>

          <Button
            fullWidth
            variant="ghost"
            size="md"
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-[#D6455D] hover:bg-[#FDECEF]"
            icon={<LogOut className="w-4 h-4 text-[#D6455D]" />}
          >
            Sign Out of MatriCare
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        title="Edit Personal Information"
        description="Update contact and gestational details."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsEditProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <FormField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <FormField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Current Pregnancy Week"
              type="number"
              min="1"
              max="42"
              value={pregnancyWeek}
              onChange={(e) => setPregnancyWeek(Number(e.target.value))}
              required
            />
            <FormField
              label="Estimated Due Date"
              type="date"
              value={edd}
              onChange={(e) => setEdd(e.target.value)}
              required
            />
          </div>

          <FormField
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Sign Out of MatriCare?"
        description="You will return to the welcome landing screen."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsLogoutModalOpen(false)}>
              Stay Signed In
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmLogout}>
              Confirm Sign Out
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#766C82]">
          Your demo records will remain safely saved in your browser's local cache.
        </p>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Sample Data?"
        description="This will restore the original demo records for Ananya Sharma."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                resetToDefaultData();
                setIsResetModalOpen(false);
              }}
            >
              Reset Data
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#766C82]">
          Any newly added appointments or manual readings will be reset to default values.
        </p>
      </Modal>

      {/* Help & Helplines Modal */}
      {isHelpModalOpen && (
        <Modal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
          title="Maternal Health Helplines"
          description="National public helplines available 24/7 across India."
          footer={
            <Button size="sm" onClick={() => setIsHelpModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3 text-xs text-[#29213A]">
            <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#EDE3F7] space-y-1">
              <span className="font-bold text-[#503477] block text-sm">
                📞 104 — National Health Helpline
              </span>
              <p className="text-[#766C82] leading-relaxed">
                24x7 government medical advice, maternal nutrition tips, and primary healthcare guidance.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#EDE3F7] space-y-1">
              <span className="font-bold text-[#503477] block text-sm">
                📞 181 — Women's Helpline
              </span>
              <p className="text-[#766C82] leading-relaxed">
                Support for women in distress, family welfare, and legal counselling.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#EDE3F7] space-y-1">
              <span className="font-bold text-[#503477] block text-sm">
                🚑 108 / 102 — Emergency Transport
              </span>
              <p className="text-[#766C82] leading-relaxed">
                Toll-free 24-hour ambulance transport for institutional labor and delivery.
              </p>
            </div>
          </div>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
};
