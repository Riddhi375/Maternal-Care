import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { FormField } from '../components/common/FormField';
import { hospitalService, INITIAL_HOSPITALS } from '../services/hospitalService';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Truck, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Send
} from 'lucide-react';

export const HospitalReferralPage: React.FC = () => {
  const { patient, referrals, addReferral, updateReferralStatus, addToast } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState(INITIAL_HOSPITALS[0].id);
  const [referralReason, setReferralReason] = useState('Elevated gestational blood pressure reading with headache · Urgent obstetric triage');
  const [priority, setPriority] = useState<'Immediate Emergency' | 'Urgent Referral' | 'Routine Transfer'>('Urgent Referral');
  const [dispatchAmbulance, setDispatchAmbulance] = useState(true);

  const facilities = hospitalService.getFacilities();

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const facility = facilities.find((f) => f.id === selectedFacilityId) || facilities[0];

    addReferral({
      patientId: patient.id,
      patientName: patient.name,
      gestationalWeek: patient.pregnancyWeek,
      facilityId: facility.id,
      facilityName: facility.name,
      reason: referralReason,
      priority,
      ambulanceDispatched: dispatchAmbulance,
      status: 'initiated',
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="24/7 Hospital & PHC Network"
        subtitle="Maternal Emergency Referrals & Routing"
        showBack
        backTo="/home"
        rightAction={
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Referral
          </Button>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Module Intro Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE3F7] shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8B5FBF] uppercase">
              Module 5E: Hospital Connection (Proposed in PDF)
            </span>
            <Badge variant="lavender" size="sm">Emergency Link</Badge>
          </div>
          <h2 className="text-sm font-bold text-[#29213A]">
            Direct Clinical Escalation Route
          </h2>
          <p className="text-xs text-[#766C82] leading-relaxed">
            Ensures that an emergency case detected at home immediately reaches an authorized clinician at a nearby partner hospital or First Referral Unit (FRU) without delays.
          </p>
        </div>

        <DisclaimerBanner />

        {/* Live Referrals Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#29213A] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8B5FBF]" />
              <span>Active Referrals ({referrals.length})</span>
            </h3>
            <span className="text-[10px] text-[#766C82]">Real-time Status</span>
          </div>

          {referrals.map((ref) => (
            <Card
              key={ref.id}
              className={`p-4 bg-white border-[#EDE3F7] space-y-2.5 ${
                ref.priority === 'Immediate Emergency'
                  ? 'border-l-4 border-l-[#D6455D]'
                  : 'border-l-4 border-l-[#8B5FBF]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge
                    variant={ref.priority === 'Immediate Emergency' ? 'critical' : 'warning'}
                    size="sm"
                  >
                    {ref.priority}
                  </Badge>
                  <h4 className="text-xs font-bold text-[#29213A] mt-1">
                    {ref.facilityName}
                  </h4>
                  <p className="text-[11px] text-[#8B5FBF] font-semibold">
                    Patient: {ref.patientName} (Week {ref.gestationalWeek})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#EDE3F7] text-[#503477]">
                    {ref.status.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-[#766C82] mt-1">{ref.timestamp}</p>
                </div>
              </div>

              <p className="text-xs text-[#766C82] bg-[#FAF6FE] p-2.5 rounded-xl leading-relaxed">
                <strong>Reason:</strong> {ref.reason}
              </p>

              {ref.ambulanceDispatched && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D6455D] bg-[#FDECEF] p-2 rounded-xl">
                  <Truck className="w-4 h-4 animate-pulse" />
                  <span>Ambulance 108 Dispatched (Simulated Transfer)</span>
                </div>
              )}

              {/* Status Stepper */}
              <div className="grid grid-cols-4 gap-1 pt-1 text-[10px] text-center font-bold">
                <div className={`p-1 rounded-lg ${ref.status === 'initiated' ? 'bg-[#8B5FBF] text-white' : 'bg-[#EDE3F7] text-[#503477]'}`}>
                  1. Initiated
                </div>
                <div className={`p-1 rounded-lg ${ref.status === 'en_route' ? 'bg-[#8B5FBF] text-white animate-pulse' : 'bg-[#EDE3F7] text-[#503477]'}`}>
                  2. En Route
                </div>
                <div className={`p-1 rounded-lg ${ref.status === 'arrived' ? 'bg-[#8B5FBF] text-white' : 'bg-[#EDE3F7] text-[#503477]'}`}>
                  3. Arrived
                </div>
                <div className={`p-1 rounded-lg ${ref.status === 'admitted' ? 'bg-[#36866A] text-white' : 'bg-[#EDE3F7] text-[#503477]'}`}>
                  4. Admitted
                </div>
              </div>

              {/* Advance Status Demo Action */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#F6F0FC] text-xs">
                {ref.status === 'initiated' && (
                  <button
                    onClick={() => updateReferralStatus(ref.id, 'en_route')}
                    className="text-[#8B5FBF] hover:underline font-bold"
                  >
                    Mark En Route →
                  </button>
                )}
                {ref.status === 'en_route' && (
                  <button
                    onClick={() => updateReferralStatus(ref.id, 'arrived')}
                    className="text-[#8B5FBF] hover:underline font-bold"
                  >
                    Mark Arrived at Facility →
                  </button>
                )}
                {ref.status === 'arrived' && (
                  <button
                    onClick={() => updateReferralStatus(ref.id, 'admitted')}
                    className="text-[#36866A] hover:underline font-bold"
                  >
                    Mark Admitted to Maternity Ward ✓
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Hospital Directory Section */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-[#29213A] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#8B5FBF]" />
            <span>Designated Partner Facilities ({facilities.length})</span>
          </h3>

          <div className="space-y-2.5">
            {facilities.map((fac) => (
              <Card key={fac.id} className="p-4 bg-white border-[#EDE3F7] space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="lavender" size="sm">{fac.type}</Badge>
                    <h4 className="text-xs font-bold text-[#29213A] mt-1">{fac.name}</h4>
                    <p className="text-[11px] text-[#766C82] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#8B5FBF]" />
                      {fac.address} ({fac.distanceKm} km away)
                    </p>
                  </div>
                  <a
                    href={`tel:${fac.emergencyPhone}`}
                    className="p-2 rounded-xl bg-[#EDE3F7] hover:bg-[#DCBEEF] text-[#503477] transition-all flex items-center gap-1 text-xs font-bold"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6FE] text-xs text-[#766C82] space-y-1">
                  <p><strong>Capacity:</strong> {fac.maternityBedCapacity}</p>
                  <p><strong>Doctor on Duty:</strong> {fac.doctorOnDuty}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Create Referral Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Hospital Emergency Referral"
          description="Initiate fixed clinical transfer protocol to designated hospital."
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateReferral}>
                Dispatch Referral
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreateReferral} className="space-y-3">
            <FormField
              label="Assigned Hospital / PHC Facility"
              as="select"
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              options={facilities.map((f) => ({
                label: `${f.name} (${f.distanceKm} km)`,
                value: f.id,
              }))}
            />

            <FormField
              label="Priority Level"
              as="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { label: 'Immediate Emergency (108 Ambulance Required)', value: 'Immediate Emergency' },
                { label: 'Urgent Referral (Within 2 Hours)', value: 'Urgent Referral' },
                { label: 'Routine Transfer / Scan Review', value: 'Routine Transfer' },
              ]}
            />

            <FormField
              label="Clinical Reason & Symptoms"
              value={referralReason}
              onChange={(e) => setReferralReason(e.target.value)}
              required
            />

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F6F0FC] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={dispatchAmbulance}
                onChange={(e) => setDispatchAmbulance(e.target.checked)}
                className="rounded text-[#8B5FBF]"
              />
              <span className="font-bold text-[#29213A]">
                Request Emergency Ambulance 108 Dispatch Simulation
              </span>
            </label>
          </form>
        </Modal>
      )}
    </div>
  );
};

