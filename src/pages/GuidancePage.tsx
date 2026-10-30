import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { TabSelector } from '../components/common/TabSelector';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  Apple, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  AlertTriangle, 
  Search, 
  Send, 
  Phone, 
  AlertOctagon, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  FOOD_GUIDANCE_ITEMS, 
  DOS_AND_DONTS_ITEMS, 
  WARNING_SIGNS_ITEMS, 
  PREGNANCY_FAQS 
} from '../services/guidanceData';
import { FormField } from '../components/common/FormField';

export const GuidancePage: React.FC = () => {
  const { patient, ashaWorker, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'food' | 'dos_donts' | 'qa' | 'warning_signs'>('food');
  const [foodSearch, setFoodSearch] = useState('');
  const [foodSubCategory, setFoodSubCategory] = useState<'all' | 'eat' | 'avoid'>('all');

  // Q&A State
  const [questionInput, setQuestionInput] = useState('');
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string; time: string; warning?: string }>>([
    {
      q: 'Can I drink coconut water daily?',
      a: 'Yes, fresh tender coconut water is rich in potassium and electrolytes. It is safe and hydrating during all trimesters.',
      time: 'Earlier today',
    },
  ]);

  const handleAskQuestion = (e?: React.FormEvent, presetQ?: string) => {
    if (e) e.preventDefault();
    const query = (presetQ || questionInput).trim();
    if (!query) return;

    // Search existing curated FAQ database
    const match = PREGNANCY_FAQS.find((f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      query.toLowerCase().includes(f.category)
    );

    let answerText = '';
    let warningNote: string | undefined;

    if (match) {
      answerText = match.answer;
      warningNote = match.warningNotice;
    } else {
      // Safe medical fallback response strictly following safety rules
      answerText = `Thank you for asking. For "${query}", please consult your assigned ASHA worker ${ashaWorker.name} (${ashaWorker.phone}) or your doctor at the Community Health Centre. The assistant does not make diagnoses or prescribe treatments. If you are experiencing pain, bleeding, or dizziness, seek urgent medical care immediately.`;
      warningNote = 'Curated safe fallback — Always verify non-standard symptoms with a clinician.';
    }

    setQaHistory((prev) => [
      {
        q: query,
        a: answerText,
        time: 'Just now',
        warning: warningNote,
      },
      ...prev,
    ]);

    setQuestionInput('');
    addToast('Answer generated from curated pregnancy guidelines', 'success');
  };

  const filteredFood = FOOD_GUIDANCE_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(foodSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesCategory =
      foodSubCategory === 'all' ? true : item.category === foodSubCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Pregnancy Guidance & Coach"
        subtitle={`Gestational Week ${patient.pregnancyWeek} Guidelines`}
        showBack
        backTo="/home"
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Doctor Review Badge Banner */}
        <div className="p-3 bg-[#FAF6FE] rounded-2xl border border-[#DCBEEF] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8B5FBF] flex-shrink-0" />
            <div>
              <p className="font-bold text-[#503477]">
                Module 4: Pregnancy Coach & Diet Guide
              </p>
              <p className="text-[10px] text-[#766C82]">
                All guidelines reviewed for Week {patient.pregnancyWeek} (Trimester {patient.trimester})
              </p>
            </div>
          </div>
          <Badge variant="lavender" size="sm">
            Proposed in PDF
          </Badge>
        </div>

        <DisclaimerBanner />

        {/* Tab Navigation */}
        <TabSelector
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          tabs={[
            { id: 'food', label: 'Diet & Nutrition' },
            { id: 'dos_donts', label: "Do's & Don'ts" },
            { id: 'qa', label: 'Ask a Question' },
            { id: 'warning_signs', label: 'Warning Signs' },
          ]}
        />

        {/* Tab 1: Food Guidance */}
        {activeTab === 'food' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#766C82]" />
                <input
                  type="text"
                  placeholder="Search food items (e.g. Papaya, Milk, Iron)..."
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#EDE3F7] text-xs text-[#29213A] placeholder-[#766C82] focus:outline-none focus:ring-2 focus:ring-[#8B5FBF]"
                />
              </div>

              <div className="flex gap-1">
                {(['all', 'eat', 'avoid'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFoodSubCategory(cat)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      foodSubCategory === cat
                        ? 'bg-[#8B5FBF] text-white shadow-soft-sm'
                        : 'bg-white text-[#766C82] border border-[#EDE3F7]'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat === 'eat' ? 'Eat' : 'Avoid'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredFood.map((item) => (
                <Card
                  key={item.id}
                  className={`p-3.5 bg-white border-[#EDE3F7] space-y-1.5 ${
                    item.category === 'avoid' ? 'border-l-4 border-l-[#D6455D]' : 'border-l-4 border-l-[#36866A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#29213A]">
                      {item.category === 'eat' ? (
                        <CheckCircle className="w-4 h-4 text-[#36866A]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#D6455D]" />
                      )}
                      {item.title}
                    </span>
                    <Badge variant={item.category === 'eat' ? 'success' : 'skipped'} size="sm">
                      {item.category === 'eat' ? 'Recommended' : 'Strictly Avoid'}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#766C82] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2 rounded-xl bg-[#FAF6FE] text-[11px] text-[#503477] font-medium">
                    💡 <strong>Clinical reason:</strong> {item.benefitOrRisk}
                  </div>

                  {item.culturalContext && (
                    <p className="text-[10px] text-[#8B5FBF] italic">
                      Traditional tip: {item.culturalContext}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Do's and Don'ts */}
        {activeTab === 'dos_donts' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8B5FBF] uppercase tracking-wide">
              Everyday Safety & Posture Routine
            </h3>

            <div className="space-y-2.5">
              {DOS_AND_DONTS_ITEMS.map((item) => (
                <Card
                  key={item.id}
                  className={`p-3.5 bg-white border-[#EDE3F7] space-y-1.5 ${
                    item.category === 'dos' ? 'border-l-4 border-l-[#36866A]' : 'border-l-4 border-l-[#D6455D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#29213A]">
                      {item.category === 'dos' ? (
                        <CheckCircle className="w-4 h-4 text-[#36866A]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#D6455D]" />
                      )}
                      {item.title}
                    </span>
                    <Badge variant={item.category === 'dos' ? 'success' : 'skipped'} size="sm">
                      {item.category === 'dos' ? 'Safe Practice' : 'Do Not Do'}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#766C82] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2 rounded-xl bg-[#FAF6FE] text-[11px] text-[#503477]">
                    <strong>Why it matters:</strong> {item.benefitOrRisk}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Ask a Question */}
        {activeTab === 'qa' && (
          <div className="space-y-4">
            <form onSubmit={handleAskQuestion} className="p-3 bg-white rounded-2xl border border-[#EDE3F7] space-y-2.5">
              <h3 className="text-xs font-bold text-[#29213A] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#8B5FBF]" />
                <span>Ask Personal Pregnancy Question</span>
              </h3>

              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Is mild foot swelling normal? Can I eat mango?"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-[#F6F0FC] rounded-xl text-xs text-[#29213A] placeholder-[#766C82] focus:outline-none focus:ring-2 focus:ring-[#8B5FBF]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1 rounded-lg bg-[#8B5FBF] text-white hover:bg-[#503477] transition-colors cursor-pointer"
                  aria-label="Submit Question"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Suggested Questions Quick Chips */}
              <div>
                <p className="text-[10px] text-[#766C82] font-semibold mb-1">
                  Suggested common questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PREGNANCY_FAQS.slice(0, 3).map((faq) => (
                    <button
                      key={faq.id}
                      type="button"
                      onClick={() => handleAskQuestion(undefined, faq.question)}
                      className="px-2 py-1 rounded-lg bg-[#FAF6FE] border border-[#DCBEEF] text-[10px] text-[#503477] font-medium hover:bg-[#EDE3F7] cursor-pointer"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Q&A Stream */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#503477]">
                Answer History ({qaHistory.length})
              </h4>

              {qaHistory.map((item, idx) => (
                <Card key={idx} className="p-3.5 bg-white border-[#EDE3F7] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#29213A] flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#8B5FBF] flex-shrink-0" />
                      <span>{item.q}</span>
                    </p>
                    <span className="text-[10px] text-[#766C82] flex-shrink-0">{item.time}</span>
                  </div>

                  <p className="text-xs text-[#766C82] leading-relaxed pl-5 border-l-2 border-[#8B5FBF]/40">
                    {item.a}
                  </p>

                  {item.warning && (
                    <div className="p-2 rounded-xl bg-[#FDECEF] border border-[#F8BCC7] text-[10px] text-[#D6455D] font-semibold">
                      ⚠️ {item.warning}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Warning-Sign Education */}
        {activeTab === 'warning_signs' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-[#FDECEF] border border-[#F8BCC7] text-xs text-[#D6455D] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertOctagon className="w-4 h-4 text-[#D6455D]" />
                <span>When to Call ASHA or Ambulance 108</span>
              </div>
              <p className="text-[11px] text-[#29213A] leading-relaxed">
                If you experience ANY of the following danger signs, do not wait. Contact your ASHA worker or tap the Emergency speed dial immediately.
              </p>
              <div className="pt-1 flex gap-2">
                <a
                  href="tel:108"
                  className="px-3 py-1.5 rounded-xl bg-[#D6455D] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 108 (Ambulance)</span>
                </a>
                <a
                  href={`tel:${ashaWorker.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#D6455D] text-[#D6455D] font-bold text-xs flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call ASHA: {ashaWorker.name}</span>
                </a>
              </div>
            </div>

            <div className="space-y-2.5">
              {WARNING_SIGNS_ITEMS.map((warn) => (
                <Card key={warn.id} className="p-3.5 bg-white border-l-4 border-l-[#D6455D] border-[#EDE3F7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#29213A] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#D6455D]" />
                      <span>{warn.title}</span>
                    </h4>
                    <Badge variant={warn.urgency === 'urgent_108' ? 'critical' : 'attention'} size="sm">
                      {warn.urgency === 'urgent_108' ? 'Emergency 108' : 'Call ASHA'}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#766C82] leading-relaxed">
                    {warn.description}
                  </p>

                  <div className="p-2 rounded-xl bg-[#FAF6FE] text-[11px] text-[#503477]">
                    <strong>Clinical Significance:</strong> {warn.benefitOrRisk}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

