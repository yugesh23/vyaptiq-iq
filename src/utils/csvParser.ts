import { RetailRecord, ValidationError, ParseResult } from '../types/retail';

const ALIASES: Record<string, string[]> = {
  date: ['date', 'transaction_date', 'trans_date', 'timestamp', 'txn_date'],
  sku: ['sku', 'product_id', 'productid', 'item_code', 'sku_id', 'product'],
  region: ['region', 'zone', 'area', 'location', 'territory'],
  units: ['units', 'quantity', 'qty', 'volume', 'count', 'items_sold'],
  price: ['price', 'unit_price', 'selling_price', 'rate', 'unitprice'],
  cost: ['cost', 'unit_cost', 'cogs', 'buy_price', 'unitcost'],
  promo_flag: ['promo_flag', 'promo', 'is_promo', 'promotion', 'discount_flag', 'is_discounted'],
  marketing_spend: ['marketing_spend', 'spend', 'mkt_spend', 'ad_spend', 'advertising'],
  channel: ['channel', 'sales_channel', 'platform', 'distribution_channel'],
  customer_segment: ['customer_segment', 'segment', 'cust_type', 'tier'],
  customer_id: ['customer_id', 'cust_id', 'client_id', 'traffic_proxy', 'user_id', 'visitor_id'],
  revenue: ['revenue', 'sales', 'total_amount', 'net_sales', 'total_revenue', 'total_price']
};

export function parseCSV(
  csvText: string,
  options: {
    revenueInterpretation?: 'preserve_supplied' | 'recompute_units_x_price';
    customMapping?: Record<string, string>;
  } = {}
): ParseResult {
  const lines = splitLines(csvText.trim());
  if (lines.length === 0) {
    return {
      records: [],
      validationErrors: [{ rowId: 0, column: 'file', value: '', reason: 'File is empty' }],
      discrepancies: [],
      columnMapping: {},
      availableMetrics: {
        canComputeMargin: false,
        canComputePromoRate: false,
        canComputeArpu: false,
        canComputeMarketingRoi: false
      }
    };
  }

  // Parse header
  const rawHeaders = parseCSVLine(lines[0]);
  const columnMapping = options.customMapping || resolveColumnMapping(rawHeaders);

  const validationErrors: ValidationError[] = [];
  const discrepancies: ParseResult['discrepancies'] = [];
  const records: RetailRecord[] = [];

  const revenueInterp = options.revenueInterpretation || 'preserve_supplied';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const rowValues = parseCSVLine(line);
    const rowId = i; // 1-based data row ID

    const getCol = (canonical: string): string | undefined => {
      const idx = rawHeaders.indexOf(columnMapping[canonical] || '');
      return idx >= 0 && idx < rowValues.length ? rowValues[idx].trim() : undefined;
    };

    // Extract fields
    const dateVal = getCol('date') || '';
    const skuVal = getCol('sku') || '';
    const regionVal = getCol('region') || 'General';
    const unitsRaw = getCol('units');
    const priceRaw = getCol('price');
    const costRaw = getCol('cost');
    const promoRaw = getCol('promo_flag');
    const spendRaw = getCol('marketing_spend');
    const channelVal = getCol('channel');
    const segmentVal = getCol('customer_segment');
    const customerIdVal = getCol('customer_id');
    const revenueRaw = getCol('revenue');

    // Validation
    if (!dateVal) {
      validationErrors.push({ rowId, column: 'date', value: '', reason: 'Date is missing' });
    }

    if (!skuVal) {
      validationErrors.push({ rowId, column: 'sku', value: '', reason: 'SKU / Product ID is missing' });
    }

    const units = unitsRaw !== undefined ? parseInt(unitsRaw, 10) : NaN;
    if (isNaN(units) || units <= 0) {
      validationErrors.push({ rowId, column: 'units', value: unitsRaw, reason: 'Units must be a positive integer' });
    }

    const price = priceRaw !== undefined ? parseFloat(priceRaw) : NaN;
    if (isNaN(price) || price < 0) {
      validationErrors.push({ rowId, column: 'price', value: priceRaw, reason: 'Price must be a non-negative number' });
    }

    const cost = costRaw !== undefined && costRaw !== '' ? parseFloat(costRaw) : NaN;
    if (isNaN(cost) && costRaw !== undefined && costRaw !== '') {
      validationErrors.push({ rowId, column: 'cost', value: costRaw, reason: 'Cost must be a valid number' });
    }

    // Promo flag: 0, 1, true, false, yes, no
    let promoFlag = 0;
    if (promoRaw !== undefined && promoRaw !== '') {
      const lowerPromo = promoRaw.toLowerCase();
      if (lowerPromo === '1' || lowerPromo === 'true' || lowerPromo === 'yes') {
        promoFlag = 1;
      } else if (lowerPromo === '0' || lowerPromo === 'false' || lowerPromo === 'no') {
        promoFlag = 0;
      } else {
        validationErrors.push({ rowId, column: 'promo_flag', value: promoRaw, reason: 'Invalid promotion flag format (use 1, 0, true, or false)' });
      }
    }

    const spend = spendRaw !== undefined && spendRaw !== '' ? parseFloat(spendRaw) : 0;

    // Revenue calculation and discrepancy check
    let revenue = 0;
    const computedExpected = (!isNaN(units) && !isNaN(price)) ? units * price : 0;

    let hasDiscrepancy = false;
    let suppliedRev = NaN;

    if (revenueRaw !== undefined && revenueRaw !== '') {
      suppliedRev = parseFloat(revenueRaw);
      if (!isNaN(suppliedRev)) {
        if (Math.abs(suppliedRev - computedExpected) > 0.05 && computedExpected > 0) {
          hasDiscrepancy = true;
          discrepancies.push({
            rowId,
            suppliedRevenue: suppliedRev,
            computedRevenue: computedExpected,
            units: isNaN(units) ? 0 : units,
            price: isNaN(price) ? 0 : price
          });
        }
        revenue = revenueInterp === 'preserve_supplied' ? suppliedRev : computedExpected;
      } else {
        revenue = computedExpected;
      }
    } else {
      revenue = computedExpected;
    }

    // If critical fields are valid, include in records
    if (!isNaN(units) && units > 0 && !isNaN(price) && skuVal && dateVal) {
      records.push({
        row_id: rowId,
        date: dateVal,
        sku: skuVal,
        region: regionVal,
        units,
        price,
        cost: isNaN(cost) ? 0 : cost,
        promo_flag: promoFlag,
        marketing_spend: isNaN(spend) ? 0 : spend,
        channel: channelVal,
        customer_segment: segmentVal,
        customer_id: customerIdVal,
        traffic_proxy: customerIdVal && !isNaN(parseInt(customerIdVal, 10)) ? parseInt(customerIdVal, 10) : undefined,
        revenue: Math.round(revenue * 100) / 100,
        original_revenue: !isNaN(suppliedRev) ? suppliedRev : undefined,
        has_revenue_discrepancy: hasDiscrepancy
      });
    }
  }

  const hasCost = records.some(r => r.cost > 0);
  const hasSpend = records.some(r => r.marketing_spend > 0);
  const hasCust = records.some(r => !!r.customer_id || !!r.traffic_proxy);

  return {
    records,
    validationErrors,
    discrepancies,
    columnMapping,
    availableMetrics: {
      canComputeMargin: hasCost,
      canComputePromoRate: records.some(r => r.promo_flag !== undefined),
      canComputeArpu: hasCust,
      canComputeMarketingRoi: hasSpend
    }
  };
}

function resolveColumnMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const lowerHeaders = headers.map(h => h.trim().toLowerCase());

  for (const [canonical, aliasList] of Object.entries(ALIASES)) {
    for (const alias of aliasList) {
      const idx = lowerHeaders.indexOf(alias);
      if (idx >= 0) {
        mapping[canonical] = headers[idx];
        break;
      }
    }
  }

  return mapping;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function splitLines(text: string): string[] {
  return text.split(/\r?\n/);
}
