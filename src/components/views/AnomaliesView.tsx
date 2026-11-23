import React, { useState } from 'react';
import {
  AlertTriangle,
  Info,
  Sliders,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useRetail } from '../../context/RetailContext';
import { AnomalyRecord } from '../../types/retail';

export const AnomaliesView: React.FC = () => {
  const { anomalies, kpis, isSnapshotView, activeDatasetMeta, setActiveTab } = useRetail();

  const [zThreshold, setZThreshold] = useState<number>(3.0);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(
    anomalies.length > 0 ? anomalies[0] : null
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Baseline statistics
  const baselineCount = kpis.rowCount || 1800;
  const baselineMean = kpis.totalRevenue > 0 ? kpis.totalRevenue / baselineCount : 27968.09;
  const baselineStd = 20108.29; // Population ddof=0 std dev

  // Filtered by threshold & search
  const filteredAnomalies = anomalies.filter(a => {
    if (Math.abs(a.zScore) < zThreshold) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        a.sku.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.rowId.toString().includes(q) ||
        a.date.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-navy-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Statistical Anomaly Detection (Population Z-Score)</span>
            </h1>
            <span className="font-mono text-xs bg-amber-bg text-amber-flag border border-amber-border px-2.5 py-0.5 rounded-full font-bold">
              {filteredAnomalies.length} Outliers Detected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detect unusual transaction volumes using population standard deviation (ddof=0). Default threshold: |z| ≥ 3.0σ.
          </p>
        </div>

        {/* Threshold Adjustment Controls */}
        <div className="flex items-center space-x-3 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
          <span className="text-slate-600 font-semibold flex items-center space-x-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Sigma Threshold (|z| ≥):</span>
          </span>
          <div className="flex space-x-1">
            {[2.5, 3.0, 3.3, 3.5].map((val) => (
              <button
                key={val}
                onClick={() => setZThreshold(val)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  zThreshold === val
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {val}σ
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Baseline Statistical Population Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <p className="text-slate-500 text-xs font-medium">Population Scope</p>
          <p className="text-xl font-bold font-mono text-navy-900 mt-1">
            {baselineCount.toLocaleString()} Rows
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Full validated dataset</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <p className="text-slate-500 text-xs font-medium">Mean Transaction Revenue (μ)</p>
          <p className="text-xl font-bold font-mono text-navy-900 mt-1">
            ₹{baselineMean.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Population expected value</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <p className="text-slate-500 text-xs font-medium">Standard Deviation (σ)</p>
          <p className="text-xl font-bold font-mono text-navy-900 mt-1">
            ₹{baselineStd.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Population dispersion (ddof=0)</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <p className="text-slate-500 text-xs font-medium">Current Alert Cutoff</p>
          <p className="text-xl font-bold font-mono text-amber-700 mt-1">
            ₹{(baselineMean + zThreshold * baselineStd).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">≥ +{zThreshold}σ revenue boundary</p>
        </div>
      </div>

      {/* Row 888 Investigation Feature Spotlight Card */}
      <div className="bg-amber-bg border-2 border-amber-border rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-1 rounded bg-amber-600 text-white font-mono font-bold text-xs shadow-2xs">
              ROW 888 CASE STUDY
            </span>
            <span className="font-bold text-sm text-navy-900">
              Valentine's Weekend Apparel_Jacket Surge (₹107,100)
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded self-start sm:self-auto">
            Reported Z = +3.94σ (Extreme Statistical Outlier)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/80 p-3.5 rounded-lg border border-amber-200 space-y-1">
            <span className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">
              Transaction Arithmetic
            </span>
            <p className="font-mono font-bold text-sm text-navy-900">
              50 units × ₹2,142 = ₹107,100
            </p>
            <p className="text-slate-500 text-[11px]">
              Unit Cost: ₹2,100.00 • Total Margin: ₹2,100 (1.96% margin)
            </p>
          </div>

          <div className="bg-white/80 p-3.5 rounded-lg border border-amber-200 space-y-1">
            <span className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">
              Statistical Context
            </span>
            <p className="font-mono text-slate-800 font-semibold">
              z = (107,100 − 27,968) / 20,108 = <span className="text-amber-700 font-bold">+3.94</span>
            </p>
            <p className="text-slate-500 text-[11px]">
              Deviation: +₹79,132 above dataset mean revenue
            </p>
          </div>

          <div className="bg-white/80 p-3.5 rounded-lg border border-amber-200 space-y-1">
            <span className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">
              Analytical Signal Interpretation
            </span>
            <p className="text-slate-700 leading-snug">
              <strong>Investigation Signal:</strong> High quantity purchase (50 units) at heavily discounted rate. Cause remains open: potential institutional B2B bulk buy or price leakage.
            </p>
          </div>
        </div>
      </div>

      {/* Dot Plot Visualization of Outliers */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-sm text-navy-900">
              Interactive Revenue Outlier Dot Plot (1D Scatter)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any flagged transaction dot to inspect row-level particulars.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">X-Axis: Revenue in Rupees (₹)</span>
        </div>

        {/* Visual Axis Container */}
        <div className="relative h-32 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between select-none">
          {/* Reference Lines */}
          <div className="absolute inset-y-0 left-[26%] border-r border-dashed border-slate-300 pointer-events-none">
            <span className="absolute top-1 left-1 text-[9px] font-mono text-slate-500">Mean ₹27.9K</span>
          </div>
          <div className="absolute inset-y-0 left-[55%] border-r border-dashed border-amber-400 pointer-events-none">
            <span className="absolute top-1 left-1 text-[9px] font-mono text-amber-600 font-semibold">+2.0σ (₹68.1K)</span>
          </div>
          <div className="absolute inset-y-0 left-[75%] border-r-2 border-dashed border-amber-600 pointer-events-none">
            <span className="absolute top-1 left-1 text-[9px] font-mono text-amber-700 font-bold">+3.0σ (₹88.2K Alert)</span>
          </div>

          {/* Scatter Points Area */}
          <div className="relative h-14 flex items-center">
            {/* Background Cluster */}
            <div className="absolute left-[8%] w-[42%] h-4 bg-teal-brand/20 rounded-full" title="Normal transaction cluster" />
            
            {/* The 5 Key Outliers */}
            {anomalies.map((item, idx) => {
              const leftPos = 78 + (item.revenue - 94248) / (107100 - 94248) * 16;
              const isSelected = selectedAnomaly?.rowId === item.rowId;
              const isRow888 = item.rowId === 888;

              return (
                <div
                  key={item.rowId}
                  onClick={() => setSelectedAnomaly(item)}
                  className="absolute -translate-x-1/2 cursor-pointer transition-all z-10"
                  style={{ left: `${Math.min(leftPos, 96)}%` }}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs text-white shadow-md transition-all ${
                      isSelected
                        ? 'bg-navy-900 ring-4 ring-teal-brand scale-125 z-20'
                        : isRow888
                        ? 'bg-amber-600 ring-2 ring-white hover:scale-110'
                        : 'bg-amber-500 ring-1 ring-white hover:scale-110'
                    }`}
                  >
                    #{item.rowId}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Scale */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-1">
            <span>₹0</span>
            <span>₹25,000</span>
            <span>₹50,000</span>
            <span>₹75,000</span>
            <span className="font-bold text-amber-800">₹100,000+</span>
          </div>
        </div>

        {/* Selected Anomaly Drill-Down Drawer */}
        {selectedAnomaly && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-navy-900 font-mono text-sm">
                  Row #{selectedAnomaly.rowId} Details:
                </span>
                <span className="font-semibold text-teal-brand">{selectedAnomaly.sku}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{selectedAnomaly.region} Region</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{selectedAnomaly.date}</span>
              </div>
              <p className="text-slate-600">
                Formula: <span className="font-mono font-bold text-navy-900">{selectedAnomaly.arithmeticFormula}</span> | Z-Score: <span className="font-mono font-bold text-amber-700">+{selectedAnomaly.zScore.toFixed(2)}σ</span>
              </p>
              <p className="text-slate-500 text-[11px]">{selectedAnomaly.investigationSignal}</p>
            </div>

            <button
              onClick={() => setActiveTab('recommendations')}
              className="px-3.5 py-1.5 rounded bg-teal-brand hover:bg-teal-hover text-white font-bold text-xs shadow-2xs transition-colors self-start md:self-auto shrink-0"
            >
              Examine Recommended Rule
            </button>
          </div>
        )}
      </div>

      {/* Flagged Outlier Records Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-sm text-navy-900">
              Ranked Outlier Records (|z| ≥ {zThreshold}σ)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preserving original row IDs and exact calculated z-scores for auditability.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by row, SKU or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-brand font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-navy-900 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Row ID</th>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">SKU</th>
                <th className="p-2.5">Region</th>
                <th className="p-2.5 text-right">Units</th>
                <th className="p-2.5 text-right">Price (₹)</th>
                <th className="p-2.5 text-right">Revenue (₹)</th>
                <th className="p-2.5 text-right">Z-Score</th>
                <th className="p-2.5">Evidence & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {filteredAnomalies.map((row) => (
                <tr
                  key={row.rowId}
                  onClick={() => setSelectedAnomaly(row)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedAnomaly?.rowId === row.rowId ? 'bg-teal-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="p-2.5 font-bold text-navy-900">#{row.rowId}</td>
                  <td className="p-2.5">{row.date}</td>
                  <td className="p-2.5 font-sans font-semibold text-navy-900">{row.sku}</td>
                  <td className="p-2.5">{row.region}</td>
                  <td className="p-2.5 text-right">{row.units}</td>
                  <td className="p-2.5 text-right">₹{row.price.toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-right font-bold text-navy-900">
                    ₹{row.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-right">
                    <span className="px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                      +{row.zScore.toFixed(2)}σ
                    </span>
                  </td>
                  <td className="p-2.5 font-sans text-slate-600 max-w-xs truncate" title={row.investigationSignal}>
                    {row.investigationSignal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
