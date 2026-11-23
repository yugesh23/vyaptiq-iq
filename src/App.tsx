import React, { useState } from 'react';
import { RetailProvider, useRetail } from './context/RetailContext';
import { NavigationRail } from './components/layout/NavigationRail';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/views/OverviewView';
import { DataWorkspaceView } from './components/views/DataWorkspaceView';
import { AnomaliesView } from './components/views/AnomaliesView';
import { RecommendationsView } from './components/views/RecommendationsView';
import { DecisionsView } from './components/views/DecisionsView';
import { ReportsView } from './components/views/ReportsView';
import { ThreeMinuteReviewGuide } from './components/common/ThreeMinuteReviewGuide';
import { AcademicProjectModal } from './components/common/AcademicProjectModal';
import { UploadCSVModal } from './components/common/UploadCSVModal';
import { SampleDataModal } from './components/common/SampleDataModal';
import { VerificationAuditModal } from './components/common/VerificationAuditModal';
import { ShieldCheck, GraduationCap } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useRetail();
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F6F7F3] text-[#14263A] flex flex-col lg:flex-row">
      {/* Slim Deep-Navy Navigation Rail */}
      <NavigationRail
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'workspace' && <DataWorkspaceView />}
          {activeTab === 'anomalies' && <AnomaliesView />}
          {activeTab === 'recommendations' && <RecommendationsView />}
          {activeTab === 'decisions' && <DecisionsView />}
          {activeTab === 'reports' && <ReportsView />}
        </main>

        {/* Floating Quick Verification Button (Hidden in Print) */}
        <div className="no-print fixed bottom-4 right-4 z-30">
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-full shadow-lg border border-slate-700 text-xs font-semibold transition-all hover:scale-105"
            title="Run live automated verification audit of all 7 project test checks"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Verification Audit</span>
          </button>
        </div>

        {/* Global Modals */}
        <ThreeMinuteReviewGuide />
        <AcademicProjectModal />
        <UploadCSVModal />
        <SampleDataModal />
        <VerificationAuditModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
        />
      </div>
    </div>
  );
};

export function App() {
  return (
    <RetailProvider>
      <MainLayout />
    </RetailProvider>
  );
}

export default App;
