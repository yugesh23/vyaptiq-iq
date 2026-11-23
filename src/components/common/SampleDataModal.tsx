import React from 'react';
import { X, Sparkles, Play, Download, ShoppingBag, Laptop, Apple, ArrowRight } from 'lucide-react';
import { useRetail } from '../../context/RetailContext';

export const SampleDataModal: React.FC = () => {
  const { isSampleModalOpen, setIsSampleModalOpen, loadSampleDataset, setActiveTab } = useRetail();

  if (!isSampleModalOpen) return null;

  const samples: Array<{
    key: 'apparel' | 'electronics' | 'grocery';
    title: string;
    fileName: string;
    icon: React.ReactNode;
    coverage: string;
    summary: string;
    downloadUrl: string;
    features: string[];
  }> = [
    {
      key: 'apparel',
      title: 'Fashion & Apparel Store',
      fileName: 'dataset_1_apparel_store.csv',
      icon: <ShoppingBag className="w-5 h-5 text-teal-brand" />,
      coverage: '1,800 rows • 5 SKUs • 4 Regions (Q1 2026)',
      summary: 'Demonstrates promotional margin leakage on T-Shirts, high-volume Valentine\'s jacket outliers (Row 888), and superior marketing return on Denim.',
      downloadUrl: '/data/dataset_1_apparel_store.csv',
      features: ['Denim Marketing ROI: ₹25.85', 'Jacket Bulk Outliers (Row 888)', 'T-Shirt Promo Margin Leakage']
    },
    {
      key: 'electronics',
      title: 'Consumer Electronics Mart',
      fileName: 'dataset_2_electronics_mart.csv',
      icon: <Laptop className="w-5 h-5 text-blue-600" />,
      coverage: '1,800 rows • 5 SKUs • 4 Regions (Q1 2026)',
      summary: 'Features high ticket transactions, inelastic flagship headphones demand (|e| = 0.12), and smartphone digital ad spend attribution.',
      downloadUrl: '/data/dataset_2_electronics_mart.csv',
      features: ['Inelastic Headphones Pricing', 'Smartphone Ad Attribution', 'Corporate vs Consumer Segments']
    },
    {
      key: 'grocery',
      title: 'Fresh Grocery Superstore',
      fileName: 'dataset_3_grocery_superstore.csv',
      icon: <Apple className="w-5 h-5 text-amber-600" />,
      coverage: '1,800 rows • 5 SKUs • 4 Regions (Q1 2026)',
      summary: 'High volume FMCG transactions with rapid turnover, perishable staple margins, and weekend bundle coupon spikes on protein bars.',
      downloadUrl: '/data/dataset_3_grocery_superstore.csv',
      features: ['High Transaction Velocity', 'FMCG Staple Margins', 'Weekly Promotional Spikes']
    }
  ];

  const handleRun = (key: 'apparel' | 'electronics' | 'grocery') => {
    loadSampleDataset(key);
    setIsSampleModalOpen(false);
    setActiveTab('overview');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#14263A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-brand rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Try Sample Retail Datasets</h2>
              <p className="text-xs text-slate-300">
                Pre-configured retail transaction files running through the identical parser and engine
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSampleModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
            aria-label="Close sample modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {samples.map((s) => (
            <div
              key={s.key}
              className="p-4 rounded-xl border border-slate-200 hover:border-teal-brand/60 bg-slate-50/50 hover:bg-white transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-navy-900">{s.title}</h3>
                    <p className="font-mono text-[11px] text-slate-500">{s.fileName}</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                  {s.coverage}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed">{s.summary}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {s.features.map((f, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-navy-900 font-medium"
                  >
                    • {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <a
                  href={s.downloadUrl}
                  download={s.fileName}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                  title={`Download raw ${s.fileName}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </a>

                <button
                  onClick={() => handleRun(s.key)}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded text-xs font-bold bg-teal-brand hover:bg-teal-hover text-white shadow-2xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Sample Analysis</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={() => setIsSampleModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
