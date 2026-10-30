import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  X, 
  Activity, 
  Heart, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  MapPin, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { SmsSimulatorModal } from './SmsSimulatorModal';

export const SimulationControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const { 
    triggerFallDetection, 
    simulateWearableReading, 
    toggleBleConnection, 
    bleStatus, 
    buzzerActive, 
    toggleBuzzer, 
    offlineStatus, 
    toggleOnlineSimulation, 
    triggerManualSync,
    refreshLocation,
    smsMessages
  } = useApp();

  return (
    <>
      {/* Floating Trigger Pill */}
      <aside aria-label="Testing and simulation triggers" className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#503477] text-white shadow-xl hover:bg-[#3D265C] active:scale-95 transition-all text-xs font-bold cursor-pointer border border-[#DCBEEF]/40"
          title="Open Simulation & Testing Controls"
        >
          <Sliders className="w-3.5 h-3.5 text-[#DCBEEF]" />
          <span>Simulate</span>
        </button>
      </aside>

      {/* Slide-over Testing Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#EDE3F7] space-y-4 max-h-[88vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE3F7]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#29213A]">
                    Feature Simulation & Test Bar
                  </h2>
                  <p className="text-[10px] text-[#766C82]">
                    Trigger hardware, sensor & network workflows
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F6F0FC] text-[#766C82] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notice */}
            <div className="p-2.5 rounded-xl bg-[#FAF6FE] border border-[#DCBEEF] text-[11px] text-[#503477] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5FBF] flex-shrink-0 mt-0.5" />
              <span>
                All triggers simulate physical sensors, BLE packets, SMS delivery, and GPS without requiring paid external services.
              </span>
            </div>

            {/* Triggers Section */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#8B5FBF] uppercase tracking-wider">
                Module 1: Safety & Wearable Triggers
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    triggerFallDetection();
                    setIsOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-[#FDECEF] hover:bg-[#F8BCC7] text-[#D6455D] text-left transition-all border border-[#F8BCC7] cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 mb-1" />
                  <p className="text-xs font-bold">Simulate Fall</p>
                  <p className="text-[10px] opacity-80">Triggers 30s check-in</p>
                </button>

                <button
                  onClick={toggleBuzzer}
                  className="p-3 rounded-2xl bg-[#FAF6FE] hover:bg-[#EDE3F7] text-[#503477] text-left transition-all border border-[#EDE3F7] cursor-pointer"
                >
                  {buzzerActive ? (
                    <Volume2 className="w-4 h-4 mb-1 text-[#D6455D]" />
                  ) : (
                    <VolumeX className="w-4 h-4 mb-1 text-[#766C82]" />
                  )}
                  <p className="text-xs font-bold">Wearable Buzzer</p>
                  <p className="text-[10px] opacity-80">{buzzerActive ? 'Turn Off Audio' : 'Test 880Hz Tone'}</p>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleBleConnection}
                  className="p-2.5 rounded-xl bg-white border border-[#EDE3F7] text-left text-xs font-semibold text-[#29213A] hover:bg-[#FAF6FE] flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    {bleStatus.connected ? <Wifi className="w-3.5 h-3.5 text-[#36866A]" /> : <WifiOff className="w-3.5 h-3.5 text-[#D6455D]" />}
                    BLE Smart Band
                  </span>
                  <span className="text-[10px] text-[#8B5FBF] font-bold">
                    {bleStatus.connected ? 'Disconnect' : 'Connect'}
                  </span>
                </button>

                <button
                  onClick={toggleOnlineSimulation}
                  className="p-2.5 rounded-xl bg-white border border-[#EDE3F7] text-left text-xs font-semibold text-[#29213A] hover:bg-[#FAF6FE] flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-[#8B5FBF]" />
                    Network State
                  </span>
                  <span className="text-[10px] font-bold text-[#503477]">
                    {offlineStatus.isOnline ? 'Go Offline' : 'Go Online'}
                  </span>
                </button>
              </div>

              <h4 className="text-[11px] font-bold text-[#8B5FBF] uppercase tracking-wider pt-1">
                Module 2: Smart Insight & Vitals Simulation
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => simulateWearableReading('heartRate', true)}
                  className="p-2 rounded-xl bg-[#FAF6FE] border border-[#EDE3F7] text-center hover:bg-[#EDE3F7] transition-all cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-[#D95783] mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold block text-[#29213A]">High Pulse</span>
                  <span className="text-[9px] text-[#766C82]">120 bpm</span>
                </button>

                <button
                  onClick={() => simulateWearableReading('spo2', true)}
                  className="p-2 rounded-xl bg-[#FAF6FE] border border-[#EDE3F7] text-center hover:bg-[#EDE3F7] transition-all cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-[#36866A] mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold block text-[#29213A]">Low SpO2</span>
                  <span className="text-[9px] text-[#766C82]">92%</span>
                </button>

                <button
                  onClick={() => simulateWearableReading('bloodPressure', true)}
                  className="p-2 rounded-xl bg-[#FAF6FE] border border-[#EDE3F7] text-center hover:bg-[#EDE3F7] transition-all cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-[#503477] mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold block text-[#29213A]">High BP</span>
                  <span className="text-[9px] text-[#766C82]">154/96</span>
                </button>
              </div>

              <h4 className="text-[11px] font-bold text-[#8B5FBF] uppercase tracking-wider pt-1">
                Planned Features: SMS & GPS
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsSmsModalOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-white border border-[#EDE3F7] text-xs font-semibold text-[#29213A] hover:bg-[#FAF6FE] flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#8B5FBF]" />
                    SMS Console
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EDE3F7] text-[#503477] font-bold">
                    {smsMessages.length}
                  </span>
                </button>

                <button
                  onClick={refreshLocation}
                  className="p-2.5 rounded-xl bg-white border border-[#EDE3F7] text-xs font-semibold text-[#29213A] hover:bg-[#FAF6FE] flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#36866A]" />
                  <span>Refresh GPS</span>
                </button>
              </div>

              {/* Sync Action if items pending */}
              {offlineStatus.pendingReadingsCount > 0 && (
                <div className="pt-1">
                  <button
                    onClick={triggerManualSync}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#8B5FBF] text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync {offlineStatus.pendingReadingsCount} Pending Offline Records</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SMS Gateway Simulator Modal */}
      <SmsSimulatorModal isOpen={isSmsModalOpen} onClose={() => setIsSmsModalOpen(false)} />
    </>
  );
};

