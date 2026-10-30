import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { FormField } from '../components/common/FormField';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  Phone, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Baby,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';
import { DEMO_ACCOUNTS } from '../data/mockData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, patient } = useApp();

  const [phone, setPhone] = useState(patient.phone || '+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit demo verification code');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(phone, 'pregnant_woman');
      navigate('/home');
    }, 500);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    const acc = DEMO_ACCOUNTS.find((a) => a.role === role);
    login(acc?.phone || phone, role);

    if (role === 'asha') {
      navigate('/asha-dashboard');
    } else if (role === 'doctor') {
      navigate('/doctor-dashboard');
    } else if (role === 'family') {
      navigate('/family-dashboard');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 min-h-screen">
      <div>
        <Header title="Sign In & Role Selection" showBack backTo="/" />

        <div className="pt-4 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#29213A]">
              Welcome Back to MatriCare
            </h1>
            <p className="text-xs sm:text-sm text-[#766C82]">
              Select a demo role account or sign in with your mobile OTP.
            </p>
          </div>

          <DisclaimerBanner />

          {/* Quick Demo Login Grid for 4 Roles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8B5FBF] uppercase tracking-wide">
                1-Click Demo Accounts (All 4 RBAC Roles)
              </span>
              <span className="text-[10px] text-[#766C82]">Instant Login</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Mother */}
              <button
                onClick={() => handleQuickRoleLogin('pregnant_woman')}
                className="p-3.5 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm hover:border-[#8B5FBF] text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center font-bold">
                    <Baby className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#8B5FBF] block uppercase">
                      Pregnant Woman
                    </span>
                    <strong className="text-xs text-[#29213A]">Ananya Sharma</strong>
                    <span className="text-[10px] text-[#766C82] block">Week 24 Gestation</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#766C82]" />
              </button>

              {/* 2. Family */}
              <button
                onClick={() => handleQuickRoleLogin('family')}
                className="p-3.5 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm hover:border-[#8B5FBF] text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6FE] text-[#503477] border border-[#DCBEEF] flex items-center justify-center font-bold">
                    <HeartHandshake className="w-5 h-5 text-[#8B5FBF]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#503477] block uppercase">
                      Family Member
                    </span>
                    <strong className="text-xs text-[#29213A]">Rohan Sharma</strong>
                    <span className="text-[10px] text-[#766C82] block">Husband (Emergency Contact)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#766C82]" />
              </button>

              {/* 3. ASHA */}
              <button
                onClick={() => handleQuickRoleLogin('asha')}
                className="p-3.5 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm hover:border-[#8B5FBF] text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5F1] text-[#36866A] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#36866A] block uppercase">
                      ASHA / ANM Worker
                    </span>
                    <strong className="text-xs text-[#29213A]">Sunita Devi</strong>
                    <span className="text-[10px] text-[#766C82] block">Sub-Centre Rampur Kalan</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#766C82]" />
              </button>

              {/* 4. Doctor */}
              <button
                onClick={() => handleQuickRoleLogin('doctor')}
                className="p-3.5 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm hover:border-[#8B5FBF] text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7DCE8] text-[#D95783] flex items-center justify-center font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#D95783] block uppercase">
                      Doctor / PHC Staff
                    </span>
                    <strong className="text-xs text-[#29213A]">Dr. Meera Nambiar</strong>
                    <span className="text-[10px] text-[#766C82] block">District Women's Hospital</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#766C82]" />
              </button>
            </div>
          </div>

          {/* Form: Mobile Number & Simulated OTP */}
          <Card className="space-y-4">
            <div className="border-b border-[#F6F0FC] pb-2">
              <h2 className="text-sm font-bold text-[#29213A]">
                Sign In with Mobile OTP
              </h2>
              <p className="text-xs text-[#766C82]">
                {otpSent
                  ? 'Enter the 6-digit verification code below'
                  : 'Enter your registered mobile number'}
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <FormField
                  label="Registered Mobile Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={error}
                  icon={<Phone className="w-4 h-4" />}
                  helperText="Enter any 10-digit number for this evaluation demo."
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Request Verification Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-[#FAF6FE] p-3 rounded-xl border border-[#DCBEEF]/60 flex items-center justify-between">
                  <span className="text-xs text-[#503477] font-semibold">
                    Code sent to {phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-[#8B5FBF] hover:underline font-semibold"
                  >
                    Change
                  </button>
                </div>

                <FormField
                  label="Enter 6-Digit OTP"
                  type="text"
                  placeholder="1 2 3 4 5 6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  error={error}
                  icon={<Lock className="w-4 h-4" />}
                  helperText="Demo Code: Enter 123456 or any 4+ digits to proceed."
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Verify & Open Dashboard
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>

      <div className="text-center pt-6 pb-2">
        <p className="text-xs text-[#766C82]">
          Need to register a new pregnancy profile?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-[#8B5FBF] font-bold hover:underline cursor-pointer"
          >
            Create New Patient Account
          </button>
        </p>
      </div>
    </div>
  );
};
