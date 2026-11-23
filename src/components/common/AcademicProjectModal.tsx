import React from 'react';
import { X, GraduationCap, Users, User, GitBranch, Layers, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { useRetail } from '../../context/RetailContext';

export const AcademicProjectModal: React.FC = () => {
  const { isArchitectureOpen, setIsArchitectureOpen } = useRetail();

  if (!isArchitectureOpen) return null;

  const developerInfo = {
    name: 'Hari Sai Yugesh',
    pin: '23KN1A1239',
    role: 'Full-Stack Developer, Retail Analyst & System Architect'
  };

  const modules = [
    {
      num: 'M1',
      title: 'Authentication & Roles',
      desc: 'Dual-branch governance separating Business Analyst exploratory queries from Decision Maker approval authority. Local demo adapter with optional Supabase RLS integration.'
    },
    {
      num: 'M2',
      title: 'Upload & Data Workspace',
      desc: 'Dynamic CSV ingestion, header alias mapping (e.g. quantity → units), validation checks, and deliberate user selection for price-quantity revenue discrepancies.'
    },
    {
      num: 'M3',
      title: 'Analysis & Processing Engine',
      desc: 'Deterministic KPI aggregation (weighted gross margin %, promo frequency, ARPU) and population standard deviation revenue anomaly detection (|z| ≥ 3.0).'
    },
    {
      num: 'M4',
      title: 'Decisions & Actions Lifecycle',
      desc: 'Idempotent state machine (Pending → Reviewed → Approved → In Progress → Completed / Rejected / Needs Analysis) with immutable audit history and remarks.'
    },
    {
      num: 'M5',
      title: 'Reports & Visualization',
      desc: 'Projector-first 1366×768 responsive layout, print-ready CSS executive sheet, dual-axis shared date charts, and structured 4-week experiment planning.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#14263A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-brand rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold">Academic Project & Architecture Details</h2>
              <p className="text-xs text-slate-300">
                Department of Information Technology, NRI Institute of Technology (Autonomous)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsArchitectureOpen(false)}
            className="p-1.5 rounded text-slate-400 hover:text-white"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-sm text-slate-700">
          {/* Institutional Attribution Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold text-navy-900 text-sm mb-2 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-teal-brand" />
              <span>Project Specification & Institutional Credentials</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Project Title</p>
                <p className="font-semibold text-navy-900">
                  Vyaptiq IQ – Data Driven Retail Intelligence For Revenue Growth
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Degree & University</p>
                <p className="font-semibold text-navy-900">
                  B.Tech in IT • Jawaharlal Nehru Technological University Kakinada (JNTUK)
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Institution & Academic Year</p>
                <p className="font-semibold text-navy-900">
                  NRI Institute of Technology (Autonomous), Agiripalli • Academic Year 2026–2027
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Project Guidance & Head of Dept</p>
                <p className="font-semibold text-navy-900">
                  Guide: Mr. Ch. Kiran Babu, Asst. Professor | HOD: Dr. J. Rajendra Prasad
                </p>
              </div>
            </div>
          </div>

          {/* Developer Attribution */}
          <div>
            <h3 className="font-bold text-navy-900 text-sm mb-3 flex items-center space-x-2">
              <User className="w-4 h-4 text-teal-brand" />
              <span>Project Author & System Developer</span>
            </h3>
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-base text-navy-900">{developerInfo.name}</span>
                  <p className="text-slate-600 text-xs mt-0.5">{developerInfo.role}</p>
                </div>
                <span className="font-mono text-xs bg-teal-50 text-teal-800 border border-teal-200 font-bold px-2 py-1 rounded">
                  PIN: {developerInfo.pin}
                </span>
              </div>
            </div>
          </div>

          {/* Research Rationale & Hypothesis */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-xs space-y-2">
            <h4 className="font-bold text-teal-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-teal-brand" />
              <span>Research Problem & Academic Hypothesis</span>
            </h4>
            <p className="text-teal-950 leading-relaxed">
              <strong>Problem:</strong> Retailers frequently expand sales volumes while simultaneously suffering gross margin degradation due to uncoordinated pricing, uncalibrated promotions, and disconnected marketing spend across siloed spreadsheets.
            </p>
            <p className="text-teal-950 leading-relaxed">
              <strong>Hypothesis:</strong> Integrating automated transaction validation, weighted gross margin tracking, statistical anomaly detection (population z-scores), and inspectable recommendation rules within an auditable decision loop significantly improves opportunity identification over isolated manual reporting.
            </p>
          </div>

          {/* Five System Modules */}
          <div>
            <h3 className="font-bold text-navy-900 text-sm mb-3 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-brand" />
              <span>The Five Core Architectural Modules</span>
            </h3>
            <div className="space-y-2 text-xs">
              {modules.map((mod) => (
                <div key={mod.num} className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-3">
                  <span className="font-mono font-bold text-xs bg-navy-900 text-white px-2 py-1 rounded shrink-0">
                    {mod.num}
                  </span>
                  <div>
                    <h4 className="font-bold text-navy-900">{mod.title}</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scope Boundaries & Future Scope */}
          <div className="border-t border-slate-200 pt-4 text-xs space-y-2 text-slate-600">
            <h4 className="font-bold text-navy-900 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Academic Scope Boundaries & Future Work</span>
            </h4>
            <p>
              • <strong>Evidence Scope:</strong> Functional test outcomes reflect empirical calculations over historical retail transaction fixtures. No public production deployment or completed long-term commercial A/B test is asserted.
            </p>
            <p>
              • <strong>Excluded Material:</strong> Unrelated conclusions regarding satellite imagery / soil contamination appearing on page 47 of the draft report have been strictly excluded as non-retail artifacts.
            </p>
            <p>
              • <strong>Future Scope (Retail Roadmap):</strong> Machine learning demand forecasting (ARIMA/Prophet), real-time streaming ingestion from POS/ERP terminals, and automated explainable AI (SHAP value) recommendation explanations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={() => setIsArchitectureOpen(false)}
            className="px-4 py-2 text-xs font-semibold bg-navy-900 hover:bg-navy-800 text-white rounded-md transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
