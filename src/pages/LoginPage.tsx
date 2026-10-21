import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { FormField } from '../components/common/FormField';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Phone, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

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
      login(phone);
      navigate('/home');
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    login('+91 98765 43210');
    navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 min-h-screen">
      <div>
        <Header title="Patient Sign In" showBack backTo="/" />

        <div className="pt-4 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#29213A]">
              Welcome Back to MatriCare
            </h1>
            <p className="text-xs sm:text-sm text-[#766C82]">
              Access your maternal health records and pregnancy journey.
            </p>
          </div>

          <DisclaimerBanner />

          {/* Quick Demo Login Hero Card */}
          <Card variant="highlight" className="p-4 border-[#8B5FBF]/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8B5FBF] text-white flex items-center justify-center flex-shrink-0 shadow-soft-sm">
                <Sparkles className="w-5 h-5 text-[#F7DCE8]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-[#503477]">
                  Instant Demo Access
                </h2>
                <p className="text-xs text-[#766C82] mt-0.5 leading-relaxed">
                  Sign in immediately with the pre-populated profile for <strong>Ananya Sharma (Week 24)</strong>.
                </p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleQuickDemoLogin}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Enter Demo App as Ananya
                  </Button>
                </div>
              </div>
            </div>
          </Card>

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
                  label="6-Digit Verification Code (Simulated OTP)"
                  type="text"
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  error={error}
                  icon={<Lock className="w-4 h-4" />}
                  helperText="Demo simulation: Enter 123456 or tap Auto-fill below."
                  required
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setOtp('123456')}
                    className="text-xs"
                  >
                    Auto-fill (123456)
                  </Button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Verify & Enter MatriCare
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>

      {/* Footer Register Link */}
      <div className="pt-6 pb-2 text-center text-xs text-[#766C82]">
        <span>New to MatriCare? </span>
        <button
          onClick={() => navigate('/register')}
          className="text-[#8B5FBF] hover:text-[#503477] font-bold underline underline-offset-2 ml-1 cursor-pointer"
        >
          Create Patient Profile
        </button>
      </div>
    </div>
  );
};
