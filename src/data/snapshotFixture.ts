import { KPISummary, AnomalyRecord, Recommendation } from '../types/retail';

export const SNAPSHOT_METADATA = {
  id: 'snapshot-apparel-store',
  name: 'dataset_1_apparel_store.csv (Report Snapshot)',
  isSnapshot: true,
  description: 'Documented summary fixture reproducing the published B.Tech project review screenshot. Contains 1,800 reported rows with 5 outlier records preserved.',
  rowCount: 1800,
  dateRange: {
    start: '2026-01-01',
    end: '2026-03-31'
  },
  skus: [
    'Apparel_Denim',
    'Apparel_Jacket',
    'Apparel_TShirt',
    'Apparel_Footwear',
    'Apparel_Accessories'
  ],
  regions: ['North', 'South', 'East', 'West'],
  channels: ['Online', 'Retail_Store']
};

export const SNAPSHOT_KPIS: KPISummary = {
  totalRevenue: 50342560.58,
  totalCost: 38794230.00,
  totalMargin: 11548330.58,
  marginPct: 22.94,
  totalUnits: 42563,
  promoRate: 24.4,
  promoRateCoverage: 100.0,
  arpu: 390.37,
  arpuDenominator: '128,962 documented customer visits (traffic proxy)',
  uniqueCustomers: 128962,
  rowCount: 1800,
  uniqueSkus: 5,
  uniqueRegions: 4,
  dateRange: {
    start: '2026-01-01',
    end: '2026-03-31'
  },
  skuBreakdown: [
    {
      sku: 'Apparel_Denim',
      revenue: 12480500.00,
      units: 10400,
      margin: 3640150.00,
      marginPct: 29.17,
      marketingSpend: 482804.64,
      revenuePerSpend: 25.85,
      promoRate: 18.2
    },
    {
      sku: 'Apparel_Jacket',
      revenue: 17850200.58,
      units: 7140,
      margin: 2873880.58,
      marginPct: 16.10,
      marketingSpend: 890000.00,
      revenuePerSpend: 20.06,
      promoRate: 17.5
    },
    {
      sku: 'Apparel_TShirt',
      revenue: 5980400.00,
      units: 14200,
      margin: 926960.00,
      marginPct: 15.50,
      marketingSpend: 620000.00,
      revenuePerSpend: 9.65,
      promoRate: 38.0
    },
    {
      sku: 'Apparel_Footwear',
      revenue: 10250600.00,
      units: 6800,
      margin: 2767660.00,
      marginPct: 27.00,
      marketingSpend: 750000.00,
      revenuePerSpend: 13.67,
      promoRate: 19.1
    },
    {
      sku: 'Apparel_Accessories',
      revenue: 3780860.00,
      units: 4023,
      margin: 1339680.00,
      marginPct: 35.43,
      marketingSpend: 540000.00,
      revenuePerSpend: 7.00,
      promoRate: 16.4
    }
  ],
  regionBreakdown: [
    { region: 'North', revenue: 13420000.00, margin: 3086600.00, marginPct: 23.00, units: 11200 },
    { region: 'South', revenue: 14100560.58, margin: 3243130.58, marginPct: 23.00, units: 11950 },
    { region: 'East', revenue: 10922000.00, margin: 2512060.00, marginPct: 23.00, units: 9313 },
    { region: 'West', revenue: 11900000.00, margin: 2706540.00, marginPct: 22.74, units: 10100 }
  ],
  dailyTrends: [
    { date: '2026-01-01', revenue: 540200, margin: 124000, units: 450 },
    { date: '2026-01-15', revenue: 580000, margin: 133000, units: 490 },
    { date: '2026-01-23', revenue: 644248, margin: 148000, units: 534 },
    { date: '2026-02-01', revenue: 510000, margin: 117000, units: 430 },
    { date: '2026-02-14', revenue: 687100, margin: 158000, units: 580 },
    { date: '2026-02-20', revenue: 634248, margin: 145000, units: 524 },
    { date: '2026-02-26', revenue: 646390, margin: 149000, units: 535 },
    { date: '2026-03-01', revenue: 530000, margin: 122000, units: 440 },
    { date: '2026-03-18', revenue: 656390, margin: 151000, units: 545 },
    { date: '2026-03-31', revenue: 570000, margin: 131000, units: 480 }
  ]
};

export const SNAPSHOT_ANOMALIES: AnomalyRecord[] = [
  {
    rowId: 888,
    date: '2026-02-14',
    sku: 'Apparel_Jacket',
    region: 'West',
    units: 50,
    price: 2142.00,
    cost: 2100.00,
    revenue: 107100.00,
    zScore: 3.94,
    meanRevenue: 27968.09,
    stdDevRevenue: 20108.29,
    arithmeticFormula: '50 units × ₹2,142 = ₹107,100',
    investigationSignal: 'Statistical revenue anomaly (+3.94σ above dataset mean of ₹27,968.09). High unit bulk volume (50 units) on Valentine\'s Day weekend; margin was exceptionally compressed (1.96% margin, cost ₹2,100 vs price ₹2,142).'
  },
  {
    rowId: 1126,
    date: '2026-02-26',
    sku: 'Apparel_Jacket',
    region: 'South',
    units: 45,
    price: 2142.00,
    cost: 2100.00,
    revenue: 96390.00,
    zScore: 3.40,
    meanRevenue: 27968.09,
    stdDevRevenue: 20108.29,
    arithmeticFormula: '45 units × ₹2,142 = ₹96,390',
    investigationSignal: 'Statistical revenue anomaly (+3.40σ above mean). Repeat large-order purchase pattern observed at identical discounted unit price ₹2,142.'
  },
  {
    rowId: 1525,
    date: '2026-03-18',
    sku: 'Apparel_Jacket',
    region: 'North',
    units: 45,
    price: 2142.00,
    cost: 2100.00,
    revenue: 96390.00,
    zScore: 3.40,
    meanRevenue: 27968.09,
    stdDevRevenue: 20108.29,
    arithmeticFormula: '45 units × ₹2,142 = ₹96,390',
    investigationSignal: 'Statistical revenue anomaly (+3.40σ above mean). Similar high-quantity order in North region indicating potential B2B institutional buying or reseller arbitrage.'
  },
  {
    rowId: 446,
    date: '2026-01-23',
    sku: 'Apparel_Jacket',
    region: 'South',
    units: 44,
    price: 2142.00,
    cost: 2100.00,
    revenue: 94248.00,
    zScore: 3.30,
    meanRevenue: 27968.09,
    stdDevRevenue: 20108.29,
    arithmeticFormula: '44 units × ₹2,142 = ₹94,248',
    investigationSignal: 'Statistical revenue anomaly (+3.30σ above mean). Pre-Republic Day weekend bulk purchase; identical unit pricing confirms discount tier anomaly.'
  },
  {
    rowId: 1006,
    date: '2026-02-20',
    sku: 'Apparel_Jacket',
    region: 'South',
    units: 44,
    price: 2142.00,
    cost: 2100.00,
    revenue: 94248.00,
    zScore: 3.30,
    meanRevenue: 27968.09,
    stdDevRevenue: 20108.29,
    arithmeticFormula: '44 units × ₹2,142 = ₹94,248',
    investigationSignal: 'Statistical revenue anomaly (+3.30σ above mean). Fourth bulk transaction from South region, reinforcing need for minimum order quantity margin governance.'
  }
];

export const SNAPSHOT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'REC-01',
    title: 'Marketing Budget Reallocation for Apparel_Denim',
    sku: 'Apparel_Denim',
    priorityCategory: 'Action Required', // High Impact -> Action Required
    businessQuestion: 'Are marketing rupees generating significantly higher revenue returns on Denim compared to lower-performing baseline categories?',
    eligibilityRule: 'Marketing Return Delta ≥ +20% compared with lower-tier baseline products (Accessories ₹7.00 / T-Shirt ₹9.65).',
    conditionMet: true,
    inputFigures: {
      skuMarginPct: 29.17,
      skuRevenuePerSpend: 25.85,
      baselineRoi: 8.32,
      roiDeltaPct: 210.7,
      marketingSpend: 482804.64,
      totalRevenue: 12480500.00
    },
    comparisonBaseline: 'Tier-2/3 baseline average: ₹8.32 revenue per ₹1 spend across T-Shirt and Accessories.',
    suggestedAction: 'Reallocate 20% of marketing spend (approx. ₹120,000) from lower-return categories to Apparel_Denim to exploit demonstrated demand elasticity.',
    priorityScore: 5.85,
    priorityScoreLabel: 'Published Score: 5.85',
    revenuePerSpend: 25.85,
    priceElasticity: null,
    projectedRevenueChangePct: 7.2,
    projectedMarginChangePct: 8.5,
    projectedRevenueGain: 898500.00,
    observedLift: null, // "Pending follow-up test data"
    currentStatus: 'Pending',
    decisionHistory: [],
    implementationNotes: 'Requires coordination with Digital Performance Marketing channel leads for paid search and social campaigns.'
  },
  {
    id: 'REC-02',
    title: 'Targeted Price Adjustment for Apparel_Jacket',
    sku: 'Apparel_Jacket',
    priorityCategory: 'Optimize', // Moderate Impact -> Optimize
    businessQuestion: 'Can selling prices for Apparel_Jacket be increased without causing a proportionate drop in customer demand volume?',
    eligibilityRule: '|Price Elasticity| < 0.5 (Inelastic Demand) AND Gross Margin < 20% (Current: 16.10%).',
    conditionMet: true,
    inputFigures: {
      skuMarginPct: 16.10,
      priceElasticity: -0.28,
      currentPrice: 2498.00,
      targetMarginPct: 19.50,
      sampleSize: 360
    },
    comparisonBaseline: 'Category average margin threshold 20.00%; observed jacket margin of 16.10% leaks ₹696,000 annually.',
    suggestedAction: 'Test a 4% selling-price increase (from approx. ₹2,498 to ₹2,598) across online and retail store channels.',
    priorityScore: 2.96,
    priorityScoreLabel: 'Published Score: 2.96',
    revenuePerSpend: 20.06,
    priceElasticity: -0.28,
    projectedRevenueChangePct: 3.1,
    projectedMarginChangePct: 14.8,
    projectedRevenueGain: 553000.00,
    observedLift: null,
    currentStatus: 'Pending',
    decisionHistory: [],
    implementationNotes: 'Run as a 4-week controlled experiment with South region as test group and North region as holdout control.'
  },
  {
    id: 'REC-03',
    title: 'Discount Tightening for Apparel_TShirt',
    sku: 'Apparel_TShirt',
    priorityCategory: 'Optimize', // Moderate Impact -> Optimize
    businessQuestion: 'Is high promotional frequency diluting gross margin on T-Shirts without driving profitable incremental basket value?',
    eligibilityRule: 'Gross Margin < 20% (Current: 15.50%) AND Promotion Rate > 25% (Current: 38.0%).',
    conditionMet: true,
    inputFigures: {
      skuMarginPct: 15.50,
      skuPromoRate: 38.0,
      currentPromoUnitsPct: 45.2,
      discountDepthPct: 15.0
    },
    comparisonBaseline: 'Store target promo rate ceiling: 25.0%; current 38.0% promo frequency compresses gross margin by 4.5 percentage points.',
    suggestedAction: 'Test reducing promotion frequency to 20% (capping discount campaigns to alternate weekends) and raising minimum bundle quantity.',
    priorityScore: 1.79,
    priorityScoreLabel: 'Published Score: 1.79',
    revenuePerSpend: 9.65,
    priceElasticity: -0.62,
    projectedRevenueChangePct: -1.5,
    projectedMarginChangePct: 18.2,
    projectedRevenueGain: 284000.00,
    observedLift: null,
    currentStatus: 'Pending',
    decisionHistory: [],
    implementationNotes: 'Review coupon rules on Shopify/POS checkout; disable auto-applied promotional discounts on base sizes.'
  }
];
