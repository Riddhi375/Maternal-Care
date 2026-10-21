import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { pregnancyWeeksGuide } from '../data/mockData';
import { 
  Sparkles, 
  Baby, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  ShieldCheck, 
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const PregnancyPage: React.FC = () => {
  const { patient } = useApp();

  const [selectedWeek, setSelectedWeek] = useState<number>(patient.pregnancyWeek || 24);

  // Available documented guide weeks or closest
  const availableWeeks = [12, 16, 20, 24, 28, 32, 36, 40];

  // Lookup data for current selected week or nearest
  const weekData = pregnancyWeeksGuide[selectedWeek] || pregnancyWeeksGuide[24];

  const currentTrimester = selectedWeek <= 13 ? 1 : selectedWeek <= 27 ? 2 : 3;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Pregnancy Journey"
        subtitle={`Week ${selectedWeek} • Trimester ${currentTrimester}`}
        showBack
        backTo="/home"
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Current Gestation Overview Banner */}
        <Card variant="highlight" className="p-4 sm:p-5 border-[#DCBEEF]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="lavender" size="sm">
                  Trimester {currentTrimester}
                </Badge>
                {selectedWeek === patient.pregnancyWeek && (
                  <Badge variant="success" size="sm">
                    Current Week
                  </Badge>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#29213A] mt-1">
                Week {selectedWeek} of Pregnancy
              </h1>
              <p className="text-xs text-[#766C82]">
                Estimated Due Date: <strong className="text-[#503477]">{patient.estimatedDueDate}</strong>
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm flex items-center justify-center flex-shrink-0">
              <Baby className="w-8 h-8 text-[#8B5FBF]" />
            </div>
          </div>

          {/* Fruit / Size Comparison */}
          <div className="mt-4 p-3 bg-white/90 rounded-2xl border border-[#EDE3F7] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F7DCE8] text-[#D95783] flex items-center justify-center font-bold text-lg">
                🌽
              </div>
              <div>
                <span className="text-[10px] text-[#766C82] font-semibold block uppercase">
                  Baby Size Comparison
                </span>
                <span className="text-xs font-bold text-[#29213A]">
                  {weekData.babySizeFruit}
                </span>
              </div>
            </div>

            <div className="text-right text-xs">
              <p className="font-bold text-[#503477]">{weekData.babySizeInches}</p>
              <p className="text-[10px] text-[#766C82]">~{weekData.babyWeightGrams}</p>
            </div>
          </div>
        </Card>

        {/* Interactive Week Timeline Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#29213A]">
              Week-by-Week Timeline
            </h2>
            <span className="text-xs text-[#8B5FBF] font-semibold">
              Tap any week to explore
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {availableWeeks.map((wk) => {
              const isSelected = selectedWeek === wk;
              const isCurrent = patient.pregnancyWeek === wk;
              return (
                <button
                  key={wk}
                  onClick={() => setSelectedWeek(wk)}
                  className={`flex flex-col items-center justify-center min-w-[62px] py-2 px-2.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#8B5FBF] text-white border-[#8B5FBF] shadow-soft'
                      : isCurrent
                      ? 'bg-[#EDE3F7] text-[#503477] border-[#8B5FBF]/40'
                      : 'bg-white text-[#766C82] border-[#EDE3F7] hover:border-[#DCBEEF]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-tight">
                    Week
                  </span>
                  <span className="text-base font-extrabold leading-none mt-0.5">
                    {wk}
                  </span>
                  {isCurrent && (
                    <span className="text-[8px] font-extrabold mt-1 px-1 rounded-full bg-[#36866A] text-white">
                      You
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Baby Milestone Card */}
        <Card className="p-4 sm:p-5 bg-white border-[#EDE3F7] space-y-2">
          <div className="flex items-center gap-2 text-[#8B5FBF]">
            <Sparkles className="w-5 h-5 text-[#D95783]" />
            <h3 className="text-sm font-bold text-[#29213A]">
              Baby's Development at Week {selectedWeek}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#503477] leading-relaxed">
            {weekData.babyMilestone}
          </p>
        </Card>

        {/* Maternal Changes Card */}
        <Card className="p-4 sm:p-5 bg-white border-[#EDE3F7] space-y-2">
          <div className="flex items-center gap-2 text-[#503477]">
            <Heart className="w-4 h-4 text-[#8B5FBF]" />
            <h3 className="text-sm font-bold text-[#29213A]">
              Changes in Mother's Body
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#766C82] leading-relaxed">
            {weekData.motherChanges}
          </p>
        </Card>

        {/* Care & Nutrition Tips */}
        <Card className="p-4 sm:p-5 bg-[#FAF6FE] border-[#DCBEEF]/80 space-y-2.5">
          <div className="flex items-center gap-2 text-[#503477]">
            <CheckCircle2 className="w-4 h-4 text-[#36866A]" />
            <h3 className="text-sm font-bold text-[#29213A]">
              Recommended Care & Nutrition Tips
            </h3>
          </div>
          <ul className="space-y-2">
            {weekData.careTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#503477]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5FBF] mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recommended Tests and Checkups */}
        <Card className="p-4 bg-white border-[#EDE3F7] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#503477]">
              <Calendar className="w-4 h-4 text-[#8B5FBF]" />
              <h3 className="text-sm font-bold text-[#29213A]">
                Key Tests & Clinical Checkups
              </h3>
            </div>
            <Badge variant="lavender" size="sm">
              Standard Protocol
            </Badge>
          </div>

          <div className="space-y-1.5 pt-1">
            {weekData.recommendedTests.map((tst, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#FAF6FE] border border-[#EDE3F7] text-xs font-semibold text-[#503477] flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-[#8B5FBF]" />
                <span>{tst}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Danger Signs / Critical Warnings */}
        <Card className="p-4 bg-[#FDECEF] border-[#F8BCC7] space-y-2">
          <div className="flex items-center gap-2 text-[#D6455D]">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-bold text-[#B0263E]">
              When to Contact ASHA or Hospital Immediately
            </h3>
          </div>
          <p className="text-xs text-[#B0263E]/90 leading-relaxed">
            If you experience any of the following symptoms at this stage, do not wait:
          </p>
          <ul className="space-y-1 pt-1">
            {weekData.warningSigns.map((sign, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs font-medium text-[#B0263E]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6455D] mt-1.5 flex-shrink-0" />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};
