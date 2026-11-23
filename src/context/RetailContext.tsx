import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  RetailRecord,
  KPISummary,
  AnomalyRecord,
  Recommendation,
  DecisionRecord,
  DecisionStatus,
  DatasetMeta
} from '../types/retail';
import { SNAPSHOT_METADATA, SNAPSHOT_KPIS, SNAPSHOT_ANOMALIES, SNAPSHOT_RECOMMENDATIONS } from '../data/snapshotFixture';
import { BUNDLED_SAMPLES } from '../data/bundledSamples';
import { parseCSV } from '../utils/csvParser';
import { computeKPIs, detectAnomalies, evaluateRecommendations } from '../utils/analyticsEngine';

export type TabDestination = 'overview' | 'workspace' | 'anomalies' | 'recommendations' | 'decisions' | 'reports';

interface RetailContextType {
  activeTab: TabDestination;
  setActiveTab: (tab: TabDestination) => void;
  role: Role;
  setRole: (role: Role) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  isSnapshotView: boolean;
  activeDatasetMeta: DatasetMeta;
  rawRecords: RetailRecord[];
  kpis: KPISummary;
  anomalies: AnomalyRecord[];
  recommendations: Recommendation[];
  decisionHistory: DecisionRecord[];
  
  // Filters
  selectedSku: string;
  setSelectedSku: (sku: string) => void;
  selectedRegion: string;
  setSelectedRegion: (reg: string) => void;
  
  // Actions
  loadSnapshot: () => void;
  loadSampleDataset: (sampleKey: 'apparel' | 'electronics' | 'grocery') => void;
  loadUploadedCSV: (name: string, csvContent: string, interpretation?: 'preserve_supplied' | 'recompute_units_x_price') => void;
  updateDecisionStatus: (recId: string, newStatus: DecisionStatus, remarks?: string) => boolean;
  resetDemoData: () => void;
  
  // Reviewer Presentation Guide
  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;
  guideStep: number;
  setGuideStep: (step: number) => void;
  
  // Modals
  isArchitectureOpen: boolean;
  setIsArchitectureOpen: (open: boolean) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isSampleModalOpen: boolean;
  setIsSampleModalOpen: (open: boolean) => void;
}

const RetailContext = createContext<RetailContextType | undefined>(undefined);

const DECISION_STORAGE_KEY = 'vyaptiq_iq_decision_history_v1';
const CURRENT_DATASET_KEY = 'vyaptiq_iq_current_dataset_v1';

export const RetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabDestination>('overview');
  const [role, setRole] = useState<Role>('Business Analyst');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isSnapshotView, setIsSnapshotView] = useState<boolean>(true);

  const [activeDatasetMeta, setActiveDatasetMeta] = useState<DatasetMeta>(SNAPSHOT_METADATA);
  const [rawRecords, setRawRecords] = useState<RetailRecord[]>([]);
  const [kpis, setKpis] = useState<KPISummary>(SNAPSHOT_KPIS);
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>(SNAPSHOT_ANOMALIES);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(SNAPSHOT_RECOMMENDATIONS);
  
  const [decisionHistory, setDecisionHistory] = useState<DecisionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(DECISION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters
  const [selectedSku, setSelectedSku] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Presentation Guide
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [guideStep, setGuideStep] = useState<number>(1);

  // Modals
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);

  // Save decision history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DECISION_STORAGE_KEY, JSON.stringify(decisionHistory));
    } catch (e) {
      console.warn('Failed to persist decisions to localStorage', e);
    }
  }, [decisionHistory]);

  // Sync recommendations with decision history
  useEffect(() => {
    setRecommendations(prev =>
      prev.map(rec => {
        const historyForRec = decisionHistory.filter(d => d.recommendationId === rec.id);
        if (historyForRec.length > 0) {
          const latest = historyForRec[historyForRec.length - 1];
          return {
            ...rec,
            currentStatus: latest.newStatus,
            decisionHistory: historyForRec
          };
        }
        return rec;
      })
    );
  }, [decisionHistory]);

  const loadSnapshot = () => {
    setIsSnapshotView(true);
    setActiveDatasetMeta(SNAPSHOT_METADATA);
    setRawRecords([]);
    setKpis(SNAPSHOT_KPIS);
    setAnomalies(SNAPSHOT_ANOMALIES);
    setRecommendations(SNAPSHOT_RECOMMENDATIONS);
    setSelectedSku('ALL');
    setSelectedRegion('ALL');
  };

  const loadSampleDataset = (sampleKey: 'apparel' | 'electronics' | 'grocery') => {
    const rawCSV = BUNDLED_SAMPLES[sampleKey];
    const names = {
      apparel: 'dataset_1_apparel_store.csv',
      electronics: 'dataset_2_electronics_mart.csv',
      grocery: 'dataset_3_grocery_superstore.csv'
    };
    loadUploadedCSV(names[sampleKey], rawCSV, 'preserve_supplied');
  };

  const loadUploadedCSV = (
    fileName: string,
    csvContent: string,
    interpretation: 'preserve_supplied' | 'recompute_units_x_price' = 'preserve_supplied'
  ) => {
    const parsed = parseCSV(csvContent, { revenueInterpretation: interpretation });
    const records = parsed.records;

    if (records.length === 0) {
      alert('No valid transaction rows found in CSV. Please verify column headers.');
      return;
    }

    const computedKpis = computeKPIs(records);
    const { anomalies: detectedAnomalies } = detectAnomalies(records, 3.0);
    const evaluatedRecs = evaluateRecommendations(records, computedKpis);

    const meta: DatasetMeta = {
      id: 'ds-' + Date.now(),
      name: fileName,
      isSnapshot: false,
      description: `Interactive dataset with ${records.length.toLocaleString()} valid rows computed dynamically by the analytics engine.`,
      rowCount: records.length,
      dateRange: computedKpis.dateRange,
      skus: computedKpis.skuBreakdown.map(s => s.sku),
      regions: computedKpis.regionBreakdown.map(r => r.region),
      channels: computedKpis.channelBreakdown?.map(c => c.channel) || []
    };

    setIsSnapshotView(false);
    setActiveDatasetMeta(meta);
    setRawRecords(records);
    setKpis(computedKpis);
    setAnomalies(detectedAnomalies);
    setRecommendations(evaluatedRecs);
    setSelectedSku('ALL');
    setSelectedRegion('ALL');
  };

  const updateDecisionStatus = (
    recId: string,
    newStatus: DecisionStatus,
    remarks: string = ''
  ): boolean => {
    // Role permissions check
    if (role === 'Business Analyst' && (newStatus === 'Approved' || newStatus === 'Rejected')) {
      alert('Permission Denied: Only a Decision Maker or Administrator can Approve or Reject recommendations. As Business Analyst, you may submit remarks or request analysis.');
      return false;
    }

    const rec = recommendations.find(r => r.id === recId);
    const prevStatus = rec ? rec.currentStatus : 'Pending';

    // Idempotent check
    if (prevStatus === newStatus && !remarks) {
      return true;
    }

    const record: DecisionRecord = {
      id: 'DEC-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      recommendationId: recId,
      datasetId: activeDatasetMeta.id,
      reviewerName: role === 'Decision Maker' ? 'Vikram Verma (VP Retail Ops)' : 'Hari Sai Yugesh (Lead Analyst)',
      reviewerRole: role,
      timestamp: new Date().toISOString(),
      previousStatus: prevStatus,
      newStatus,
      remarks: remarks || (newStatus === 'Approved' ? 'Approved for 4-week regional pilot test.' : `Status updated to ${newStatus}`)
    };

    setDecisionHistory(prev => [...prev, record]);
    return true;
  };

  const resetDemoData = () => {
    localStorage.removeItem(DECISION_STORAGE_KEY);
    setDecisionHistory([]);
    loadSnapshot();
    setActiveTab('overview');
  };

  return (
    <RetailContext.Provider
      value={{
        activeTab,
        setActiveTab,
        role,
        setRole,
        isDemoMode,
        setIsDemoMode,
        isSnapshotView,
        activeDatasetMeta,
        rawRecords,
        kpis,
        anomalies,
        recommendations,
        decisionHistory,
        selectedSku,
        setSelectedSku,
        selectedRegion,
        setSelectedRegion,
        loadSnapshot,
        loadSampleDataset,
        loadUploadedCSV,
        updateDecisionStatus,
        resetDemoData,
        isGuideOpen,
        setIsGuideOpen,
        guideStep,
        setGuideStep,
        isArchitectureOpen,
        setIsArchitectureOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isSampleModalOpen,
        setIsSampleModalOpen
      }}
    >
      {children}
    </RetailContext.Provider>
  );
};

export const useRetail = () => {
  const context = useContext(RetailContext);
  if (!context) {
    throw new Error('useRetail must be used within a RetailProvider');
  }
  return context;
};
