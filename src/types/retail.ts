export type Role = 'Business Analyst' | 'Decision Maker' | 'Administrator';

export type DecisionStatus =
  | 'Pending'
  | 'Reviewed'
  | 'Approved'
  | 'Action in Progress'
  | 'Completed'
  | 'Rejected'
  | 'Needs Analysis';

export type PriorityCategory =
  | 'Immediate Action' // Critical Impact
  | 'Action Required'  // High Impact
  | 'Optimize'         // Moderate Impact
  | 'Monitor';         // Low Impact

export interface RetailRecord {
  row_id: number;
  date: string;
  sku: string;
  product_name?: string;
  category?: string;
  region: string;
  units: number;
  price: number;
  cost: number;
  promo_flag: number; // 0 or 1
  marketing_spend: number;
  channel?: string;
  customer_segment?: string;
  customer_id?: string;
  traffic_proxy?: number;
  revenue: number;
  original_revenue?: number;
  has_revenue_discrepancy?: boolean;
}

export interface KPISummary {
  totalRevenue: number;
  totalCost: number;
  totalMargin: number;
  marginPct: number;
  totalUnits: number;
  promoRate: number; // percentage 0 - 100
  promoRateCoverage: number; // percentage of records with known promo flag
  arpu: number | null;
  arpuDenominator: string;
  uniqueCustomers: number;
  rowCount: number;
  uniqueSkus: number;
  uniqueRegions: number;
  dateRange: { start: string; end: string };
  skuBreakdown: Array<{
    sku: string;
    revenue: number;
    units: number;
    margin: number;
    marginPct: number;
    marketingSpend: number;
    revenuePerSpend: number | null;
    promoRate: number;
  }>;
  regionBreakdown: Array<{
    region: string;
    revenue: number;
    margin: number;
    marginPct: number;
    units: number;
  }>;
  channelBreakdown?: Array<{
    channel: string;
    revenue: number;
    margin: number;
  }>;
  dailyTrends: Array<{
    date: string;
    revenue: number;
    margin: number;
    units: number;
  }>;
}

export interface AnomalyRecord {
  rowId: number;
  date: string;
  sku: string;
  region: string;
  units: number;
  price: number;
  cost: number;
  revenue: number;
  zScore: number;
  meanRevenue: number;
  stdDevRevenue: number;
  arithmeticFormula: string;
  investigationSignal: string;
}

export interface Recommendation {
  id: string; // 'REC-01', 'REC-02', etc.
  title: string;
  sku: string;
  priorityCategory: PriorityCategory;
  businessQuestion: string;
  eligibilityRule: string;
  conditionMet: boolean;
  inputFigures: {
    skuMarginPct: number;
    skuPromoRate?: number;
    skuRevenuePerSpend?: number;
    baselineRoi?: number;
    roiDeltaPct?: number;
    priceElasticity?: number | null;
    currentPrice?: number;
    sampleSize?: number;
    [key: string]: any;
  };
  comparisonBaseline: string;
  suggestedAction: string;
  priorityScore: number; // Published or Demo Priority Score
  priorityScoreLabel: string;
  revenuePerSpend: number | null; // "Revenue per ₹1 of marketing spend"
  priceElasticity: number | null;
  projectedRevenueChangePct: number;
  projectedMarginChangePct: number;
  projectedRevenueGain: number;
  observedLift: string | null; // "Pending follow-up test data"
  currentStatus: DecisionStatus;
  decisionHistory: DecisionRecord[];
  implementationNotes?: string;
}

export interface DecisionRecord {
  id: string;
  recommendationId: string;
  datasetId: string;
  reviewerName: string;
  reviewerRole: Role;
  timestamp: string;
  previousStatus: DecisionStatus;
  newStatus: DecisionStatus;
  remarks: string;
}

export interface DatasetMeta {
  id: string;
  name: string;
  isSnapshot: boolean;
  description: string;
  rowCount: number;
  dateRange: { start: string; end: string };
  skus: string[];
  regions: string[];
  channels: string[];
}

export interface ValidationError {
  rowId: number;
  column: string;
  value: any;
  reason: string;
}

export interface ParseResult {
  records: RetailRecord[];
  validationErrors: ValidationError[];
  discrepancies: Array<{
    rowId: number;
    suppliedRevenue: number;
    computedRevenue: number;
    units: number;
    price: number;
  }>;
  columnMapping: Record<string, string>;
  availableMetrics: {
    canComputeMargin: boolean;
    canComputePromoRate: boolean;
    canComputeArpu: boolean;
    canComputeMarketingRoi: boolean;
  };
}
