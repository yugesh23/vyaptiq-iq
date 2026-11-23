import React, { useState } from 'react';
import {
  TrendingUp,
  Percent,
  Package,
  IndianRupee,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { useRetail } from '../../context/RetailContext';

export const OverviewView: React.FC = () => {
  const {
    kpis,
    anomalies,
    recommendations,
    isSnapshotView,
    activeDatasetMeta,
    setActiveTab,
    selectedSku,
    setSelectedSku,
    selectedRegion,
    setSelectedRegion,
    loadSampleDataset
  } = useRetail();

  const [hoveredOutlier, setHoveredOutlier] = useState<number | null>(null);

  // Top recommendation
  const topRec = recommendations.length > 0 ? recommendations[0] : null;

  // Filtered anomalies (if SKU or region filtered)
  const displayAnomalies = anomalies.filter(a => {
    if (selectedSku !== 'ALL' && a.sku !== selectedSku) return false;
    if (selectedRegion !== 'ALL' && a.region !== selectedRegion) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Projector Notice */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-10 bg-teal-brand rounded-full shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-navy-900">
                {isSnapshotView ? 'Report Snapshot · Apparel Store' : activeDatasetMeta.name}
              </h1>
              {isSnapshotView && (
                <span className="text-[11px] font-semibold bg-amber-bg text-amber-flag border border-amber-border px-2 py-0.5 rounded-full">
                  Published Viva Fixture
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSnapshotView
                ? 'Reproducing published 1,800-row summary with 5 documented outlier transactions (Rows 888, 1126, 1525, 446, 1006).'
                : `Interactive run over ${activeDatasetMeta.rowCount.toLocaleString()} transactions across ${activeDatasetMeta.skus.length} SKUs and ${activeDatasetMeta.regions.length} regions.`}
            </p>
          </div>
        </div>

        {/* Filters & Interactive Toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          {isSnapshotView ? (
            <button
              onClick={() => loadSampleDataset('apparel')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-teal-light text-teal-brand border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <span>Run interactive sample</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="bg-transparent text-navy-900 font-semibold focus:outline-none cursor-pointer"
                  aria-label="Filter by SKU"
                >
                  <option value="ALL">All SKUs ({activeDatasetMeta.skus.length})</option>
                  {activeDatasetMeta.skus.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent text-navy-900 font-semibold focus:outline-none cursor-pointer"
                  aria-label="Filter by Region"
                >
                  <option value="ALL">All Regions ({activeDatasetMeta.regions.length})</option>
                  {activeDatasetMeta.regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Four Primary Headline Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Revenue</span>
            <IndianRupee className="w-4 h-4 text-teal-brand" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-navy-900 tracking-tight">
            ₹{kpis.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-2">
            <span className="font-semibold text-teal-brand">100%</span>
            <span>of agreed transaction volume</span>
          </div>
        </div>

        {/* Metric 2: Gross Margin (₹) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Gross Margin (₹)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700 tracking-tight">
            ₹{kpis.totalMargin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-2">
            <span>Revenue − COGS (units × unit cost)</span>
          </div>
        </div>

        {/* Metric 3: Gross Margin % */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Gross Margin %</span>
            <Percent className="w-4 h-4 text-teal-brand" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-navy-900 tracking-tight">
            {kpis.marginPct.toFixed(2)}%
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-2">
            <span className="font-semibold text-slate-700">Weighted aggregate</span>
            <span>(not row average)</span>
          </div>
        </div>

        {/* Metric 4: Total Units */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Units Sold</span>
            <Package className="w-4 h-4 text-navy-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-navy-900 tracking-tight">
            {kpis.totalUnits.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-2">
            <span>Across {kpis.uniqueSkus} distinct SKUs</span>
          </div>
        </div>
      </div>

      {/* Supporting Strip: Promo Rate & ARPU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded">
              <Percent className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-navy-900">Promotion Rate: </span>
              <span className="font-mono font-bold text-amber-900">{kpis.promoRate.toFixed(1)}%</span>
            </div>
          </div>
          <span className="text-slate-500 text-[11px]">
            Field coverage: {kpis.promoRateCoverage.toFixed(0)}% of valid rows
          </span>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 bg-teal-100 text-teal-800 rounded">
              <IndianRupee className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-navy-900">ARPU: </span>
              <span className="font-mono font-bold text-teal-900">
                {kpis.arpu !== null ? `₹${kpis.arpu.toFixed(2)}` : 'Unavailable — customer ID needed'}
              </span>
            </div>
          </div>
          <span className="text-slate-500 text-[11px] truncate max-w-[200px]" title={kpis.arpuDenominator}>
            Denominator: {kpis.arpuDenominator}
          </span>
        </div>
      </div>

      {/* Analysis Section: Wide Analysis Panel + Narrower Recommendation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wide Analysis Panel (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Retail Evidence Center: Statistical Anomaly Spotlight</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Population Z-Score (|z| ≥ 3.0σ) Outlier Distribution
              </p>
            </div>
            <button
              onClick={() => setActiveTab('anomalies')}
              className="text-xs font-semibold text-teal-brand hover:text-teal-hover flex items-center space-x-1"
            >
              <span>View all anomalies</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Outlier Dot Plot Visualization */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-slate-700">
                Transaction Revenue Distribution (Mean: ₹{kpis.totalRevenue > 0 ? (kpis.totalRevenue / kpis.rowCount).toFixed(0) : '27,968'})
              </span>
              <span className="font-mono text-[11px] text-amber-flag font-semibold">
                5 Critical Outliers Flagged (|z| ≥ 3.3σ)
              </span>
            </div>

            {/* Visual Dot Plot Scale */}
            <div className="relative h-28 bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
              {/* Reference Baseline Lines */}
              <div className="absolute inset-y-0 left-[25%] border-r border-dashed border-slate-300 pointer-events-none">
                <span className="absolute top-1 left-1 text-[9px] font-mono text-slate-400">Mean ₹27.9K</span>
              </div>
              <div className="absolute inset-y-0 left-[55%] border-r border-dashed border-amber-300 pointer-events-none">
                <span className="absolute top-1 left-1 text-[9px] font-mono text-amber-600">+2.0σ Threshold</span>
              </div>
              <div className="absolute inset-y-0 left-[75%] border-r border-dashed border-amber-500 pointer-events-none">
                <span className="absolute top-1 left-1 text-[9px] font-mono text-amber-700 font-bold">+3.0σ Alert Boundary</span>
              </div>

              {/* Data Points Plot */}
              <div className="relative h-12 flex items-center my-auto">
                {/* Cluster of normal records */}
                <div className="absolute left-[10%] w-[35%] h-3 bg-teal-brand/20 rounded-full" title="Normal transaction cluster (₹10,000 – ₹45,000)" />
                <div className="absolute left-[25%] w-3 h-3 bg-teal-brand rounded-full -translate-y-0 shadow-xs" title="Median transaction point" />

                {/* The 5 Outlier Points */}
                {anomalies.slice(0, 5).map((outlier, idx) => {
                  // Map ₹94,248 to ~78%, ₹107,100 to ~92%
                  const leftPos = 78 + (outlier.revenue - 94248) / (107100 - 94248) * 16;
                  const isRow888 = outlier.rowId === 888;
                  const isHovered = hoveredOutlier === outlier.rowId;

                  return (
                    <div
                      key={outlier.rowId}
                      onMouseEnter={() => setHoveredOutlier(outlier.rowId)}
                      onMouseLeave={() => setHoveredOutlier(null)}
                      onClick={() => setActiveTab('anomalies')}
                      className={`absolute -translate-x-1/2 cursor-pointer transition-all ${
                        isRow888 ? 'z-20' : 'z-10'
                      }`}
                      style={{ left: `${Math.min(leftPos, 96)}%` }}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] text-white shadow-md transition-transform ${
                          isRow888
                            ? 'bg-amber-600 ring-4 ring-amber-200 scale-110 animate-bounce'
                            : 'bg-amber-500 ring-2 ring-white hover:scale-125'
                        }`}
                      >
                        {isRow888 ? '★' : idx + 1}
                      </div>

                      {/* Tooltip on hover or row 888 permanent callout */}
                      {(isHovered || isRow888) && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-[10px] p-2 rounded shadow-lg whitespace-nowrap pointer-events-none z-30">
                          <p className="font-bold">Row {outlier.rowId}: ₹{outlier.revenue.toLocaleString()} (z = +{outlier.zScore})</p>
                          <p className="text-slate-300 font-mono">{outlier.units} units @ ₹{outlier.price} • {outlier.region}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Scale Label */}
              <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1">
                <span>₹0</span>
                <span>₹30,000</span>
                <span>₹60,000</span>
                <span>₹90,000</span>
                <span className="font-bold text-amber-700">₹107,100 (Row 888 Max)</span>
              </div>
            </div>

            {/* Featured Row 888 Deep-Dive Card */}
            <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-mono font-bold text-xs">
                  Row 888 Spotlight
                </span>
                <span className="text-xs text-navy-900 font-semibold">
                  50 units × ₹2,142 = ₹107,100 (Apparel_Jacket)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  z = +3.94σ
                </span>
                <span className="text-slate-500 text-[11px]">West Region • 2026-02-14</span>
              </div>
            </div>
          </div>

          {/* SKU Performance Table Preview */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                SKU Revenue & Margin Contribution
              </h3>
              <span className="text-[11px] text-slate-500">Sorted by Total Revenue</span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-navy-900 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">SKU</th>
                    <th className="p-2.5 text-right">Revenue</th>
                    <th className="p-2.5 text-right">Units</th>
                    <th className="p-2.5 text-right">Gross Margin</th>
                    <th className="p-2.5 text-right">Margin %</th>
                    <th className="p-2.5 text-right">Rev / ₹1 Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {kpis.skuBreakdown.map((s) => (
                    <tr key={s.sku} className="hover:bg-slate-50 font-mono">
                      <td className="p-2.5 font-sans font-semibold text-navy-900">{s.sku}</td>
                      <td className="p-2.5 text-right">₹{s.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="p-2.5 text-right">{s.units.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-emerald-700">₹{s.margin.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="p-2.5 text-right font-bold">{s.marginPct.toFixed(1)}%</td>
                      <td className="p-2.5 text-right text-teal-brand font-bold">
                        {s.revenuePerSpend !== null ? `₹${s.revenuePerSpend.toFixed(2)}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Narrower Recommended Action Panel (1 col) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-teal-brand" />
                <span>Top Recommended Action</span>
              </h2>
              <span className="text-[11px] font-bold bg-teal-light text-teal-brand px-2 py-0.5 rounded-full">
                Rank #1
              </span>
            </div>

            {topRec ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-brand">{topRec.id}</span>
                    <span className="text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                      {topRec.priorityCategory}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-navy-900 mt-1">
                    {topRec.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {topRec.suggestedAction}
                  </p>
                </div>

                {/* Evidence Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                  <div className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                    Inspectable Rule Evidence
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Revenue per ₹1 Spend:</span>
                    <span className="font-mono font-bold text-teal-brand">
                      {topRec.revenuePerSpend ? `₹${topRec.revenuePerSpend.toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Current Margin %:</span>
                    <span className="font-mono font-bold text-navy-900">
                      {topRec.inputFigures.skuMarginPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Projected Margin Gain:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      +{topRec.projectedMarginChangePct}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">Evaluation Score:</span>
                    <span className="font-mono font-bold text-navy-900">
                      {topRec.priorityScore.toFixed(2)} / 10.0
                    </span>
                  </div>
                </div>

                {/* Decision Status Pill */}
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Current Lifecycle:</span>
                  <span className="font-bold text-navy-900 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>{topRec.currentStatus}</span>
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active recommendation evaluated.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setActiveTab('recommendations')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <span>Inspect All 3 Rule Baselines</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('decisions')}
              className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-semibold transition-colors"
            >
              <span>Record Decision / Manager Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Five Documented Outliers Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
              <span>Documented High-Revenue Outlier Records (Evidence Table)</span>
              <span className="text-xs font-normal text-slate-500">({displayAnomalies.length} transactions)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified by standard deviation z-score (|z| ≥ 3.0σ). Row IDs preserved from original data ingestion.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 self-start sm:self-auto">
            Threshold: Population ddof=0 |z| ≥ 3.0
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-navy-900 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Row ID</th>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">SKU Code</th>
                <th className="p-2.5">Region</th>
                <th className="p-2.5 text-right">Units</th>
                <th className="p-2.5 text-right">Unit Price</th>
                <th className="p-2.5 text-right">Revenue</th>
                <th className="p-2.5 text-right">Reported Z</th>
                <th className="p-2.5">Arithmetic Evidence Formula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayAnomalies.slice(0, 5).map((row) => {
                const isLeader = row.rowId === 888;
                return (
                  <tr
                    key={row.rowId}
                    className={`hover:bg-slate-50 font-mono transition-colors ${
                      isLeader ? 'bg-amber-50/50 font-semibold' : ''
                    }`}
                  >
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isLeader ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-800'
                      }`}>
                        #{row.rowId}
                      </span>
                    </td>
                    <td className="p-2.5">{row.date}</td>
                    <td className="p-2.5 font-sans text-navy-900 font-semibold">{row.sku}</td>
                    <td className="p-2.5">{row.region}</td>
                    <td className="p-2.5 text-right font-bold">{row.units}</td>
                    <td className="p-2.5 text-right">₹{row.price.toLocaleString('en-IN')}</td>
                    <td className="p-2.5 text-right font-bold text-navy-900">
                      ₹{row.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2.5 text-right">
                      <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                        +{row.zScore.toFixed(2)}σ
                      </span>
                    </td>
                    <td className="p-2.5 font-sans text-slate-700">
                      <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {row.arithmeticFormula}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
