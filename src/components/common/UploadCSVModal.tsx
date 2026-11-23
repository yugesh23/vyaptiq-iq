import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Table } from 'lucide-react';
import { useRetail } from '../../context/RetailContext';
import { parseCSV } from '../../utils/csvParser';

export const UploadCSVModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, loadUploadedCSV, setActiveTab } = useRetail();
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [revenueInterp, setRevenueInterp] = useState<'preserve_supplied' | 'recompute_units_x_price'>('preserve_supplied');
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [discrepancyCount, setDiscrepancyCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleFileContent = (name: string, content: string) => {
    try {
      setFileText(content);
      const parsed = parseCSV(content, { revenueInterpretation: revenueInterp });
      if (parsed.validationErrors.length > 0 && parsed.records.length === 0) {
        setErrorMsg(parsed.validationErrors[0].reason);
        return;
      }
      setErrorMsg('');
      setDiscrepancyCount(parsed.discrepancies.length);

      // Extract first 5 lines for preview
      const lines = content.trim().split(/\r?\n/).slice(0, 6);
      if (lines.length > 0) {
        const h = lines[0].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        setHeaders(h);
        const rows = lines.slice(1).map(l => l.split(',').map(s => s.trim().replace(/^"|"$/g, '')));
        setPreviewRows(rows);
      }
    } catch (e: any) {
      setErrorMsg('Failed to read CSV: ' + (e.message || String(e)));
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (evt) => {
        handleFileContent(f.name, evt.target?.result as string);
      };
      reader.readAsText(f);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (evt) => {
        handleFileContent(f.name, evt.target?.result as string);
      };
      reader.readAsText(f);
    }
  };

  const handleExecuteAnalysis = () => {
    if (!fileText) return;
    loadUploadedCSV(file ? file.name : 'uploaded_transactions.csv', fileText, revenueInterp);
    setIsUploadModalOpen(false);
    setActiveTab('overview');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#14263A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-brand rounded-lg text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Upload Retail Transaction CSV</h2>
              <p className="text-xs text-slate-300">
                Automated field mapping, type validation & discrepancy resolution
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
            aria-label="Close upload modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-teal-brand bg-teal-50'
                : 'border-slate-300 hover:border-teal-brand hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".csv,text/csv"
              className="hidden"
            />
            <div className="w-12 h-12 bg-teal-50 text-teal-brand rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-navy-900">
              {file ? file.name : 'Click to browse or drag and drop your CSV file'}
            </p>
            <p className="text-slate-500 mt-1">
              Supports date, sku, region, units, price, cost, promo_flag, spend, channel, customer_id
            </p>
            {file && (
              <span className="inline-block mt-2 font-mono text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Revenue Discrepancy Policy Selector */}
          {discrepancyCount > 0 && (
            <div className="p-4 bg-amber-bg border border-amber-border rounded-lg space-y-2">
              <div className="flex items-center space-x-2 text-amber-flag font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Deliberate Choice Required: {discrepancyCount.toLocaleString()} rows have supplied revenue ≠ units × price
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                In retail data, realized revenue often accounts for customer coupons or trade discounts. Select your preferred accounting interpretation:
              </p>
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="revChoice"
                    value="preserve_supplied"
                    checked={revenueInterp === 'preserve_supplied'}
                    onChange={() => setRevenueInterp('preserve_supplied')}
                    className="text-teal-brand focus:ring-teal-brand"
                  />
                  <span>Preserve supplied revenue (reflects actual realized revenue post-discounts)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="revChoice"
                    value="recompute_units_x_price"
                    checked={revenueInterp === 'recompute_units_x_price'}
                    onChange={() => setRevenueInterp('recompute_units_x_price')}
                    className="text-teal-brand focus:ring-teal-brand"
                  />
                  <span>Recompute as units × price (gross list price before line-item discounts)</span>
                </label>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {previewRows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-navy-900 flex items-center space-x-1.5">
                  <Table className="w-4 h-4 text-teal-brand" />
                  <span>Data Ingestion Preview (First 5 Rows)</span>
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {headers.length} columns detected
                </span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-md">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-100 text-navy-900 font-bold border-b border-slate-200">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="p-2 border-r last:border-r-0 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {previewRows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-slate-50 font-mono">
                        {row.map((cell, ci) => (
                          <td key={ci} className="p-2 border-r last:border-r-0 whitespace-nowrap truncate max-w-[120px]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-navy-900 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteAnalysis}
            disabled={!fileText || !!errorMsg}
            className="flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-md bg-teal-brand hover:bg-teal-hover text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <span>Run Automated Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
