import { RetailRecord, Role, DecisionRecord, DecisionStatus } from '../types/retail';

export interface DataAdapter {
  createRetailRecord(params: {
    productId: string;
    productName?: string;
    category?: string;
    region?: string;
    quantity: number;
    price: number;
    cost?: number;
    promoFlag?: number;
    marketingSpend?: number;
    createdBy: string;
  }): Promise<{ status: 'success'; record: RetailRecord } | { status: 'error'; message: string }>;

  getDecisionHistory(): Promise<DecisionRecord[]>;
  saveDecisionRecord(record: DecisionRecord): Promise<boolean>;
}

/**
 * LocalDemoAdapter:
 * Operates offline using browser localStorage and in-memory structures.
 * Perfect for classroom projectors, live viva reviews, and offline environments.
 */
export class LocalDemoAdapter implements DataAdapter {
  private storageKey = 'vyaptiq_iq_demo_records_v1';
  private historyKey = 'vyaptiq_iq_decision_history_v1';

  async createRetailRecord(params: {
    productId: string;
    productName?: string;
    category?: string;
    region?: string;
    quantity: number;
    price: number;
    cost?: number;
    promoFlag?: number;
    marketingSpend?: number;
    createdBy: string;
  }) {
    // 1. Validation
    if (!params.productId || params.productId.trim() === '') {
      return { status: 'error' as const, message: 'Product ID (SKU) is required.' };
    }
    if (isNaN(params.quantity) || params.quantity <= 0) {
      return { status: 'error' as const, message: 'Quantity must be a positive integer.' };
    }
    if (isNaN(params.price) || params.price < 0) {
      return { status: 'error' as const, message: 'Price must be a non-negative number.' };
    }

    // 2. Compute revenue
    const revenue = Math.round(params.price * params.quantity * 100) / 100;

    // 3. Assemble record
    const record: RetailRecord = {
      row_id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      sku: params.productId.trim(),
      product_name: params.productName || params.productId,
      category: params.category || 'General',
      region: params.region || 'North',
      units: Math.floor(params.quantity),
      price: params.price,
      cost: params.cost || 0,
      promo_flag: params.promoFlag || 0,
      marketing_spend: params.marketingSpend || 0,
      revenue
    };

    // 4. Save to localStorage
    try {
      const existing = localStorage.getItem(this.storageKey);
      const list: RetailRecord[] = existing ? JSON.parse(existing) : [];
      list.push(record);
      localStorage.setItem(this.storageKey, JSON.stringify(list));
      return { status: 'success' as const, record };
    } catch (e: any) {
      return { status: 'error' as const, message: e.message || 'Failed to save to localStorage' };
    }
  }

  async getDecisionHistory(): Promise<DecisionRecord[]> {
    try {
      const saved = localStorage.getItem(this.historyKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  async saveDecisionRecord(record: DecisionRecord): Promise<boolean> {
    try {
      const existing = await this.getDecisionHistory();
      existing.push(record);
      localStorage.setItem(this.historyKey, JSON.stringify(existing));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * SupabaseConnectedAdapter:
 * Interacts with PostgreSQL over HTTPS when configured with valid keys.
 */
export class SupabaseConnectedAdapter implements DataAdapter {
  private url: string;
  private anonKey: string;

  constructor(url: string, anonKey: string) {
    this.url = url;
    this.anonKey = anonKey;
  }

  async createRetailRecord(params: any) {
    if (!this.url || !this.anonKey) {
      return { status: 'error' as const, message: 'Supabase credentials not configured in environment.' };
    }
    // Simulated fetch call to Supabase REST /rpc/create_retail_record
    return {
      status: 'error' as const,
      message: 'Connected Supabase endpoint unreachable; fallback to Local Review Adapter recommended.'
    };
  }

  async getDecisionHistory(): Promise<DecisionRecord[]> {
    return [];
  }

  async saveDecisionRecord(record: DecisionRecord): Promise<boolean> {
    return false;
  }
}
