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
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { EmptyState } from '../components/common/EmptyState';
import { Medication, MedicationTiming } from '../types';
import { 
  Pill, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Info, 
  History, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const MedicationsPage: React.FC = () => {
  const { 
    medications, 
    medicationLogs, 
    markMedicationStatus, 
    addMedication, 
    updateMedication, 
    deleteMedication 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [prescribedBy, setPrescribedBy] = useState('Dr. Meera Nambiar');
  const [instructions, setInstructions] = useState('');
  const [timing, setTiming] = useState<MedicationTiming>('Morning');
  const [scheduledTime, setScheduledTime] = useState('09:00 AM');

  // Adherence Calculation
  const takenCount = medications.filter((m) => m.status === 'taken').length;
  const totalCount = medications.length;
  const adherenceRate = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  const openAddModal = () => {
    setEditingMed(null);
    setName('');
    setDosage('1 Tablet');
    setFrequency('Once daily');
    setPrescribedBy('Dr. Meera Nambiar');
    setInstructions('Take with water after food as prescribed.');
    setTiming('Morning');
    setScheduledTime('09:00 AM');
    setIsAddModalOpen(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingMed(med);
    setName(med.name);
    setDosage(med.dosage);
    setFrequency(med.frequency);
    setPrescribedBy(med.prescribedBy);
    setInstructions(med.instructions);
    setTiming(med.timing);
    setScheduledTime(med.scheduledTime);
    setIsAddModalOpen(true);
  };

  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMed) {
      updateMedication(editingMed.id, {
        name,
        dosage,
        frequency,
        prescribedBy,
        instructions,
        timing,
        scheduledTime,
      });
    } else {
      addMedication({
        name,
        dosage,
        frequency,
        prescribedBy,
        instructions,
        timing,
        scheduledTime,
        status: 'pending',
        color: '#8B5FBF',
      });
    }
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMedication(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Medicines & Supplements"
        subtitle="Prescribed Daily Schedule"
        showBack
        backTo="/home"
        rightAction={
          <Button
            size="sm"
            variant="primary"
            onClick={openAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Add
          </Button>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Adherence Overview Banner */}
        <Card variant="highlight" className="p-4 border-[#DCBEEF]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#8B5FBF] uppercase tracking-wide">
                Today's Adherence Rate
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#29213A] mt-0.5">
                {takenCount} of {totalCount} Taken
              </h1>
              <p className="text-xs text-[#766C82] mt-0.5">
                {adherenceRate === 100
                  ? 'All prescribed supplements taken for today!'
                  : 'Ensure timely calcium and iron doses with meals.'}
              </p>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#EDE3F7"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#8B5FBF"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 - (163.36 * adherenceRate) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute text-xs font-bold text-[#503477]">
                {adherenceRate}%
              </span>
            </div>
          </div>
        </Card>

        {/* Tab Switcher */}
        <TabSelector
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          tabs={[
            { id: 'today', label: "Today's Schedule", badge: medications.length },
            { id: 'history', label: 'Dose History', badge: medicationLogs.length },
          ]}
        />

        {/* Non-Prescriptive Guidance Card */}
        <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#DCBEEF]/60 text-xs text-[#503477] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#8B5FBF] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] text-[#766C82]">
            <strong>Clinical Safety Notice:</strong> MatriCare records and tracks reminders based strictly on instructions given by your registered obstetrician. It does not recommend, alter, or prescribe dosages.
          </p>
        </div>

        {/* Tab 1: Today's Reminders */}
        {activeTab === 'today' && (
          <div className="space-y-3">
            {medications.map((med) => (
              <Card
                key={med.id}
                className={`p-4 bg-white border-[#EDE3F7] space-y-3 transition-all ${
                  med.status === 'taken'
                    ? 'border-[#B6E2D3] bg-gradient-to-r from-[#EAF5F1]/30 to-white'
                    : med.status === 'skipped'
                    ? 'border-[#F8BCC7] opacity-75'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold shadow-soft-sm`}
                      style={{ backgroundColor: med.color || '#8B5FBF' }}
                    >
                      <Pill className="w-5 h-5 text-white" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="lavender" size="sm">
                          {med.timing}
                        </Badge>
                        <Badge
                          variant={
                            med.status === 'taken'
                              ? 'taken'
                              : med.status === 'skipped'
                              ? 'skipped'
                              : 'pending'
                          }
                          size="sm"
                        >
                          {med.status === 'taken'
                            ? 'Taken'
                            : med.status === 'skipped'
                            ? 'Skipped'
                            : 'Pending'}
                        </Badge>
                      </div>

                      <h3
                        className={`text-sm font-bold text-[#29213A] mt-1.5 ${
                          med.status === 'taken' ? 'line-through text-[#766C82]' : ''
                        }`}
                      >
                        {med.name}
                      </h3>
                      <p className="text-xs text-[#503477] font-semibold">
                        {med.dosage} • <span className="font-normal text-[#766C82]">{med.frequency}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(med)}
                      className="p-1.5 rounded-lg text-[#8B5FBF] hover:bg-[#EDE3F7] transition-colors"
                      title="Edit reminder"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(med.id)}
                      className="p-1.5 rounded-lg text-[#D6455D] hover:bg-[#FDECEF] transition-colors"
                      title="Remove reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instructions & Prescriber */}
                <div className="p-2.5 rounded-xl bg-[#FAF6FE] text-xs text-[#766C82] space-y-1">
                  <p className="flex items-center gap-1.5 text-[#503477] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#8B5FBF]" />
                    Scheduled at: {med.scheduledTime}
                    {med.takenAt && (
                      <span className="text-[#36866A] ml-1 font-bold">
                        (Logged at {med.takenAt})
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#766C82] leading-relaxed">
                    {med.instructions}
                  </p>
                  <p className="text-[10px] text-[#8B5FBF] pt-0.5">
                    Prescribed by: {med.prescribedBy}
                  </p>
                </div>

                {/* Action Buttons: Mark Taken / Skip / Reset */}
                <div className="flex items-center gap-2 pt-1">
                  {med.status === 'taken' ? (
                    <Button
                      size="sm"
                      fullWidth
                      variant="outline"
                      onClick={() => markMedicationStatus(med.id, 'pending')}
                      icon={<CheckCircle2 className="w-4 h-4 text-[#36866A]" />}
                    >
                      Undo Taken (Reset to Pending)
                    </Button>
                  ) : med.status === 'skipped' ? (
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        size="sm"
                        fullWidth
                        variant="success"
                        onClick={() => markMedicationStatus(med.id, 'taken')}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Mark as Taken
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markMedicationStatus(med.id, 'pending')}
                      >
                        Undo Skip
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        size="sm"
                        fullWidth
                        variant="success"
                        onClick={() => markMedicationStatus(med.id, 'taken')}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Mark as Taken
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markMedicationStatus(med.id, 'skipped')}
                        icon={<XCircle className="w-4 h-4 text-[#766C82]" />}
                      >
                        Skip
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: Dose History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {medicationLogs.length === 0 ? (
              <EmptyState
                icon={<History className="w-6 h-6" />}
                title="No Medication Logs Yet"
                description="Your daily adherence history will appear here as you log doses."
              />
            ) : (
              medicationLogs.map((log) => (
                <Card key={log.id} className="p-3.5 bg-white border-[#EDE3F7] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        log.status === 'taken'
                          ? 'bg-[#EAF5F1] text-[#36866A]'
                          : 'bg-[#FDECEF] text-[#D6455D]'
                      }`}
                    >
                      {log.status === 'taken' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#29213A]">
                        {log.medicationName}
                      </p>
                      <p className="text-[10px] text-[#766C82]">
                        {log.date} • Logged at {log.actionTime} (Scheduled: {log.scheduledTime})
                      </p>
                    </div>
                  </div>
                  <Badge variant={log.status === 'taken' ? 'taken' : 'skipped'} size="sm">
                    {log.status === 'taken' ? 'Taken' : 'Skipped'}
                  </Badge>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Medication Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingMed ? 'Edit Medication Reminder' : 'Add Medication Reminder'}
        description="Configure dosage and scheduled reminder time."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveMedication}>
              Save Reminder
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveMedication} className="space-y-3">
          <FormField
            label="Medication Name"
            placeholder="e.g. Iron & Folic Acid (IFA)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Dosage"
              placeholder="e.g. 100 mg / 1 tablet"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
            />
            <FormField
              label="Frequency"
              placeholder="e.g. Once daily after meal"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Timing Routine"
              as="select"
              value={timing}
              onChange={(e) => setTiming(e.target.value as MedicationTiming)}
              options={[
                { label: 'Morning', value: 'Morning' },
                { label: 'Afternoon', value: 'Afternoon' },
                { label: 'Night', value: 'Night' },
                { label: 'With Food', value: 'With Food' },
                { label: 'Before Sleep', value: 'Before Sleep' },
              ]}
            />
            <FormField
              label="Reminder Time"
              placeholder="09:00 AM"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
          </div>

          <FormField
            label="Prescribed By"
            placeholder="e.g. Dr. Meera Nambiar"
            value={prescribedBy}
            onChange={(e) => setPrescribedBy(e.target.value)}
          />

          <FormField
            label="Doctor's Special Instructions"
            as="textarea"
            rows={2}
            placeholder="e.g. Take with lemon water. Keep 2 hour gap from calcium."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Remove Medication Reminder?"
        description="Are you sure you wish to delete this reminder from your daily schedule?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              Keep
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
              Remove Reminder
            </Button>
          </>
        }
      >
        <div className="p-3 bg-[#FDECEF] rounded-2xl border border-[#F8BCC7] text-xs text-[#B0263E] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>
            Only remove reminders if advised by your obstetrician or if a course has finished.
          </span>
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
};
