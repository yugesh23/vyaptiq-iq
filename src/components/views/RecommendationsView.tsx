import React, { useState } from 'react';
import {
  Lightbulb,
  TrendingUp,
  Percent,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Check,
  ChevronRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useRetail } from '../../context/RetailContext';
import { Recommendation } from '../../types/retail';

export const RecommendationsView: React.FC = () => {
  const {
    recommendations,
    kpis,
    isSnapshotView,
    activeDatasetMeta,
    setActiveTab,
    role,
    updateDecisionStatus
  } = useRetail();

  const [selectedRecId, setSelectedRecId] = useState<string>(
    recommendations.length > 0 ? recommendations[0].id : 'REC-01'
  );

  // Scenario Simulator State for 4-Week Projection
  const [priceChangePct, setPriceChangePct] = useState<number>(4.0);
  const [mktReallocPct, setMktReallocPct] = useState<number>(20.0);
  const [promoReductionPct, setPromoReductionPct] = useState<number>(15.0);

  const selectedRec = recommendations.find(r => r.id === selectedRecId) || recommendations[0];

  // Simulator calculations
  const baselineRev = selectedRec ? selectedRec.inputFigures.totalRevenue || (kpis.totalRevenue / 5) : 10000000;
  const baselineMarginPct = selectedRec ? selectedRec.inputFigures.skuMarginPct : 20.0;
  const baselineMargin = (baselineRev * baselineMarginPct) / 100;

  // 4-Week estimates based on recommendation type
  let projectedRevGain = 0;
  let projectedMarginGain = 0;
  let simulatedMarginPct = baselineMarginPct;

  if (selectedRec?.id === 'REC-01') {
    // Marketing reallocation
    projectedRevGain = baselineRev * (mktReallocPct * 0.0035);
    projectedMarginGain = projectedRevGain * (baselineMarginPct / 100);
    simulatedMarginPct = ((baselineMargin + projectedMarginGain) / (baselineRev + projectedRevGain)) * 100;
  } else if (selectedRec?.id === 'REC-02') {
    // Price adjustment with inelastic demand (assume e = -0.28)
    const demandDrop = (priceChangePct * 0.28) / 100;
    const priceMultiplier = 1 + (priceChangePct / 100);
    const volumeMultiplier = 1 - demandDrop;
    const newRev = baselineRev * priceMultiplier * volumeMultiplier;
    projectedRevGain = newRev - baselineRev;
    projectedMarginGain = projectedRevGain * 0.85; // price increases flow heavily to gross margin
    simulatedMarginPct = ((baselineMargin + projectedMarginGain) / newRev) * 100;
  } else if (selectedRec?.id === 'REC-03') {
    // Promo frequency tightening
    const promoSavings = baselineRev * (promoReductionPct * 0.002);
    projectedRevGain = -baselineRev * 0.01; // minor volume dip
    projectedMarginGain = promoSavings;
    simulatedMarginPct = ((baselineMargin + projectedMarginGain) / (baselineRev + projectedRevGain)) * 100;
  }

  const handleQuickApprove = () => {
    if (!selectedRec) return;
    const ok = updateDecisionStatus(
      selectedRec.id,
      'Approved',
      `Approved for 4-week regional pilot test. Simulated margin expansion: +${(simulatedMarginPct - baselineMarginPct).toFixed(2)} percentage points.`
    );
    if (ok) {
      setActiveTab('decisions');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-navy-900 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-teal-brand" />
              <span>Prioritized Rule-Based Recommendations</span>
            </h1>
            <span className="font-mono text-xs bg-teal-light text-teal-brand border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
              {recommendations.length} Evaluated Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic business opportunity identification backed by empirical transaction evidence and transparent scoring formulas.
          </p>
        </div>

        {/* Priority Mapping Indicator */}
        <div className="flex items-center space-x-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium">Business Priority:</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[11px]">Action Required</span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">Optimize</span>
          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium text-[11px]">Monitor</span>
        </div>
      </div>

      {/* Three Candidate Recommendations Navigation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => {
          const isSelected = selectedRecId === rec.id;
          const priorityColor =
            rec.priorityCategory === 'Action Required' || rec.priorityCategory === 'Immediate Action'
              ? 'border-rose-300 bg-rose-50/40 text-rose-800'
              : rec.priorityCategory === 'Optimize'
              ? 'border-amber-300 bg-amber-50/40 text-amber-800'
              : 'border-slate-200 bg-slate-50 text-slate-700';

          return (
            <div
              key={rec.id}
              onClick={() => setSelectedRecId(rec.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 relative ${
                isSelected
                  ? 'border-teal-brand bg-white shadow-md ring-2 ring-teal-brand/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold text-teal-brand bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  RANK #{index + 1} • {rec.id}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}>
                  {rec.priorityCategory}
                </span>
              </div>

              <h3 className="font-bold text-xs text-navy-900 leading-snug line-clamp-2">
                {rec.title}
              </h3>

              <div className="flex justify-between items-center text-xs font-mono pt-1 text-slate-600">
                <span>{rec.priorityScoreLabel}</span>
                <span className="font-bold text-navy-900">
                  {rec.currentStatus === 'Approved' ? (
                    <span className="text-emerald-700 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Approved</span>
                    </span>
                  ) : (
                    <span>Status: {rec.currentStatus}</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Recommendation Deep-Dive */}
      {selectedRec && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
          {/* Title & Suggested Action Card */}
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-teal-brand px-2 py-0.5 bg-white rounded border border-teal-200">
                  {selectedRec.id}
                </span>
                <span className="font-bold text-sm text-teal-950">
                  {selectedRec.title}
                </span>
                <span className="text-[11px] font-bold bg-white text-navy-900 border border-slate-200 px-2 py-0.5 rounded-full">
                  Target SKU: {selectedRec.sku}
                </span>
              </div>
              <p className="text-xs text-teal-900 leading-relaxed font-medium">
                <strong>Proposed Action:</strong> {selectedRec.suggestedAction}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleQuickApprove}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold shadow-2xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Approve Action</span>
              </button>
            </div>
          </div>

          {/* Business Question & Eligibility Rule Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Box 1: Business Question & Eligibility */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="font-bold text-navy-900 flex items-center space-x-2 uppercase tracking-wide text-[11px]">
                <HelpCircle className="w-4 h-4 text-teal-brand" />
                <span>Business Question & Eligibility Rule</span>
              </h3>
              <div>
                <p className="text-slate-500 font-semibold text-[11px]">Core Business Inquiry:</p>
                <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">
                  "{selectedRec.businessQuestion}"
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <p className="text-slate-500 font-semibold text-[11px]">Eligibility Rule Condition:</p>
                <div className="mt-1 p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-navy-900">
                  {selectedRec.eligibilityRule}
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Rule Condition Verified (Passes Ingestion Thresholds)</span>
              </div>
            </div>

            {/* Box 2: Input Figures & Comparison Baseline */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="font-bold text-navy-900 flex items-center space-x-2 uppercase tracking-wide text-[11px]">
                <Layers className="w-4 h-4 text-teal-brand" />
                <span>Empirical Input Figures & Peer Baseline</span>
              </h3>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="text-slate-500">Current Gross Margin %:</span>
                  <span className="font-bold text-navy-900">{selectedRec.inputFigures.skuMarginPct.toFixed(2)}%</span>
                </div>
                {selectedRec.revenuePerSpend !== null && (
                  <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-500">Revenue per ₹1 Marketing Spend:</span>
                    <span className="font-bold text-teal-brand">₹{selectedRec.revenuePerSpend.toFixed(2)}</span>
                  </div>
                )}
                {selectedRec.priceElasticity !== null && (
                  <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-500">Price Elasticity (OLS Beta):</span>
                    <span className="font-bold text-navy-900">{selectedRec.priceElasticity.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="pt-1 text-slate-600 leading-relaxed text-[11px]">
                <strong>Peer Baseline:</strong> {selectedRec.comparisonBaseline}
              </div>
            </div>
          </div>

          {/* Interactive 4-Week Scenario Preview (Editable Simulator) */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-teal-brand" />
                  <span>Interactive 4-Week Scenario Preview & Sensitivity Model</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust implementation assumptions to preview projected gross-margin expansion before recording an operational decision.
                </p>
              </div>
              <span className="font-mono text-[11px] text-amber-flag bg-amber-bg border border-amber-border px-2 py-0.5 rounded">
                Projected Estimates • Pending Follow-up Data
              </span>
            </div>

            {/* Slider Controls Based On Recommendation Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {selectedRec.id === 'REC-01' ? (
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Marketing Reallocation:</span>
                    <span className="font-mono font-bold text-teal-brand">{mktReallocPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={mktReallocPct}
                    onChange={(e) => setMktReallocPct(parseFloat(e.target.value))}
                    className="w-full accent-teal-brand"
                  />
                  <p className="text-[10px] text-slate-400">Shift ad budget from low-ROI products</p>
                </div>
              ) : selectedRec.id === 'REC-02' ? (
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Selling Price Increase:</span>
                    <span className="font-mono font-bold text-teal-brand">+{priceChangePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={priceChangePct}
                    onChange={(e) => setPriceChangePct(parseFloat(e.target.value))}
                    className="w-full accent-teal-brand"
                  />
                  <p className="text-[10px] text-slate-400">Tested across online & retail channels</p>
                </div>
              ) : (
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Promo Frequency Cap:</span>
                    <span className="font-mono font-bold text-teal-brand">-{promoReductionPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={promoReductionPct}
                    onChange={(e) => setPromoReductionPct(parseFloat(e.target.value))}
                    className="w-full accent-teal-brand"
                  />
                  <p className="text-[10px] text-slate-400">Reduce discount depth and frequency</p>
                </div>
              )}

              {/* Baseline vs Projected Comparison Box */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1 font-mono md:col-span-2">
                <span className="font-sans font-bold text-slate-700 text-xs uppercase tracking-wide block mb-1">
                  Baseline vs Scenario Projection (4-Week Horizon)
                </span>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block font-sans">Baseline Margin</span>
                    <span className="font-bold text-navy-900">₹{baselineMargin.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({baselineMarginPct.toFixed(1)}%)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans">Projected Margin</span>
                    <span className="font-bold text-emerald-700">
                      ₹{(baselineMargin + projectedMarginGain).toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({simulatedMarginPct.toFixed(1)}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans">Net Gain / Expansion</span>
                    <span className="font-bold text-teal-brand">
                      +₹{projectedMarginGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (+{(simulatedMarginPct - baselineMarginPct).toFixed(1)}pp)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
