import React from 'react';
import {
  LayoutDashboard,
  Database,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  FileText,
  Clock,
  GraduationCap,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';
import { useRetail, TabDestination } from '../../context/RetailContext';

export const NavigationRail: React.FC<{
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    setIsGuideOpen,
    setIsArchitectureOpen,
    resetDemoData,
    isSnapshotView
  } = useRetail();

  const navItems: Array<{ id: TabDestination; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'workspace', label: 'Data Workspace', icon: <Database className="w-5 h-5" /> },
    { id: 'anomalies', label: 'Anomalies', icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, badge: '5 Outliers' },
    { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="w-5 h-5 text-teal-300" />, badge: '3 Rules' },
    { id: 'decisions', label: 'Decisions', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
  ];

  const handleNavClick = (tab: TabDestination) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between bg-[#14263A] text-white w-64 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-navy-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-brand flex items-center justify-center font-bold text-white text-lg shadow-inner">
              VQ
            </div>
            <div>
              <div className="font-bold text-base tracking-tight flex items-center gap-1.5">
                Vyaptiq IQ
                <span className="text-[10px] font-semibold bg-teal-800/80 text-teal-200 px-1.5 py-0.5 rounded">v2.1</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Retail Revenue Intelligence</p>
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white lg:hidden"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current Mode Badge */}
        <div className="px-5 py-2.5 bg-navy-800/60 border-b border-navy-800 flex items-center justify-between text-xs">
          <span className="text-slate-300">Mode</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            Review Demo
          </span>
        </div>

        {/* Navigation Destinations */}
        <nav className="p-3 space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-brand text-white shadow-sm'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-teal-900 text-teal-100'
                        : 'bg-navy-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Review & Project Controls Footer */}
      <div className="p-3 border-t border-navy-800 space-y-2 bg-[#101F30]">
        {/* 3-Minute Presentation Pitch Button */}
        <button
          onClick={() => setIsGuideOpen(true)}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-sm"
          title="Open the 3-minute projector review pitch guide"
        >
          <Clock className="w-4 h-4" />
          <span>3-Min Projector Guide</span>
        </button>

        {/* Academic Attribution & Architecture */}
        <button
          onClick={() => setIsArchitectureOpen(true)}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-xs font-medium bg-navy-800 hover:bg-navy-700 text-slate-200 transition-colors"
          title="View NRI Institute of Technology B.Tech project details and system architecture"
        >
          <GraduationCap className="w-4 h-4 text-teal-300" />
          <span>About / NRIIT B.Tech</span>
        </button>

        {/* Reset Demo */}
        <button
          onClick={() => {
            if (confirm('Reset demo state to initial report snapshot? This clears local decision history.')) {
              resetDemoData();
            }
          }}
          className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset local storage and restore snapshot view"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navigation Rail */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 z-30 shadow-md">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-navy-900/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
};
