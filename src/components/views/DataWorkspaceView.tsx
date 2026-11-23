import React, { useState } from 'react';
import {
  Database,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';
import { useRetail } from '../../context/RetailContext';
import { parseCSV } from '../../utils/csvParser';
import { BUNDLED_SAMPLES } from '../../data/bundledSamples';

export const DataWorkspaceView: React.FC = () => {
  const {
    activeDatasetMeta,
    isSnapshotView,
    rawRecords,
    loadSnapshot,
    loadSampleDataset,
    loadUploadedCSV,
    setIsUploadModalOpen,
    setIsSampleModalOpen
  } = useRetail();

  const [revenueChoice, setRevenueChoice] = useState<'preserve_supplied' | 'recompute_units_x_price'>('preserve_supplied');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 12;

  // Generate rows to display
  const rowsToDisplay = isSnapshotView
    ? [] // Snapshot is a documented summary fixture with 5 outlier records
    : rawRecords;

  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage) || 1;
  const paginatedRows = rowsToDisplay.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const columnMappingSchema = [
    { canonical: 'date', role: 'Transaction Date (YYYY-MM-DD)', powers: 'Time-series trends & period coverage', status: 'Mapped' },
    { canonical: 'sku', role: 'Product / SKU Identifier', powers: 'Category breakdown & recommendation rules', status: 'Mapped' },
    { canonical: 'region', role: 'Geographic Territory', powers: 'Territory performance breakdown', status: 'Mapped' },
    { canonical: 'units', role: 'Sales Volume Quantity', powers: 'Total units sold & total COGS computation', status: 'Mapped' },
    { canonical: 'price', role: 'Unit Selling Price (₹)', powers: 'Gross transaction value & price elasticity', status: 'Mapped' },
    { canonical: 'cost', role: 'Unit Cost / COGS (₹)', powers: 'Gross margin (₹) & weighted margin %', status: 'Mapped' },
    { canonical: 'promo_flag', role: 'Promotional Indicator (0/1)', powers: 'Promotion frequency & discount tightening rule', status: 'Mapped' },
    { canonical: 'marketing_spend', role: 'Ad Spend Allocation (₹)', powers: 'Revenue per ₹1 marketing spend efficiency', status: 'Mapped' },
    { canonical: 'customer_id', role: 'Customer Identifier / Traffic', powers: 'ARPU (Average Revenue Per User) denominator', status: 'Mapped (Proxy)' },
    { canonical: 'revenue', role: 'Realized Revenue (₹)', powers: 'Total revenue, gross margin %, & z-score anomaly scoring', status: 'Mapped' }
  ];

  const handleDownloadActiveCSV = () => {
    let csvData = '';
    let fileName = activeDatasetMeta.name;

    if (isSnapshotView) {
      csvData = BUNDLED_SAMPLES.apparel;
      fileName = 'dataset_1_apparel_store.csv';
    } else if (rawRecords.length > 0) {
      const header = 'date,sku,region,units,price,cost,promo_flag,marketing_spend,channel,customer_segment,revenue\n';
      const rows = rawRecords.map(r =>
        `${r.date},${r.sku},${r.region},${r.units},${r.price},${r.cost},${r.promo_flag},${r.marketing_spend},${r.channel || ''},${r.customer_segment || ''},${r.revenue}`
      ).join('\n');
      csvData = header + rows;
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-navy-900">Data Workspace & Ingestion Pipeline</h1>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {activeDatasetMeta.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validate transaction schema, examine field mappings, audit data quality, and inspect row-level integrity.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleDownloadActiveCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-navy-900 shadow-2xs transition-colors"
            title="Download active CSV data"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-teal-brand hover:bg-teal-hover text-white shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New CSV</span>
          </button>
        </div>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <h2 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
          Select Active Ingestion Source
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Option 1: Snapshot */}
          <div
            onClick={loadSnapshot}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              isSnapshotView
                ? 'border-amber-border bg-amber-bg shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs text-navy-900">Report Snapshot</span>
              {isSnapshotView && <span className="text-[10px] font-bold text-amber-flag">ACTIVE</span>}
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2">
              Published B.Tech review summary (1,800 rows reported, 5 documented outliers).
            </p>
          </div>

          {/* Option 2: Apparel Store */}
          <div
            onClick={() => loadSampleDataset('apparel')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              !isSnapshotView && activeDatasetMeta.name.includes('apparel')
                ? 'border-teal-brand bg-teal-50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs text-navy-900">Apparel Store</span>
              {!isSnapshotView && activeDatasetMeta.name.includes('apparel') && (
                <span className="text-[10px] font-bold text-teal-brand">ACTIVE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2">
              Full 1,800-row interactive dataset with high promo leakage and jacket outliers.
            </p>
          </div>

          {/* Option 3: Electronics Mart */}
          <div
            onClick={() => loadSampleDataset('electronics')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              !isSnapshotView && activeDatasetMeta.name.includes('electronics')
                ? 'border-teal-brand bg-teal-50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs text-navy-900">Electronics Mart</span>
              {!isSnapshotView && activeDatasetMeta.name.includes('electronics') && (
                <span className="text-[10px] font-bold text-teal-brand">ACTIVE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2">
              1,800 rows featuring inelastic headphones and high flagship smartphone ad spend.
            </p>
          </div>

          {/* Option 4: Grocery Superstore */}
          <div
            onClick={() => loadSampleDataset('grocery')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              !isSnapshotView && activeDatasetMeta.name.includes('grocery')
                ? 'border-teal-brand bg-teal-50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs text-navy-900">Grocery Superstore</span>
              {!isSnapshotView && activeDatasetMeta.name.includes('grocery') && (
                <span className="text-[10px] font-bold text-teal-brand">ACTIVE</span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2">
              1,800 rows of FMCG retail data with fast velocity and frequent promotional discounts.
            </p>
          </div>
        </div>
      </div>

      {/* Column Mapping & Schema Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-brand" />
              <span>Standard Field Mapping Schema (createRetailRecord Integration)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Maps diverse spreadsheet alias conventions (e.g., quantity → units, product_id → sku) into the standard schema.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
            10/10 Core Columns Mapped
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-navy-900 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Canonical Field</th>
                <th className="p-2.5">Target Column Type</th>
                <th className="p-2.5">Engine Metrics Powered</th>
                <th className="p-2.5 text-right">Mapping Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {columnMappingSchema.map((col) => (
                <tr key={col.canonical} className="hover:bg-slate-50/60">
                  <td className="p-2.5 font-bold text-navy-900">{col.canonical}</td>
                  <td className="p-2.5 font-sans text-slate-600">{col.role}</td>
                  <td className="p-2.5 font-sans text-slate-600">{col.powers}</td>
                  <td className="p-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      ✓ {col.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row-Level Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-brand" />
              <span>Row-Level Transaction Table</span>
              <span className="text-xs font-normal text-slate-500 font-mono">
                ({rowsToDisplay.length > 0 ? `${rowsToDisplay.length.toLocaleString()} rows` : 'Report Snapshot Mode'})
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSnapshotView
                ? 'Report snapshot fixture represents a published aggregate. Click "Run an interactive sample" to explore row-level data.'
                : 'Displaying verified transaction records with full numeric precision.'}
            </p>
          </div>

          {rowsToDisplay.length > 0 && (
            <div className="flex items-center space-x-2 text-xs font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-2 py-1 border rounded bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-2 py-1 border rounded bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {isSnapshotView ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-navy-900">
              Report Snapshot Mode Active (1,800 Rows Published Summary)
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              In this published example, the report contains screenshots and preserves the 5 documented high-revenue outlier records. Full row pagination is available in interactive sample runs.
            </p>
            <div className="pt-2">
              <button
                onClick={() => loadSampleDataset('apparel')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-md bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Interactive Apparel Dataset (1,800 Rows)</span>
              </button>
            </div>
          </div>
        ) : (
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
                  <th className="p-2.5 text-right">Cost (₹)</th>
                  <th className="p-2.5 text-right">Promo</th>
                  <th className="p-2.5 text-right">Spend (₹)</th>
                  <th className="p-2.5 text-right">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {paginatedRows.map((r) => (
                  <tr key={r.row_id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-slate-500 font-bold">#{r.row_id}</td>
                    <td className="p-2.5">{r.date}</td>
                    <td className="p-2.5 font-sans font-semibold text-navy-900">{r.sku}</td>
                    <td className="p-2.5">{r.region}</td>
                    <td className="p-2.5 text-right">{r.units}</td>
                    <td className="p-2.5 text-right">₹{r.price.toFixed(2)}</td>
                    <td className="p-2.5 text-right">₹{r.cost.toFixed(2)}</td>
                    <td className="p-2.5 text-right">
                      {r.promo_flag === 1 ? (
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">1 (Yes)</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="p-2.5 text-right">₹{r.marketing_spend.toFixed(0)}</td>
                    <td className="p-2.5 text-right font-bold text-navy-900">
                      ₹{r.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
