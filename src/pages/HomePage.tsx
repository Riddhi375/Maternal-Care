import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import {
  Heart,
  Activity,
  Calendar,
  Pill,
  ShieldAlert,
  ChevronRight,
  Clock,
  Sparkles,
  AlertOctagon,
  Users,
  FileText,
  UserCheck,
  CheckCircle2,
  Circle,
  Wifi,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    patient, 
    readings, 
    appointments, 
    medications, 
    alerts, 
    ashaWorker,
    markMedicationStatus, 
    sosActive 
  } = useApp();

  // Calculations
  const currentWeek = patient.pregnancyWeek || 24;
  const progressPercent = Math.min(100, Math.round((currentWeek / 40) * 100));

  // Next upcoming appointment
  const nextAppointment = appointments.find((a) => a.status === 'upcoming');

  // Medication summary
  const takenCount = medications.filter((m) => m.status === 'taken').length;
  const pendingCount = medications.filter((m) => m.status === 'pending').length;
  const totalMeds = medications.length;

  // Recent attention alerts
  const recentAlerts = alerts.slice(0, 2);

  // Latest readings lookup
  const getLatestReading = (type: string) => {
    return readings.find((r) => r.type === type);
  };

  const hr = getLatestReading('heartRate');
  const spo2 = getLatestReading('spo2');
  const temp = getLatestReading('temperature');
  const bp = getLatestReading('bloodPressure');

  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Active Emergency Beacon Banner if SOS active */}
        {sosActive && (
          <div
            onClick={() => navigate('/emergency')}
            className="p-3.5 rounded-2xl bg-[#D6455D] text-white flex items-center justify-between shadow-sos cursor-pointer animate-beacon"
          >
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="w-5 h-5 flex-shrink-0 animate-bounce" />
              <div>
                <p className="font-extrabold text-xs uppercase tracking-wider">
                  Emergency SOS Active
                </p>
                <p className="text-[11px] text-white/90">
                  Tap to view emergency contacts & dispatch actions
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </div>
        )}

        {/* Prototype Disclaimer */}
        <DisclaimerBanner />

        {/* Hero Pregnancy Journey Card */}
        <Card
          variant="highlight"
          className="relative overflow-hidden p-4 sm:p-5 border-[#DCBEEF]/80"
        >
          {/* Decorative background circle */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-gradient-to-br from-[#F7DCE8]/50 to-[#EDE3F7]/30 pointer-events-none" />

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#8B5FBF] bg-[#EDE3F7] px-2.5 py-0.5 rounded-full">
                  Trimester {patient.trimester}
                </span>
                <span className="text-xs text-[#766C82] flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-[#36866A]" /> Synced {patient.lastSyncTime}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#29213A] mt-1.5">
                Namaste, {patient.name}! 🌸
              </h1>
              <p className="text-xs text-[#766C82]">
                Due Date: <span className="font-semibold text-[#503477]">{patient.estimatedDueDate}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#8B5FBF] leading-none">
                {currentWeek}
              </span>
              <span className="text-[11px] block font-bold text-[#766C82]">Weeks</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#503477]">
              <span>Week {currentWeek} of 40</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-[#EDE3F7] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#8B5FBF] to-[#D95783] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#766C82] pt-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D95783]" />
              Baby is about the size of an ear of corn (~11.8 inches)
            </p>
          </div>

          <div className="mt-3.5 pt-3 border-t border-[#EDE3F7]/60 flex items-center justify-between">
            <span className="text-xs text-[#503477] font-semibold">
              Explore Week-by-Week Milestones
            </span>
            <button
              onClick={() => navigate('/pregnancy')}
              className="text-xs font-bold text-[#8B5FBF] hover:text-[#503477] flex items-center gap-1 cursor-pointer"
            >
              <span>View Journey</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Quick Vitals Summary Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#29213A] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#8B5FBF]" />
              <span>Latest Health Readings</span>
            </h2>
            <button
              onClick={() => navigate('/health')}
              className="text-xs font-semibold text-[#8B5FBF] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>All Trends</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Heart Rate */}
            <Card
              interactive
              onClick={() => navigate('/health')}
              className="p-3 bg-white"
            >
              <div className="flex items-center justify-between text-[#766C82] mb-1">
                <span className="text-[11px] font-semibold">Heart Rate</span>
                <Heart className="w-3.5 h-3.5 text-[#D95783]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-[#29213A]">
                  {hr?.value || '--'}
                </span>
                <span className="text-[10px] text-[#766C82]">bpm</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <Badge variant={hr?.status || 'normal'} size="sm">
                  {hr?.status === 'normal' ? 'Normal' : 'Attention'}
                </Badge>
              </div>
            </Card>

            {/* SpO2 */}
            <Card
              interactive
              onClick={() => navigate('/health')}
              className="p-3 bg-white"
            >
              <div className="flex items-center justify-between text-[#766C82] mb-1">
                <span className="text-[11px] font-semibold">Oxygen (SpO2)</span>
                <Activity className="w-3.5 h-3.5 text-[#36866A]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-[#29213A]">
                  {spo2?.value || '--'}
                </span>
                <span className="text-[10px] text-[#766C82]">%</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <Badge variant={spo2?.status || 'normal'} size="sm">
                  Optimal
                </Badge>
              </div>
            </Card>

            {/* Body Temp */}
            <Card
              interactive
              onClick={() => navigate('/health')}
              className="p-3 bg-white"
            >
              <div className="flex items-center justify-between text-[#766C82] mb-1">
                <span className="text-[11px] font-semibold">Body Temp</span>
                <Clock className="w-3.5 h-3.5 text-[#D58A35]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-[#29213A]">
                  {temp?.value || '--'}
                </span>
                <span className="text-[10px] text-[#766C82]">°F</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <Badge variant={temp?.status || 'normal'} size="sm">
                  Normal
                </Badge>
              </div>
            </Card>

            {/* Blood Pressure (Sample) */}
            <Card
              interactive
              onClick={() => navigate('/health')}
              className="p-3 bg-white"
            >
              <div className="flex items-center justify-between text-[#766C82] mb-1">
                <span className="text-[11px] font-semibold">Blood Pressure</span>
                <span className="text-[9px] px-1 rounded bg-[#EDE3F7] text-[#503477]">Manual</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-[#29213A]">
                  {bp?.value || '--'}
                </span>
                <span className="text-[10px] text-[#766C82]">mmHg</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <Badge variant={bp?.status || 'normal'} size="sm">
                  Gestational OK
                </Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* Emergency SOS Quick Launch Button */}
        <div className="pt-1">
          <button
            onClick={() => navigate('/emergency')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D6455D] to-[#B0263E] text-white shadow-sos flex items-center justify-between font-bold text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider font-extrabold">
                  EMERGENCY SOS & DISPATCH
                </span>
                <span className="text-[11px] text-white/80 font-normal">
                  Instant dialer: 108 / 102 & trusted family alerts
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Upcoming Appointment Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#29213A] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#8B5FBF]" />
              <span>Upcoming Appointment</span>
            </h2>
            <button
              onClick={() => navigate('/appointments')}
              className="text-xs font-semibold text-[#8B5FBF] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextAppointment ? (
            <Card
              interactive
              onClick={() => navigate('/appointments')}
              className="p-4 bg-white border-[#EDE3F7]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="lavender" size="sm">
                      {nextAppointment.type}
                    </Badge>
                    <span className="text-xs text-[#766C82] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {nextAppointment.time}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#29213A] mt-1.5">
                    {nextAppointment.title}
                  </h3>
                  <p className="text-xs text-[#766C82] mt-0.5">
                    {nextAppointment.doctorName} • {nextAppointment.facility}
                  </p>
                </div>
                <div className="bg-[#FAF6FE] border border-[#EDE3F7] rounded-xl p-2.5 text-center min-w-[54px] flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#8B5FBF] block uppercase">
                    {new Date(nextAppointment.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-base font-extrabold text-[#503477] leading-none">
                    {new Date(nextAppointment.date).getDate()}
                  </span>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 text-center text-xs text-[#766C82]">
              No upcoming appointments scheduled.{' '}
              <button
                onClick={() => navigate('/appointments')}
                className="text-[#8B5FBF] font-semibold underline"
              >
                Schedule now
              </button>
            </Card>
          )}
        </div>

        {/* Prescribed Medicines Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#29213A] flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-[#D95783]" />
              <span>Today's Prescribed Medicines</span>
            </h2>
            <button
              onClick={() => navigate('/medications')}
              className="text-xs font-semibold text-[#8B5FBF] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{takenCount}/{totalMeds} Taken</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <Card className="p-3 sm:p-4 bg-white space-y-2.5">
            {medications.slice(0, 3).map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#FAF6FE] border border-[#EDE3F7]/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() =>
                      markMedicationStatus(
                        med.id,
                        med.status === 'taken' ? 'pending' : 'taken'
                      )
                    }
                    className="cursor-pointer text-[#8B5FBF] hover:scale-110 transition-transform"
                    aria-label={`Mark ${med.name} status`}
                  >
                    {med.status === 'taken' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#36866A]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#DCBEEF]" />
                    )}
                  </button>
                  <div className="truncate">
                    <p className={`text-xs font-bold truncate ${med.status === 'taken' ? 'line-through text-[#766C82]' : 'text-[#29213A]'}`}>
                      {med.name}
                    </p>
                    <p className="text-[10px] text-[#766C82]">
                      {med.scheduledTime} • {med.dosage}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={med.status === 'taken' ? 'taken' : 'pending'}
                  size="sm"
                >
                  {med.status === 'taken' ? 'Taken' : 'Pending'}
                </Badge>
              </div>
            ))}

            <div className="pt-1 text-center">
              <button
                onClick={() => navigate('/medications')}
                className="text-xs font-semibold text-[#8B5FBF] hover:text-[#503477] cursor-pointer"
              >
                Open Full Medication Tracker & Dosage Guide →
              </button>
            </div>
          </Card>
        </div>

        {/* ASHA Worker Quick Access Card */}
        <Card
          interactive
          onClick={() => navigate('/asha-contact')}
          className="p-4 bg-gradient-to-r from-[#FAF6FE] to-white border-[#DCBEEF]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center font-bold text-sm shadow-soft-sm flex-shrink-0">
                <UserCheck className="w-6 h-6 text-[#8B5FBF]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#503477]">
                    ASHA Worker: {ashaWorker.name}
                  </span>
                  <Badge variant="success" size="sm">Assigned</Badge>
                </div>
                <p className="text-[11px] text-[#766C82] mt-0.5">
                  Next Home Visit: <span className="font-semibold text-[#29213A]">{ashaWorker.nextPlannedVisit}</span>
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8B5FBF]" />
          </div>
        </Card>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => navigate('/contacts')}
            className="p-3 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm flex flex-col items-center justify-center text-center hover:border-[#8B5FBF]/40 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center mb-1.5">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#29213A]">Contacts</span>
            <span className="text-[10px] text-[#766C82]">3 Trusted</span>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="p-3 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm flex flex-col items-center justify-center text-center hover:border-[#8B5FBF]/40 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F7DCE8] text-[#D95783] flex items-center justify-center mb-1.5">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#29213A]">Records</span>
            <span className="text-[10px] text-[#766C82]">PDF Export</span>
          </button>

          <button
            onClick={() => navigate('/alerts')}
            className="p-3 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm flex flex-col items-center justify-center text-center hover:border-[#8B5FBF]/40 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FDECEF] text-[#D6455D] flex items-center justify-center mb-1.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#29213A]">Alerts</span>
            <span className="text-[10px] text-[#766C82]">Safety Hub</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
