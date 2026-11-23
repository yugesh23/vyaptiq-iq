import React from 'react';
import {
  Menu,
  Upload,
  Sparkles,
  Calendar,
  Database,
  UserCheck,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useRetail } from '../../context/RetailContext';
import { Role } from '../../types/retail';

export const Header: React.FC<{
  onOpenMobileNav: () => void;
}> = ({ onOpenMobileNav }) => {
  const {
    role,
    setRole,
    activeDatasetMeta,
    isSnapshotView,
    setIsUploadModalOpen,
    setIsSampleModalOpen,
    isDemoMode
  } = useRetail();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Nav Toggle & Current Dataset Context */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onOpenMobileNav}
            className="p-1.5 rounded-md text-navy-900 hover:bg-slate-100 lg:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Dataset:
              </span>
              <span className="font-semibold text-sm text-navy-900 truncate">
                {activeDatasetMeta.name}
              </span>
              {isSnapshotView ? (
                <span className="shrink-0 text-[11px] font-medium bg-amber-bg text-amber-flag border border-amber-border px-2 py-0.5 rounded-full">
                  Report Snapshot
                </span>
              ) : (
                <span className="shrink-0 text-[11px] font-medium bg-teal-light text-teal-brand border border-teal-200 px-2 py-0.5 rounded-full">
                  Calculated Run
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {activeDatasetMeta.dateRange.start} – {activeDatasetMeta.dateRange.end}
                </span>
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeDatasetMeta.rowCount.toLocaleString()} rows</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Role Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Action 1: Upload CSV */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-teal-brand hover:bg-teal-hover text-white transition-colors shadow-xs"
            title="Upload a new retail CSV dataset"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload CSV</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Action 2: Try Sample Data */}
          <button
            onClick={() => setIsSampleModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-navy-900 transition-colors shadow-xs"
            title="Select from pre-configured retail datasets"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-brand" />
            <span className="hidden md:inline">Try sample data</span>
            <span className="md:hidden">Samples</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center pl-2 border-l border-slate-200">
            <div className="relative flex items-center">
              <span className="text-xs font-medium text-slate-500 mr-2 hidden sm:inline">
                {isDemoMode ? 'Demo role:' : 'Active role:'}
              </span>
              <select
                value={role}
                onChange={handleRoleChange}
                aria-label="Select active demo role"
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-navy-900 border border-slate-300 rounded-md py-1.5 pl-2.5 pr-7 focus:outline-none focus:ring-2 focus:ring-teal-brand cursor-pointer appearance-none"
              >
                <option value="Business Analyst">Business Analyst</option>
                <option value="Decision Maker">Decision Maker</option>
                <option value="Administrator">Administrator (Extension)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
