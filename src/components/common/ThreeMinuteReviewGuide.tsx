import React from 'react';
import { X, Clock, ChevronRight, CheckCircle2, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react';
import { useRetail } from '../../context/RetailContext';

export const ThreeMinuteReviewGuide: React.FC = () => {
  const {
    isGuideOpen,
    setIsGuideOpen,
    guideStep,
    setGuideStep,
    setActiveTab,
    setRole,
    loadSnapshot
  } = useRetail();

  if (!isGuideOpen) return null;

  const steps = [
    {
      minute: 'Minute 1',
      title: 'Open Snapshot & Spotlight the ₹107,100 Outlier',
      description: 'Open on the populated Overview. Highlight the 4 headline metrics and point directly to Row 888 (Valentine\'s weekend jacket sale) in the Anomalies dot plot.',
      talkingPoints: [
        'State the headline: ₹50.34M revenue across 42,563 units with a 22.94% gross margin.',
        'Navigate to Anomalies or view Row 888 on the Overview: 50 units @ ₹2,142 = ₹107,100.',
        'Explain the statistical signal: z = +3.94σ above the dataset mean of ₹27,968.09.',
        'Emphasize that the anomaly is an investigation signal, leaving the business cause open for management review.'
      ],
      actionLabel: 'Go to Overview & Spot Row 888',
      action: () => {
        loadSnapshot();
        setActiveTab('overview');
      }
    },
    {
      minute: 'Minute 2',
      title: 'Inspect Business Evidence Behind Recommendations',
      description: 'Show how Vyaptiq IQ connects marketing return and price elasticity directly to prioritized actions.',
      talkingPoints: [
        'Navigate to Recommendations: Point to REC-01 (Denim Marketing Reallocation).',
        'Show evidence: Denim generates ₹25.85 revenue per ₹1 of spend vs baseline of ₹8.32 (+210% delta).',
        'Show REC-02 (Jacket Price Adjustment): |elasticity| < 0.5 with gross margin of 16.10% (<20% target).',
        'Show REC-03 (T-Shirt Discount Tightening): 38.0% promo rate exceeds the 25% ceiling, eroding margin.'
      ],
      actionLabel: 'Inspect Recommendations & Rules',
      action: () => {
        setActiveTab('recommendations');
      }
    },
    {
      minute: 'Minute 3',
      title: 'Role Switch, Record Decision & Print Executive Sheet',
      description: 'Simulate the decision-maker governance trail, approve an action, and generate a print-ready executive briefing.',
      talkingPoints: [
        'Switch Demo Role to "Decision Maker" in the top bar.',
        'Click "Approve Action" on REC-01 or REC-02 with a pilot testing remark.',
        'Navigate to Decisions: Show the persistent audit trail with role, timestamp, and remark.',
        'Navigate to Reports: View the print-ready Executive Summary Sheet and 4-week experiment plan.'
      ],
      actionLabel: 'Switch to Decision Maker & Review Trail',
      action: () => {
        setRole('Decision Maker');
        setActiveTab('decisions');
      }
    }
  ];

  const current = steps[guideStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#14263A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500 rounded-lg text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">3-Minute Projector Review Guide</h2>
              <p className="text-xs text-slate-300">
                Turn-by-turn presentation path for viva / B.Tech evaluation panel
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGuideOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar / Stepper */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isCurrent = guideStep === stepNum;
            const isDone = guideStep > stepNum;
            return (
              <button
                key={s.minute}
                onClick={() => setGuideStep(stepNum)}
                className={`p-3 text-left border-r last:border-r-0 transition-colors flex items-center space-x-2 ${
                  isCurrent
                    ? 'bg-white border-b-2 border-b-teal-brand font-bold text-navy-900'
                    : isDone
                    ? 'text-teal-brand hover:bg-slate-100 font-medium'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-teal-brand text-white'
                      : isDone
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : stepNum}
                </span>
                <span className="truncate">{s.minute}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex items-center space-x-2 text-xs font-semibold text-teal-brand uppercase tracking-wider mb-1">
            <span>{current.minute} Action Plan</span>
          </div>
          <h3 className="text-lg font-bold text-navy-900 mb-2">{current.title}</h3>
          <p className="text-sm text-slate-600 mb-4">{current.description}</p>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5 flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Points To Speak On Projector</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {current.talkingPoints.map((pt, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-teal-brand font-bold shrink-0 mt-0.5">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                current.action();
                setIsGuideOpen(false);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-md bg-teal-brand hover:bg-teal-hover text-white transition-colors shadow-xs"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              {guideStep > 1 && (
                <button
                  onClick={() => setGuideStep(guideStep - 1)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-navy-900 font-medium"
                >
                  Previous
                </button>
              )}
              {guideStep < 3 ? (
                <button
                  onClick={() => setGuideStep(guideStep + 1)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-md"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={() => setIsGuideOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-md"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
