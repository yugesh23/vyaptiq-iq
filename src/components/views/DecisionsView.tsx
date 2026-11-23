import React, { useState } from 'react';
import {
  CheckSquare,
  ShieldCheck,
  UserCheck,
  Clock,
  History,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Send,
  MessageSquare,
  Filter,
  FileCheck,
  Info
} from 'lucide-react';
import { useRetail } from '../../context/RetailContext';
import { DecisionStatus } from '../../types/retail';

export const DecisionsView: React.FC = () => {
  const {
    recommendations,
    decisionHistory,
    updateDecisionStatus,
    role,
    setRole,
    activeDatasetMeta,
    setActiveTab
  } = useRetail();

  const [selectedRecId, setSelectedRecId] = useState<string>(
    recommendations.length > 0 ? recommendations[0].id : 'REC-01'
  );
  const [targetStatus, setTargetStatus] = useState<DecisionStatus>('Approved');
  const [remarks, setRemarks] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const selectedRec = recommendations.find(r => r.id === selectedRecId) || recommendations[0];

  const handleApplyDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRec) return;

    const success = updateDecisionStatus(
      selectedRec.id,
      targetStatus,
      remarks.trim() || `Status updated to ${targetStatus} by ${role}.`
    );

    if (success) {
      setRemarks('');
    }
  };

  const filteredHistory = decisionHistory.filter(d => {
    if (statusFilter !== 'ALL' && d.newStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-navy-900 flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-teal-brand" />
              <span>Decisions, Action Governance & Audit Trail</span>
            </h1>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold">
              {decisionHistory.length} Audit Entries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforce separation of duties: Business Analyst requests analysis; Decision Maker approves and updates operational actions.
          </p>
        </div>

        {/* Current Role Context Card */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Logged Role:</span>
            <span className={`px-2 py-0.5 rounded font-bold text-xs ${
              role === 'Decision Maker'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-teal-100 text-teal-800'
            }`}>
              {role}
            </span>
          </div>

          <button
            onClick={() => setRole(role === 'Business Analyst' ? 'Decision Maker' : 'Business Analyst')}
            className="text-[11px] text-teal-brand hover:underline font-semibold"
          >
            Switch to {role === 'Business Analyst' ? 'Decision Maker' : 'Business Analyst'}
          </button>
        </div>
      </div>

      {/* Decision Lifecycle State Machine Graphic */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
          Standard Retail Governance Lifecycle
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'Pending', label: '1. Pending Review', desc: 'Identified by rules engine' },
            { id: 'Reviewed', label: '2. Analyst Reviewed', desc: 'Analyst verified empirical figures' },
            { id: 'Approved', label: '3. Approved by Manager', desc: 'Executive signed off on pilot' },
            { id: 'Action in Progress', label: '4. Action In Progress', desc: '4-week regional pilot underway' },
            { id: 'Completed', label: '5. Completed', desc: 'Realized results archived' }
          ].map((st, i) => (
            <React.Fragment key={st.id}>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col min-w-[140px]">
                <span className="font-bold text-navy-900">{st.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{st.desc}</span>
              </div>
              {i < 4 && <span className="text-slate-400 font-bold">→</span>}
            </React.Fragment>
          ))}
          <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/60 flex flex-col min-w-[120px] ml-auto">
            <span className="font-bold text-rose-800">Rejected / Needs Analysis</span>
            <span className="text-[10px] text-rose-600 mt-0.5">Holdout / Re-examination</span>
          </div>
        </div>
      </div>

      {/* Management Action Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-brand" />
              <span>Record Decision / Executive Sign-off</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Dataset: {activeDatasetMeta.id}
            </span>
          </div>

          <form onSubmit={handleApplyDecision} className="space-y-4 text-xs">
            {/* Select Target Recommendation */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Prioritized Recommendation:
              </label>
              <select
                value={selectedRecId}
                onChange={(e) => setSelectedRecId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-brand"
              >
                {recommendations.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.id}: {r.title} (Current: {r.currentStatus})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Status Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  New Governance Status:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as DecisionStatus)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-brand"
                >
                  {role === 'Business Analyst' ? (
                    <>
                      <option value="Reviewed">Reviewed (Analyst Findings Attached)</option>
                      <option value="Needs Analysis">Request More Analysis</option>
                    </>
                  ) : (
                    <>
                      <option value="Approved">Approved (Greenlight 4-Week Pilot)</option>
                      <option value="Action in Progress">Action In Progress (Pilot Live)</option>
                      <option value="Completed">Completed (Operationalized)</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Needs Analysis">Request More Analysis</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Active Reviewer Identity:
                </label>
                <div className="p-2 bg-slate-100 border border-slate-200 rounded-md text-slate-800 font-mono">
                  {role === 'Decision Maker' ? 'Vikram Verma (VP Retail Ops)' : 'Hari Sai Yugesh (Lead Analyst)'} [{role}]
                </div>
              </div>
            </div>

            {/* Remarks Input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Decision Remarks & Implementation Directives:
              </label>
              <textarea
                rows={3}
                placeholder={
                  role === 'Decision Maker'
                    ? 'Enter managerial sign-off notes, target regional cohorts, or A/B testing holdout conditions...'
                    : 'Enter analytical findings, data observations, or requests for additional SKU historical transactions...'
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-brand text-slate-800"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500 text-[11px]">
                Persisted to browser storage • Scoped to review workspace
              </span>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-5 py-2 rounded-md bg-teal-brand hover:bg-teal-hover text-white font-bold transition-colors shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Decision Record</span>
              </button>
            </div>
          </form>
        </div>

        {/* Selected Recommendation Summary Card (1 col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs text-navy-900 uppercase tracking-wider mb-2">
              Action Target Summary
            </h3>
            {selectedRec ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-teal-brand">{selectedRec.id}</span>
                  <h4 className="font-bold text-navy-900 text-sm mt-0.5">{selectedRec.title}</h4>
                  <p className="text-slate-600 mt-1">{selectedRec.suggestedAction}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Priority Category:</span>
                    <span className="font-bold text-navy-900">{selectedRec.priorityCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Current Status:</span>
                    <span className="font-bold text-teal-brand">{selectedRec.currentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Evaluation Score:</span>
                    <span className="font-bold text-navy-900">{selectedRec.priorityScore.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('reports')}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Preview in Executive Report Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decision Audit History Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
              <History className="w-4 h-4 text-teal-brand" />
              <span>Immutable Decision Trail (Persisted History)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of all reviewer transitions, remarks, and manager authorizations.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All Statuses ({decisionHistory.length})</option>
              <option value="Approved">Approved</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Action in Progress">Action in Progress</option>
              <option value="Needs Analysis">Needs Analysis</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <Info className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="font-bold text-sm text-navy-900">No Decision Records Yet</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Use the decision dispatch form above or click "Approve Action" from the Recommendations screen to record managerial decisions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-navy-900 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Audit ID</th>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Recommendation</th>
                  <th className="p-2.5">Reviewer & Role</th>
                  <th className="p-2.5">Status Transition</th>
                  <th className="p-2.5">Manager Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {filteredHistory.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-600">{d.id.substring(0, 14)}</td>
                    <td className="p-2.5 font-sans text-slate-500">
                      {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {new Date(d.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-2.5 font-bold text-navy-900">{d.recommendationId}</td>
                    <td className="p-2.5 font-sans">
                      <span className="font-semibold text-navy-900">{d.reviewerName}</span>{' '}
                      <span className="text-[10px] text-slate-500 font-mono">({d.reviewerRole})</span>
                    </td>
                    <td className="p-2.5">
                      <span className="text-slate-400">{d.previousStatus}</span>{' '}
                      <span className="text-slate-600 font-bold">→</span>{' '}
                      <span className="px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                        {d.newStatus}
                      </span>
                    </td>
                    <td className="p-2.5 font-sans text-slate-700 max-w-sm truncate" title={d.remarks}>
                      {d.remarks}
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
