-- ============================================================================
-- VYAPTIQ IQ: PostgreSQL Schema & Row-Level Security (RLS) Policies
-- Department of IT, NRI Institute of Technology (Autonomous)
-- Project: Vyaptiq IQ – Data Driven Retail Intelligence For Revenue Growth
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Workspaces Table
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Datasets Table
CREATE TABLE IF NOT EXISTS public.datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_snapshot BOOLEAN DEFAULT FALSE,
    row_count INTEGER NOT NULL,
    date_start DATE,
    date_end DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Retail Transactions Data Table (retail_data)
CREATE TABLE IF NOT EXISTS public.retail_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
    row_index INTEGER,
    product_id TEXT NOT NULL,         -- SKU / item code
    product_name TEXT,
    category TEXT,
    region TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
    revenue NUMERIC(14, 2) NOT NULL,
    promo_flag SMALLINT DEFAULT 0 CHECK (promo_flag IN (0, 1)),
    marketing_spend NUMERIC(10, 2) DEFAULT 0,
    channel TEXT,
    customer_segment TEXT,
    customer_id TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KPI Analysis Runs
CREATE TABLE IF NOT EXISTS public.kpi_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
    total_revenue NUMERIC(16, 2) NOT NULL,
    total_cost NUMERIC(16, 2) NOT NULL,
    total_margin NUMERIC(16, 2) NOT NULL,
    margin_pct NUMERIC(6, 2) NOT NULL,
    total_units INTEGER NOT NULL,
    promo_rate NUMERIC(6, 2) NOT NULL,
    arpu NUMERIC(10, 2),
    computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Flagged Anomalies
CREATE TABLE IF NOT EXISTS public.anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
    row_id INTEGER NOT NULL,
    sku TEXT NOT NULL,
    region TEXT NOT NULL,
    units INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    revenue NUMERIC(14, 2) NOT NULL,
    z_score NUMERIC(6, 2) NOT NULL,
    flag_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Recommendations Table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
    rec_code TEXT NOT NULL,           -- e.g. 'REC-01'
    sku TEXT NOT NULL,
    title TEXT NOT NULL,
    rule_applied TEXT NOT NULL,
    suggested_action TEXT NOT NULL,
    priority_category TEXT NOT NULL,
    score NUMERIC(6, 2) NOT NULL,
    current_status TEXT NOT NULL DEFAULT 'Pending',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Decision Audit History
CREATE TABLE IF NOT EXISTS public.decision_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE CASCADE,
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id),
    reviewer_name TEXT NOT NULL,
    reviewer_role TEXT NOT NULL CHECK (reviewer_role IN ('Business Analyst', 'Decision Maker', 'Administrator')),
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retail_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_history ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users within their workspace to read data
CREATE POLICY "Users can read retail data in their workspace"
    ON public.retail_data
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Allow Business Analysts and Managers to insert data
CREATE POLICY "Users can insert retail records"
    ON public.retail_data
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Decision Maker approval policy: only Decision Makers can update status to Approved/Rejected
CREATE POLICY "Only Decision Makers can approve actions"
    ON public.recommendations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('Decision Maker', 'Administrator')
        )
    );

-- Audit history insert policy
CREATE POLICY "Users can insert decision history"
    ON public.decision_history
    FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

-- ============================================================================
-- STORED PROCEDURE: createRetailRecord (Documented Report Example)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_retail_record(
    p_product_id TEXT,
    p_product_name TEXT,
    p_category TEXT,
    p_region TEXT,
    p_quantity INTEGER,
    p_price NUMERIC,
    p_cost NUMERIC DEFAULT 0,
    p_promo_flag SMALLINT DEFAULT 0,
    p_marketing_spend NUMERIC DEFAULT 0,
    p_created_by UUID DEFAULT auth.uid()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_revenue NUMERIC;
    v_new_id UUID;
BEGIN
    -- 1. Validate required inputs
    IF p_product_id IS NULL OR trim(p_product_id) = '' THEN
        RAISE EXCEPTION 'Product ID (SKU) cannot be empty';
    END IF;

    IF p_quantity IS NULL OR p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be a positive integer';
    END IF;

    IF p_price IS NULL OR p_price < 0 THEN
        RAISE EXCEPTION 'Price must be non-negative';
    END IF;

    -- 2. Calculate revenue as price * quantity for insertion
    v_revenue := round((p_price * p_quantity), 2);

    -- 3. Insert record
    INSERT INTO public.retail_data (
        product_id,
        product_name,
        category,
        region,
        quantity,
        price,
        cost,
        revenue,
        promo_flag,
        marketing_spend,
        created_by
    ) VALUES (
        p_product_id,
        p_product_name,
        p_category,
        COALESCE(p_region, 'General'),
        p_quantity,
        p_price,
        p_cost,
        v_revenue,
        COALESCE(p_promo_flag, 0),
        COALESCE(p_marketing_spend, 0),
        p_created_by
    )
    RETURNING id INTO v_new_id;

    RETURN jsonb_build_object(
        'status', 'success',
        'id', v_new_id,
        'revenue', v_revenue,
        'created_at', NOW()
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'status', 'error',
            'message', SQLERRM
        );
END;
$$;
