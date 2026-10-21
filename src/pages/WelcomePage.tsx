import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  Heart, 
  ShieldAlert, 
  Calendar, 
  Pill, 
  Users, 
  Activity, 
  ChevronRight,
  Globe2,
  Sparkles
} from 'lucide-react';
import { LanguageCode } from '../types';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { patient, setLanguage, t, login } = useApp();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  };

  const handleQuickDemo = () => {
    login(patient.phone || '+91 98765 43210');
    navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 sm:p-7 min-h-screen">
      {/* Top Bar with Language Selector */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#8B5FBF] to-[#D95783] flex items-center justify-center text-white font-extrabold text-base shadow-soft">
            M
          </div>
          <span className="font-bold text-lg text-[#503477] tracking-tight">
            MatriCare
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/90 border border-[#EDE3F7] rounded-xl px-2.5 py-1.5 shadow-soft-sm">
          <Globe2 className="w-3.5 h-3.5 text-[#8B5FBF]" />
          <select
            value={patient.language}
            onChange={handleLanguageChange}
            className="text-xs font-semibold text-[#503477] bg-transparent outline-none cursor-pointer"
            aria-label="Select Application Language"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-4 space-y-6">
        {/* Maternal Care Hero Graphic */}
        <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F7DCE8] via-[#EDE3F7] to-[#FAF6FE] animate-pulse-subtle" />
          <div className="absolute inset-3 rounded-full border-2 border-dashed border-[#8B5FBF]/30 animate-spin-slow" />
          
          {/* Compassionate SVG Illustration of Mother and Baby */}
          <svg className="w-32 h-32 sm:w-36 sm:h-36 relative z-10 drop-shadow-md" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" fill="#FAF6FE" fillOpacity="0.8"/>
            <path d="M100 35 C70 35 60 70 60 100 C60 145 95 165 100 165 C105 165 140 145 140 100 C140 70 130 35 100 35 Z" fill="#8B5FBF" fillOpacity="0.15"/>
            {/* Mother silhouette */}
            <path d="M92 65 C85 65 80 70 80 78 C80 86 85 91 92 91 C99 91 104 86 104 78 C104 70 99 65 92 65 Z" fill="#503477"/>
            <path d="M80 95 C68 100 64 115 64 135 C64 150 75 158 92 158 C96 158 102 157 108 154 C100 148 95 138 95 125 C95 110 104 98 116 93 C106 91 91 90 80 95 Z" fill="#8B5FBF"/>
            {/* Baby silhouette */}
            <circle cx="118" cy="115" r="9" fill="#D95783"/>
            <path d="M110 126 C105 130 105 142 114 146 C122 150 130 144 130 136 C130 128 122 124 110 126 Z" fill="#F7DCE8"/>
            <path d="M118 108 C126 105 132 110 132 118" stroke="#D95783" strokeWidth="2" strokeLinecap="round"/>
            {/* Floating love hearts */}
            <path d="M136 68 C136 62 144 58 148 64 C152 58 160 62 160 68 C160 78 148 85 148 85 C148 85 136 78 136 68 Z" fill="#D95783"/>
            <path d="M52 82 C52 78 57 75 60 79 C63 75 68 78 68 82 C68 88 60 93 60 93 C60 93 52 88 52 82 Z" fill="#8B5FBF"/>
          </svg>

          <div className="absolute -bottom-2 bg-white px-3.5 py-1 rounded-full border border-[#EDE3F7] shadow-soft-sm flex items-center gap-1.5 text-xs text-[#503477] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D95783]" />
            <span>Nurturing Mother & Child</span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#29213A] tracking-tight">
            {t('appName')}
          </h1>
          <p className="text-sm sm:text-base font-medium text-[#766C82] max-w-xs mx-auto">
            {t('tagline')}
          </p>
        </div>

        {/* Prototype Disclaimer */}
        <DisclaimerBanner />

        {/* Key Feature Badges */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-white/90 p-3 rounded-2xl border border-[#EDE3F7] flex items-center gap-2.5 shadow-soft-sm">
            <div className="w-8 h-8 rounded-xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#29213A]">Vitals & Band</p>
              <p className="text-[10px] text-[#766C82]">Continuous health logs</p>
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-2xl border border-[#EDE3F7] flex items-center gap-2.5 shadow-soft-sm">
            <div className="w-8 h-8 rounded-xl bg-[#F7DCE8] text-[#D95783] flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#29213A]">ASHA Worker</p>
              <p className="text-[10px] text-[#766C82]">Local care connect</p>
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-2xl border border-[#EDE3F7] flex items-center gap-2.5 shadow-soft-sm">
            <div className="w-8 h-8 rounded-xl bg-[#EAF5F1] text-[#36866A] flex items-center justify-center flex-shrink-0">
              <Pill className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#29213A]">Med Reminders</p>
              <p className="text-[10px] text-[#766C82]">Iron, calcium & tips</p>
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-2xl border border-[#EDE3F7] flex items-center gap-2.5 shadow-soft-sm">
            <div className="w-8 h-8 rounded-xl bg-[#FDECEF] text-[#D6455D] flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#29213A]">SOS Emergency</p>
              <p className="text-[10px] text-[#766C82]">108 / 102 & family alert</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-3">
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/register')}
          icon={<ChevronRight className="w-5 h-5" />}
          iconPosition="right"
        >
          {t('getStarted')}
        </Button>

        <Button
          fullWidth
          size="md"
          variant="secondary"
          onClick={() => navigate('/login')}
        >
          {t('existingUser')}
        </Button>

        {/* Quick Demo Skip */}
        <div className="text-center pt-1">
          <button
            onClick={handleQuickDemo}
            className="text-xs font-semibold text-[#8B5FBF] hover:text-[#503477] underline underline-offset-4 decoration-dotted transition-colors cursor-pointer"
          >
            Explore Demo Directly as Ananya (Week 24)
          </button>
        </div>
      </div>
    </div>
  );
};
