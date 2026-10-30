import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

export const FallDetectionModal: React.FC = () => {
  const { fallState, confirmImOk, buzzerActive, toggleBuzzer, patient } = useApp();

  if (!fallState.isChecking) return null;

  const pct = Math.round((fallState.secondsRemaining / 30) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-[#D6455D] space-y-5 text-center relative overflow-hidden animate-scale-up">
        {/* Pulsing warning backdrop glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D6455D]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#8B5FBF]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="mx-auto w-16 h-16 rounded-3xl bg-[#FDECEF] border border-[#F8BCC7] flex items-center justify-center text-[#D6455D] animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#D6455D] bg-[#FDECEF] px-3 py-1 rounded-full">
            Movement Alert · Sensor Trigger
          </span>
          <h2 className="text-xl font-extrabold text-[#29213A] mt-2">
            Are You OK, {patient.name}?
          </h2>
          <p className="text-xs text-[#766C82] mt-1.5 leading-relaxed px-2">
            The Smart Band detected a sudden movement pattern consistent with a slip or fall.
          </p>
        </div>

        {/* Circular Countdown Progress */}
        <div className="py-2 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="text-[#EDE3F7]"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className="text-[#D6455D] transition-all duration-1000 ease-linear"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - pct / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#D6455D] leading-none">
                {fallState.secondsRemaining}
              </span>
              <span className="text-[10px] font-bold text-[#766C82] uppercase tracking-wide">
                Seconds
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#766C82] mt-2 max-w-xs">
            Automatic Emergency Alert & SMS will be sent to your family and ASHA worker if there is no response.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={confirmImOk}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#36866A] to-[#24634E] text-white font-extrabold text-base shadow-soft-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I'M OK — Cancel False Alarm</span>
          </button>

          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <button
              onClick={toggleBuzzer}
              className="flex items-center gap-1.5 text-[#766C82] hover:text-[#503477] font-semibold cursor-pointer"
            >
              {buzzerActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#D6455D] animate-pulse" />
                  <span>Buzzer Active (Mute)</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#766C82]" />
                  <span>Buzzer Muted (Turn On)</span>
                </>
              )}
            </button>

            <span className="text-[10px] text-[#766C82]">
              Demo Check-in Simulation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
