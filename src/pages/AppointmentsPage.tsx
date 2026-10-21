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
import { Appointment, AppointmentType } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Bell, 
  BellOff, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, cancelAppointment } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDoctor, setFormDoctor] = useState('Dr. Meera Nambiar');
  const [formSpecialty, setFormSpecialty] = useState('Obstetrician & Gynecologist');
  const [formFacility, setFormFacility] = useState('District Women’s Hospital');
  const [formDate, setFormDate] = useState('2026-11-10');
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formType, setFormType] = useState<AppointmentType>('Routine Antenatal');
  const [formLocation, setFormLocation] = useState('OPD Block, Room 14');
  const [formNotes, setFormNotes] = useState('');

  const upcomingList = appointments.filter((a) => a.status === 'upcoming');
  const pastList = appointments.filter((a) => a.status !== 'upcoming');

  const openAddModal = () => {
    setEditingAppointment(null);
    setFormTitle('Third Trimester Routine ANC Checkup');
    setFormDoctor('Dr. Meera Nambiar');
    setFormSpecialty('Obstetrician & Gynecologist');
    setFormFacility('District Women’s Hospital');
    setFormDate('2026-11-10');
    setFormTime('10:00 AM');
    setFormType('Routine Antenatal');
    setFormLocation('OPD Block, Room 14');
    setFormNotes('Carry mother-child protection card and previous scan files.');
    setIsAddModalOpen(true);
  };

  const openEditModal = (apt: Appointment) => {
    setEditingAppointment(apt);
    setFormTitle(apt.title);
    setFormDoctor(apt.doctorName);
    setFormSpecialty(apt.specialty);
    setFormFacility(apt.facility);
    setFormDate(apt.date);
    setFormTime(apt.time);
    setFormType(apt.type);
    setFormLocation(apt.location);
    setFormNotes(apt.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, {
        title: formTitle,
        doctorName: formDoctor,
        specialty: formSpecialty,
        facility: formFacility,
        date: formDate,
        time: formTime,
        type: formType,
        location: formLocation,
        notes: formNotes,
      });
    } else {
      addAppointment({
        title: formTitle,
        doctorName: formDoctor,
        specialty: formSpecialty,
        facility: formFacility,
        date: formDate,
        time: formTime,
        type: formType,
        location: formLocation,
        notes: formNotes,
        status: 'upcoming',
        reminderEnabled: true,
      });
    }
    setIsAddModalOpen(false);
  };

  const handleConfirmCancel = () => {
    if (cancellingId) {
      cancelAppointment(cancellingId);
      setCancellingId(null);
    }
  };

  const currentDisplayList = activeTab === 'upcoming' ? upcomingList : pastList;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Check-ups & Visits"
        subtitle="Antenatal Appointments"
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

        {/* Tab Switcher */}
        <TabSelector
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          tabs={[
            { id: 'upcoming', label: 'Upcoming Check-ups', badge: upcomingList.length },
            { id: 'past', label: 'Past & Completed', badge: pastList.length },
          ]}
        />

        {/* List of Appointments */}
        {currentDisplayList.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title={activeTab === 'upcoming' ? 'No Upcoming Appointments' : 'No Past Appointments'}
            description={
              activeTab === 'upcoming'
                ? 'Stay on track with routine maternal checkups by scheduling your next antenatal visit.'
                : 'Completed checkup records will appear here for your history review.'
            }
            actionLabel={activeTab === 'upcoming' ? 'Schedule Check-up' : undefined}
            onAction={activeTab === 'upcoming' ? openAddModal : undefined}
          />
        ) : (
          <div className="space-y-3">
            {currentDisplayList.map((apt) => (
              <Card
                key={apt.id}
                className={`p-4 bg-white border-[#EDE3F7] space-y-3 ${
                  apt.status === 'cancelled' ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="lavender" size="sm">
                        {apt.type}
                      </Badge>
                      <Badge
                        variant={
                          apt.status === 'upcoming'
                            ? 'normal'
                            : apt.status === 'completed'
                            ? 'success'
                            : 'skipped'
                        }
                        size="sm"
                      >
                        {apt.status === 'upcoming'
                          ? 'Upcoming'
                          : apt.status === 'completed'
                          ? 'Completed'
                          : 'Cancelled'}
                      </Badge>
                    </div>

                    <h3 className="text-sm font-bold text-[#29213A] mt-2">
                      {apt.title}
                    </h3>
                    <p className="text-xs text-[#503477] font-semibold mt-0.5">
                      {apt.doctorName} • <span className="text-[#766C82] font-normal">{apt.specialty}</span>
                    </p>
                  </div>

                  {/* Date badge */}
                  <div className="bg-[#FAF6FE] border border-[#EDE3F7] rounded-xl p-2 text-center min-w-[58px] flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#8B5FBF] block uppercase">
                      {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-lg font-extrabold text-[#503477] leading-none">
                      {new Date(apt.date).getDate()}
                    </span>
                  </div>
                </div>

                {/* Details bar */}
                <div className="bg-[#FAF6FE] p-2.5 rounded-xl text-xs text-[#766C82] space-y-1">
                  <div className="flex items-center gap-2 text-[#503477]">
                    <Clock className="w-3.5 h-3.5 text-[#8B5FBF]" />
                    <span>Time: <strong>{apt.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8B5FBF]" />
                    <span className="truncate">{apt.facility} ({apt.location})</span>
                  </div>
                  {apt.notes && (
                    <p className="text-[11px] text-[#766C82] pt-1 border-t border-[#EDE3F7]/50 italic">
                      "{apt.notes}"
                    </p>
                  )}
                </div>

                {/* Actions Bar */}
                {apt.status === 'upcoming' && (
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() =>
                        updateAppointment(apt.id, {
                          reminderEnabled: !apt.reminderEnabled,
                        })
                      }
                      className="flex items-center gap-1.5 text-[#766C82] hover:text-[#503477] cursor-pointer"
                    >
                      {apt.reminderEnabled ? (
                        <>
                          <Bell className="w-3.5 h-3.5 text-[#36866A]" />
                          <span className="text-[11px] font-semibold text-[#36866A]">Reminder Active</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-3.5 h-3.5 text-[#766C82]" />
                          <span className="text-[11px]">Reminder Muted</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(apt)}
                        className="p-1.5 rounded-lg text-[#8B5FBF] hover:bg-[#EDE3F7] transition-colors"
                        title="Edit appointment"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCancellingId(apt.id)}
                        className="p-1.5 rounded-lg text-[#D6455D] hover:bg-[#FDECEF] transition-colors"
                        title="Cancel appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingAppointment ? 'Edit Appointment' : 'Schedule New Check-up'}
        description="Fill in checkup details to receive timely reminders."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveAppointment}>
              {editingAppointment ? 'Save Changes' : 'Schedule Visit'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveAppointment} className="space-y-3.5">
          <FormField
            label="Visit Title / Reason"
            placeholder="e.g. 2nd Trimester Anomaly Scan"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Doctor / Nurse Name"
              value={formDoctor}
              onChange={(e) => setFormDoctor(e.target.value)}
              required
            />
            <FormField
              label="Check-up Type"
              as="select"
              value={formType}
              onChange={(e) => setFormType(e.target.value as AppointmentType)}
              options={[
                { label: 'Routine Antenatal', value: 'Routine Antenatal' },
                { label: 'Ultrasound Scan', value: 'Ultrasound Scan' },
                { label: 'Blood & Urine Test', value: 'Blood & Urine Test' },
                { label: 'Glucose Screening', value: 'Glucose Screening' },
                { label: 'ASHA Home Visit', value: 'ASHA Home Visit' },
                { label: 'Nutrition & Wellness', value: 'Nutrition & Wellness' },
                { label: 'Emergency Checkup', value: 'Emergency Checkup' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Date"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
            />
            <FormField
              label="Time"
              type="text"
              placeholder="10:30 AM"
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              required
            />
          </div>

          <FormField
            label="Hospital / Clinic Facility"
            placeholder="e.g. District Women's Hospital"
            value={formFacility}
            onChange={(e) => setFormFacility(e.target.value)}
            required
          />

          <FormField
            label="Location / Room / Ward"
            placeholder="e.g. OPD Room 12, Ultrasound Wing"
            value={formLocation}
            onChange={(e) => setFormLocation(e.target.value)}
          />

          <FormField
            label="Preparation Notes"
            as="textarea"
            rows={2}
            placeholder="e.g. Fasting required, bring past scan reports."
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
          />
        </form>
      </Modal>

      {/* Cancel Confirmation Dialog */}
      <Modal
        isOpen={Boolean(cancellingId)}
        onClose={() => setCancellingId(null)}
        title="Cancel Appointment?"
        description="Are you sure you wish to cancel this scheduled maternal visit?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCancellingId(null)}>
              Keep Appointment
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmCancel}>
              Yes, Cancel Visit
            </Button>
          </>
        }
      >
        <div className="p-3 bg-[#FDECEF] rounded-2xl border border-[#F8BCC7] text-xs text-[#B0263E] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>
            Cancelling will mark this visit as cancelled in your history and remove upcoming notifications.
          </span>
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
};
