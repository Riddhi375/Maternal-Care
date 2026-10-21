import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FormField } from '../components/common/FormField';
import { TabSelector } from '../components/common/TabSelector';
import { HealthMetricChart } from '../components/charts/HealthMetricChart';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  timeSeries24h, 
  timeSeries7d, 
  timeSeries30d 
} from '../data/mockData';
import { HealthMetricType } from '../types';
import { 
  Heart, 
  Activity, 
  Clock, 
  Footprints, 
  Plus, 
  Wifi, 
  Info, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const HealthPage: React.FC = () => {
  const { readings, addReading, patient, chartData24h } = useApp();

  const [activeMetric, setActiveMetric] = useState<HealthMetricType>('heartRate');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Manual Reading Form State
  const [formMetricType, setFormMetricType] = useState<HealthMetricType>('heartRate');
  const [formValue, setFormValue] = useState('78');
  const [formSystolic, setFormSystolic] = useState('118');
  const [formDiastolic, setFormDiastolic] = useState('76');
  const [formNotes, setFormNotes] = useState('');
  const [formSource, setFormSource] = useState<'Manual Log' | 'Clinic Visit'>('Manual Log');

  // Active time-series dataset
  const getChartData = () => {
    switch (timeframe) {
      case '24h':
        return chartData24h;
      case '7d':
        return timeSeries7d;
      case '30d':
        return timeSeries30d;
      default:
        return chartData24h;
    }
  };

  // Metric metadata
  const metricConfigs: Record<
    HealthMetricType,
    {
      title: string;
      unit: string;
      icon: any;
      color: string;
      idealRange: string;
      clinicalNote: string;
    }
  > = {
    heartRate: {
      title: 'Resting Heart Rate',
      unit: 'bpm',
      icon: Heart,
      color: 'text-[#D95783]',
      idealRange: '70 - 95 bpm in 2nd/3rd trimester',
      clinicalNote:
        'A resting pulse increase of 10-15 bpm is normal during pregnancy due to higher circulatory blood volume.',
    },
    spo2: {
      title: 'Blood Oxygen (SpO2)',
      unit: '%',
      icon: Activity,
      color: 'text-[#36866A]',
      idealRange: '95% - 100% at rest',
      clinicalNote:
        'Continuous pulse oximetry sample. If SpO2 drops consistently below 95%, seek medical evaluation immediately.',
    },
    temperature: {
      title: 'Basal Body Temperature',
      unit: '°F',
      icon: Clock,
      color: 'text-[#D58A35]',
      idealRange: '97.6°F - 99.0°F',
      clinicalNote:
        'Mild warmth is normal with elevated progesterone. Report any persistent fever above 100.4°F.',
    },
    bloodPressure: {
      title: 'Blood Pressure (Manual/Clinic)',
      unit: 'mmHg',
      icon: Activity,
      color: 'text-[#503477]',
      idealRange: '< 120/80 mmHg (Warning if > 140/90)',
      clinicalNote:
        'Blood pressure must be monitored to screen for gestational hypertension and preeclampsia.',
    },
    movement: {
      title: 'Fetal Kicks & Movements',
      unit: 'kicks/hr',
      icon: Footprints,
      color: 'text-[#8B5FBF]',
      idealRange: '10+ movements within 2 hours',
      clinicalNote:
        'Lie on your left side after a meal to observe movement. Contact your doctor or ASHA if movements noticeably slow down.',
    },
  };

  const currentConfig = metricConfigs[activeMetric];

  // Current latest reading for the selected metric
  const latestMetricReading = readings.find((r) => r.type === activeMetric);

  const handleSaveReading = (e: React.FormEvent) => {
    e.preventDefault();
    let val: string | number = formValue;
    let systolicNum: number | undefined;
    let diastolicNum: number | undefined;

    if (formMetricType === 'bloodPressure') {
      systolicNum = Number(formSystolic) || 120;
      diastolicNum = Number(formDiastolic) || 80;
      val = `${systolicNum}/${diastolicNum}`;
    } else {
      val = Number(formValue) || 0;
    }

    const calculatedStatus: 'normal' | 'attention' = 
      formMetricType === 'heartRate' && Number(val) > 100
        ? 'attention'
        : formMetricType === 'bloodPressure' && (Number(systolicNum) >= 140 || Number(diastolicNum) >= 90)
        ? 'attention'
        : formMetricType === 'spo2' && Number(val) < 95
        ? 'attention'
        : 'normal';

    addReading({
      type: formMetricType,
      value: val,
      unit: metricConfigs[formMetricType].unit,
      systolic: systolicNum,
      diastolic: diastolicNum,
      status: calculatedStatus,
      source: formSource,
      notes: formNotes || undefined,
    });

    setIsAddModalOpen(false);
    setFormNotes('');
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Health Monitoring"
        subtitle="Vitals & Trends"
        showBack
        backTo="/home"
        rightAction={
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Log
          </Button>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Metric Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'heartRate', label: 'Heart Rate', icon: Heart },
            { id: 'spo2', label: 'SpO2 Oxygen', icon: Activity },
            { id: 'temperature', label: 'Temperature', icon: Clock },
            { id: 'bloodPressure', label: 'Blood Pressure', icon: Activity },
            { id: 'movement', label: 'Fetal Kicks', icon: Footprints },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = activeMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id as HealthMetricType)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B5FBF] text-white shadow-soft-sm'
                    : 'bg-white text-[#503477] border border-[#EDE3F7] hover:border-[#8B5FBF]/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Primary Metric Card */}
        <Card variant="highlight" className="p-4 sm:p-5 border-[#DCBEEF]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#503477]">
                  {currentConfig.title}
                </span>
                <Badge
                  variant={latestMetricReading?.status === 'attention' ? 'attention' : 'normal'}
                  size="sm"
                >
                  {latestMetricReading?.status === 'attention' ? 'Needs Rest' : 'Normal Range'}
                </Badge>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#29213A]">
                  {latestMetricReading?.value ?? '--'}
                </span>
                <span className="text-sm font-bold text-[#766C82]">
                  {currentConfig.unit}
                </span>
              </div>

              <div className="mt-2 text-xs text-[#766C82] flex items-center gap-2">
                <span>Source: <strong>{latestMetricReading?.source || 'Demo Sensor'}</strong></span>
                <span>•</span>
                <span>{latestMetricReading?.timestamp || 'Latest sample'}</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EDE3F7] flex items-center justify-center shadow-soft-sm">
              <currentConfig.icon className={`w-6 h-6 ${currentConfig.color}`} />
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-[#EDE3F7]/70 flex items-center justify-between text-xs">
            <span className="text-[#766C82]">Target Maternity Range:</span>
            <span className="font-bold text-[#36866A]">{currentConfig.idealRange}</span>
          </div>
        </Card>

        {/* Interactive Chart Container */}
        <Card className="p-4 bg-white border-[#EDE3F7]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#29213A]">Trend Analysis</h2>
              <p className="text-xs text-[#766C82]">
                Visualizing sample telemetry for {currentConfig.title}
              </p>
            </div>

            {/* Timeframe Toggle Buttons */}
            <div className="flex items-center bg-[#EDE3F7] p-1 rounded-xl text-xs font-semibold">
              {(['24h', '7d', '30d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white text-[#503477] shadow-soft-sm font-bold'
                      : 'text-[#766C82] hover:text-[#29213A]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Component */}
          <HealthMetricChart
            type={activeMetric}
            data={getChartData()}
            timeframe={timeframe}
            unit={currentConfig.unit}
          />
        </Card>

        {/* Clinical Context & Awareness Note */}
        <Card className="p-4 bg-[#FAF6FE] border-[#DCBEEF]/60">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs leading-relaxed text-[#503477]">
              <p className="font-bold mb-0.5">Gestational Guidance</p>
              <p className="text-[#766C82]">{currentConfig.clinicalNote}</p>
            </div>
          </div>
        </Card>

        {/* Device Status & Sync Information */}
        <Card className="p-4 bg-white border-[#EDE3F7] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#36866A]" />
              <span className="text-xs font-bold text-[#29213A]">
                {patient.deviceModel}
              </span>
            </div>
            <Badge variant="success" size="sm">
              Connected
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-[#766C82]">
            <p>Last Sync: <strong className="text-[#29213A]">{patient.lastSyncTime}</strong></p>
            <p>Battery: <strong className="text-[#29213A]">84% Healthy</strong></p>
          </div>
          <p className="text-[11px] text-[#766C82]/90 border-t border-[#F6F0FC] pt-2">
            Simulated Bluetooth Low Energy (BLE) peripheral link. Readings update periodically during demo sessions.
          </p>
        </Card>
      </div>

      {/* Log Manual Reading Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Health Reading"
        description="Record a clinical reading or manual test into your personal history."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveReading}>
              Save Reading
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveReading} className="space-y-4">
          <FormField
            label="Metric Type"
            as="select"
            value={formMetricType}
            onChange={(e) => {
              const newType = e.target.value as HealthMetricType;
              setFormMetricType(newType);
              switch (newType) {
                case 'heartRate':
                  setFormValue('78');
                  break;
                case 'spo2':
                  setFormValue('98');
                  break;
                case 'temperature':
                  setFormValue('98.4');
                  break;
                case 'movement':
                  setFormValue('10');
                  break;
                case 'bloodPressure':
                  setFormSystolic('118');
                  setFormDiastolic('76');
                  break;
              }
            }}
            options={[
              { label: 'Heart Rate (bpm)', value: 'heartRate' },
              { label: 'SpO2 Oxygen (%)', value: 'spo2' },
              { label: 'Body Temperature (°F)', value: 'temperature' },
              { label: 'Blood Pressure (mmHg)', value: 'bloodPressure' },
              { label: 'Fetal Kicks Count', value: 'movement' },
            ]}
          />

          {formMetricType === 'bloodPressure' ? (
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Systolic (Upper)"
                type="number"
                placeholder="118"
                value={formSystolic}
                onChange={(e) => setFormSystolic(e.target.value)}
                required
              />
              <FormField
                label="Diastolic (Lower)"
                type="number"
                placeholder="76"
                value={formDiastolic}
                onChange={(e) => setFormDiastolic(e.target.value)}
                required
              />
            </div>
          ) : (
            <FormField
              label={`Value (${metricConfigs[formMetricType].unit})`}
              type="number"
              step="0.1"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              required
            />
          )}

          <FormField
            label="Data Source"
            as="select"
            value={formSource}
            onChange={(e) => setFormSource(e.target.value as any)}
            options={[
              { label: 'Manual Patient Entry', value: 'Manual Log' },
              { label: 'Clinic Checkup Reading', value: 'Clinic Visit' },
            ]}
          />

          <FormField
            label="Context Notes (Optional)"
            placeholder="e.g. Measured after 15 minutes of rest, feeling comfortable."
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
          />
        </form>
      </Modal>

      <BottomNav />
    </div>
  );
};
