import React, { useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useRetail } from '../../context/RetailContext';

export const ReportsView: React.FC = () => {
  const {
    kpis,
    anomalies,
    recommendations,
    decisionHistory,
    activeDatasetMeta,
    isSnapshotView,
    role
  } = useRetail();

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const topRec = recommendations.length > 0 ? recommendations[0] : null;
  const leadAnomaly = anomalies.length > 0 ? anomalies[0] : null;

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-navy-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-brand" />
              <span>Executive Briefing & Project Review Sheets</span>
            </h1>
            <span className="font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              Ready for Print / PDF Export
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Print-optimized executive summary sheet, 4-week experiment blueprint, and academic viva pitches.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Review Notes & Presentation Pitches (Hidden in Print) */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Pitch */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-xs text-navy-900 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>45–60s Business Viva Pitch</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Executive Narrative</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            "Respected panel members, retail organizations frequently experience top-line revenue growth while simultaneously suffering gross margin degradation due to uncoordinated pricing, uncalibrated promotions, and siloed spreadsheets. <strong>Vyaptiq IQ</strong> solves this by consolidating transaction validation, weighted gross margin tracking, and statistical anomaly detection into an integrated decision framework. In our Apparel Store analysis of ₹50.34M in sales, our system uncovered an extreme ₹107,100 jacket transaction at +3.94σ above baseline and identified that Apparel_Denim generates ₹25.85 in revenue per ₹1 of ad spend—exceeding baseline by +210%. By approving REC-01, management greenlights a 4-week regional pilot to expand gross margin by +8.5% with auditable governance."
          </p>
        </div>

        {/* Technical Pitch */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-xs text-navy-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-brand" />
              <span>90–120s Technical Viva Pitch</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Engineering Architecture</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            "From an engineering perspective, Vyaptiq IQ is built on a responsive React, TypeScript, and Tailwind CSS stack featuring dual-mode persistence: a local browser storage adapter for offline review and a Supabase PostgreSQL backend with Row-Level Security for connected operations. The pipeline processes raw transaction CSVs through an automated alias mapper and validation engine. Gross margin is computed as a weighted aggregate rather than row averages to prevent mathematical distortion. Anomaly detection employs population standard deviation with ddof=0 across valid transactions, isolating significant outliers like Row 888 at z = +3.94σ. Our recommendation engine applies log-log OLS regression to compute empirical price elasticity and scores actions across a 5-stage idempotent decision lifecycle."
          </p>
        </div>
      </div>

      {/* Printable Executive Summary Sheet Container */}
      <div
        ref={printRef}
        className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm space-y-6 text-navy-900 print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* Document Header */}
        <div className="border-b-2 border-navy-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-navy-900">VYAPTIQ IQ</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-brand text-white">
                EXECUTIVE BRIEFING
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Data Driven Retail Intelligence For Revenue Growth • B.Tech Project Review Report
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-600">
            <p>Dataset: <span className="font-bold text-navy-900">{activeDatasetMeta.name}</span></p>
            <p>Reporting Period: <span className="font-bold">{activeDatasetMeta.dateRange.start} – {activeDatasetMeta.dateRange.end}</span></p>
            <p>Generated: <span className="font-bold">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span></p>
          </div>
        </div>

        {/* Section 1: Executive KPI Scorecard */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            1. Executive Baseline Performance Scorecard
          </h2>
          <div className="grid grid-cols-4 gap-3 border border-slate-300 rounded-lg p-3 bg-slate-50 font-mono text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block font-sans">Total Revenue</span>
              <span className="text-base font-bold text-navy-900">
                ₹{kpis.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block font-sans">Gross Margin (₹)</span>
              <span className="text-base font-bold text-emerald-700">
                ₹{kpis.totalMargin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block font-sans">Gross Margin %</span>
              <span className="text-base font-bold text-navy-900">{kpis.marginPct.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block font-sans">Total Units Sold</span>
              <span className="text-base font-bold text-navy-900">{kpis.totalUnits.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-600 mt-2 px-1">
            <span>Promotion Rate: <strong>{kpis.promoRate.toFixed(1)}%</strong> ({kpis.promoRateCoverage.toFixed(0)}% coverage)</span>
            <span>ARPU: <strong>{kpis.arpu !== null ? `₹${kpis.arpu.toFixed(2)}` : 'Unavailable'}</strong> ({kpis.arpuDenominator})</span>
            <span>Transaction Coverage: <strong>{activeDatasetMeta.rowCount.toLocaleString()} rows</strong> across {kpis.uniqueSkus} SKUs</span>
          </div>
        </div>

        {/* Section 2: Leading Outlier Spotlight */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            2. Significant Transaction Anomaly Spotlight
          </h2>
          {leadAnomaly ? (
            <div className="border border-amber-300 rounded-lg p-4 bg-amber-50/50 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy-900">
                  Leading Anomaly: Row #{leadAnomaly.rowId} ({leadAnomaly.sku} • {leadAnomaly.region} Region)
                </span>
                <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Z-Score: +{leadAnomaly.zScore.toFixed(2)}σ
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
                <div>Date: <strong>{leadAnomaly.date}</strong></div>
                <div>Volume: <strong>{leadAnomaly.units} units @ ₹{leadAnomaly.price}</strong></div>
                <div>Total Revenue: <strong>₹{leadAnomaly.revenue.toLocaleString('en-IN')}</strong></div>
              </div>
              <p className="text-slate-700 text-[11px] pt-1 border-t border-amber-200">
                <strong>Investigation Signal:</strong> {leadAnomaly.investigationSignal}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No outlier detected exceeding the alert threshold.</p>
          )}
        </div>

        {/* Section 3: Prioritized Recommendation & Evidence */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            3. Prioritized Strategic Business Recommendation
          </h2>
          {topRec ? (
            <div className="border border-slate-300 rounded-lg p-4 space-y-3 text-xs bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-teal-brand text-[11px]">{topRec.id}</span>
                  <h3 className="font-bold text-navy-900 text-sm">{topRec.title}</h3>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px]">
                    {topRec.priorityCategory}
                  </span>
                  <p className="font-mono text-[10px] text-slate-500 mt-1">{topRec.priorityScoreLabel}</p>
                </div>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <p className="font-semibold text-navy-900">Action Plan:</p>
                <p className="text-slate-700 mt-0.5">{topRec.suggestedAction}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div>Marketing Return: <strong>{topRec.revenuePerSpend ? `₹${topRec.revenuePerSpend.toFixed(2)} / ₹1` : 'N/A'}</strong></div>
                <div>Current Margin: <strong>{topRec.inputFigures.skuMarginPct.toFixed(1)}%</strong></div>
                <div>Projected Gain: <strong>+₹{topRec.projectedRevenueGain.toLocaleString('en-IN')}</strong></div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Rule Baseline: {topRec.comparisonBaseline}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No recommendation candidate evaluated.</p>
          )}
        </div>

        {/* Section 4: 4-Week Channel A/B Experiment Plan */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            4. Proposed 4-Week Channel A/B Experiment Blueprint
          </h2>
          <div className="border border-slate-300 rounded-lg p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Target Cohort</span>
                <span className="font-bold text-navy-900">1,500+ Transactions</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Experiment Duration</span>
                <span className="font-bold text-navy-900">4 Calendar Weeks</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Test vs Control</span>
                <span className="font-bold text-navy-900">South (Test) vs North (Holdout)</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Primary KPI Measures</span>
                <span className="font-bold text-teal-brand">Margin Expansion & Ad ROI</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 text-[11px]">Operational Intervention:</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Reallocate 20% of digital marketing budget from lower-performing baseline categories (Accessories and T-Shirts) to Apparel_Denim. Monitor incremental basket margin, conversion elasticity, and holdout baseline differences weekly.
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 font-mono">
                <span>Observed Lift: Pending follow-up test data</span>
                <span>Confidence Level: 95% (Two-sample t-test)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Decision Authorization & Sign-Off Trail */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            5. Decision Authorization & Governance Sign-Off Trail
          </h2>
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 text-xs">
            {decisionHistory.length > 0 ? (
              <div className="space-y-2">
                {decisionHistory.slice(-3).map((d) => (
                  <div key={d.id} className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center font-mono text-[11px]">
                    <div>
                      <span className="font-bold text-navy-900">{d.recommendationId}</span> •{' '}
                      <span className="text-slate-600">{d.reviewerName} ({d.reviewerRole})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                        {d.newStatus}
                      </span>
                      <span className="text-slate-400 font-sans text-[10px]">{new Date(d.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-[11px]">
                Pending executive sign-off. Switch role to "Decision Maker" on the Decisions tab to record an authorized manager decision.
              </p>
            )}

            <div className="grid grid-cols-2 gap-8 pt-6 mt-4 border-t border-slate-200 text-xs">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Prepared By (Lead Analyst):</p>
                <div className="border-b border-slate-400 h-8 mt-2" />
                <p className="font-semibold text-navy-900 mt-1">Hari Sai Yugesh (23KN1A1239)</p>
                <p className="text-slate-500 text-[10px]">Department of IT, NRIIT</p>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Approved By (Project Guide / Manager):</p>
                <div className="border-b border-slate-400 h-8 mt-2" />
                <p className="font-semibold text-navy-900 mt-1">Mr. Ch. Kiran Babu, Asst. Professor</p>
                <p className="text-slate-500 text-[10px]">NRI Institute of Technology (Autonomous)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
