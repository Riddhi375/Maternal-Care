import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { FormField } from '../components/common/FormField';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Calendar, 
  Phone, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { PatientProfile } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Ananya Sharma',
    dob: '1998-05-14',
    phone: '+91 98765 43210',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    bloodGroup: 'B Positive (B+)',
    pregnancyWeek: 24,
    estimatedDueDate: '2026-11-12',
    trimester: 2 as 1 | 2 | 3,
    gravida: 1,
    para: 0,
    emergencySharingConsent: true,
    smsConsent: true,
    disclaimerConsent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.dob) errs.dob = 'Date of birth is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid phone number is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.estimatedDueDate) errs.estimatedDueDate = 'Estimated due date is required';
    if (formData.pregnancyWeek < 1 || formData.pregnancyWeek > 42) errs.pregnancyWeek = 'Week must be between 1 and 42';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    else navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.disclaimerConsent) {
      setErrors({ disclaimer: 'Please acknowledge the demo prototype disclosure to continue.' });
      return;
    }

    const calculatedTrimester: 1 | 2 | 3 = 
      formData.pregnancyWeek <= 13 ? 1 : formData.pregnancyWeek <= 27 ? 2 : 3;

    const newProfile: Partial<PatientProfile> = {
      name: formData.name,
      dob: formData.dob,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      bloodGroup: formData.bloodGroup,
      pregnancyWeek: Number(formData.pregnancyWeek),
      estimatedDueDate: formData.estimatedDueDate,
      trimester: calculatedTrimester,
      gravida: Number(formData.gravida),
      para: Number(formData.para),
      emergencySharingEnabled: formData.emergencySharingConsent,
      smsAlertsEnabled: formData.smsConsent,
      deviceConnected: true,
      deviceModel: 'MatriBand Pro (BLE-882)',
      lastSyncTime: 'Just now',
    };

    register(newProfile);
    navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Patient Registration" showBack backTo="/" />

      <div className="p-4 sm:p-6 space-y-5">
        {/* Step Indicator */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#EDE3F7] shadow-soft-sm">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Personal' },
              { num: 2, label: 'Pregnancy' },
              { num: 3, label: 'Consent & Review' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.num
                        ? 'bg-[#36866A] text-white'
                        : step === s.num
                        ? 'bg-[#8B5FBF] text-white shadow-soft-sm'
                        : 'bg-[#EDE3F7] text-[#766C82]'
                    }`}
                  >
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden xs:inline ${
                      step === s.num ? 'text-[#503477]' : 'text-[#766C82]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                      step > idx + 1 ? 'bg-[#36866A]' : 'bg-[#EDE3F7]'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <DisclaimerBanner />

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <Card className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-[#F6F0FC] pb-2">
                <h2 className="text-base font-bold text-[#29213A]">
                  Step 1: Mother's Personal Details
                </h2>
                <p className="text-xs text-[#766C82]">
                  Basic details to personalize your maternal care records.
                </p>
              </div>

              <FormField
                label="Full Name of Expectant Mother"
                placeholder="e.g. Ananya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                icon={<User className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  error={errors.dob}
                  icon={<Calendar className="w-4 h-4" />}
                  required
                />

                <FormField
                  label="Mobile Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                  icon={<Phone className="w-4 h-4" />}
                  helperText="Used for check-in and emergency coordination."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  label="City / Town"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  error={errors.city}
                  icon={<MapPin className="w-4 h-4" />}
                  required
                />

                <FormField
                  label="Blood Group"
                  as="select"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  options={[
                    { label: 'B Positive (B+)', value: 'B Positive (B+)' },
                    { label: 'O Positive (O+)', value: 'O Positive (O+)' },
                    { label: 'A Positive (A+)', value: 'A Positive (A+)' },
                    { label: 'AB Positive (AB+)', value: 'AB Positive (AB+)' },
                    { label: 'B Negative (B-)', value: 'B Negative (B-)' },
                    { label: 'O Negative (O-)', value: 'O Negative (O-)' },
                    { label: 'A Negative (A-)', value: 'A Negative (A-)' },
                    { label: 'AB Negative (AB-)', value: 'AB Negative (AB-)' },
                  ]}
                  icon={<Heart className="w-4 h-4" />}
                />
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-[#F6F0FC] pb-2">
                <h2 className="text-base font-bold text-[#29213A]">
                  Step 2: Pregnancy Information
                </h2>
                <p className="text-xs text-[#766C82]">
                  Helps calculate your gestational milestones and test schedule.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  label="Current Pregnancy Week"
                  type="number"
                  min="1"
                  max="42"
                  value={formData.pregnancyWeek}
                  onChange={(e) => {
                    const wk = Number(e.target.value);
                    const trim = wk <= 13 ? 1 : wk <= 27 ? 2 : 3;
                    setFormData({ ...formData, pregnancyWeek: wk, trimester: trim });
                  }}
                  error={errors.pregnancyWeek}
                  helperText="Between 1 and 42 weeks."
                  required
                />

                <FormField
                  label="Estimated Due Date (EDD)"
                  type="date"
                  value={formData.estimatedDueDate}
                  onChange={(e) => setFormData({ ...formData, estimatedDueDate: e.target.value })}
                  error={errors.estimatedDueDate}
                  helperText="Provided by your obstetrician or ultrasound."
                  required
                />
              </div>

              <div className="bg-[#FAF6FE] p-3.5 rounded-xl border border-[#DCBEEF]/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#766C82] block">Current Stage</span>
                  <span className="text-sm font-bold text-[#503477]">
                    Trimester {formData.pregnancyWeek <= 13 ? '1 (First)' : formData.pregnancyWeek <= 27 ? '2 (Second)' : '3 (Third)'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#766C82] block">Baby Development</span>
                  <span className="text-xs font-semibold text-[#D95783]">
                    Week {formData.pregnancyWeek} Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Gravida (Pregnancies)"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.gravida}
                  onChange={(e) => setFormData({ ...formData, gravida: Number(e.target.value) })}
                  helperText="Total pregnancies including current"
                />

                <FormField
                  label="Para (Prior Births)"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.para}
                  onChange={(e) => setFormData({ ...formData, para: Number(e.target.value) })}
                  helperText="Number of prior deliveries"
                />
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-[#F6F0FC] pb-2">
                <h2 className="text-base font-bold text-[#29213A]">
                  Step 3: Consent & Summary Review
                </h2>
                <p className="text-xs text-[#766C82]">
                  Please review your information and confirm privacy preferences.
                </p>
              </div>

              {/* Summary Review Pill Box */}
              <div className="bg-[#FAF6FE] p-3.5 rounded-2xl border border-[#EDE3F7] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#EDE3F7]/50">
                  <span className="text-[#766C82]">Mother:</span>
                  <span className="font-bold text-[#29213A]">{formData.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EDE3F7]/50">
                  <span className="text-[#766C82]">Mobile:</span>
                  <span className="font-semibold text-[#29213A]">{formData.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EDE3F7]/50">
                  <span className="text-[#766C82]">Stage:</span>
                  <span className="font-semibold text-[#8B5FBF]">
                    Week {formData.pregnancyWeek} (Trimester {formData.pregnancyWeek <= 13 ? 1 : formData.pregnancyWeek <= 27 ? 2 : 3})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#766C82]">Due Date:</span>
                  <span className="font-semibold text-[#D95783]">{formData.estimatedDueDate}</span>
                </div>
              </div>

              {/* Consents */}
              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emergencySharingConsent}
                    onChange={(e) => setFormData({ ...formData, emergencySharingConsent: e.target.checked })}
                    className="mt-0.5 rounded text-[#8B5FBF] focus:ring-[#8B5FBF] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-[#29213A] leading-relaxed">
                    Allow MatriCare to share simulated emergency alerts and health location coordinates with my trusted contacts and ASHA worker in SOS events.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.smsConsent}
                    onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                    className="mt-0.5 rounded text-[#8B5FBF] focus:ring-[#8B5FBF] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-[#29213A] leading-relaxed">
                    Enable daily medication reminders and ANC visit reminders.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded-xl bg-[#FDECEF]/40 border border-[#F8BCC7]/40">
                  <input
                    type="checkbox"
                    checked={formData.disclaimerConsent}
                    onChange={(e) => setFormData({ ...formData, disclaimerConsent: e.target.checked })}
                    className="mt-0.5 rounded text-[#D6455D] focus:ring-[#D6455D] w-4 h-4 cursor-pointer"
                    required
                  />
                  <span className="text-xs text-[#503477] font-medium leading-relaxed">
                    I understand that MatriCare is a maternal health awareness prototype with demo readings and does not substitute qualified medical care.
                  </span>
                </label>
                {errors.disclaimer && (
                  <p className="text-xs text-[#D6455D] font-semibold">{errors.disclaimer}</p>
                )}
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                fullWidth
                onClick={handleNext}
                icon={<ChevronRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue to Step {step + 1}
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="primary"
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                Complete Registration
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
