-- Create the nutrient_reference table
CREATE TABLE IF NOT EXISTS nutrient_reference (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    
    -- FSA Traffic Light Thresholds (per 100g)
    low_threshold DECIMAL(10,4),        -- Green: ≤ this value
    moderate_threshold DECIMAL(10,4),   -- Amber: ≤ this value  
    high_threshold DECIMAL(10,4),       -- Red: > moderate threshold
    
    -- For beneficial nutrients (fiber, protein, vitamins)
    is_beneficial BOOLEAN DEFAULT FALSE,
    
    -- Daily Reference Value (for % daily value calc)
    daily_reference_value DECIMAL(10,4),
    
    -- Scoring weights
    weight_factor DECIMAL(5,2) DEFAULT 1.0,
    
    -- Source of thresholds
    source VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE nutrient_reference ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read nutrient reference"
ON nutrient_reference FOR SELECT
USING (true);

-- Admin-only write access
CREATE POLICY "Admins can manage nutrient reference"
ON nutrient_reference FOR ALL
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- ============================================================
-- MACRONUTRIENTS - Based on FSA/WHO Guidelines
-- ============================================================
INSERT INTO nutrient_reference (key, display_name, unit, low_threshold, moderate_threshold, high_threshold, is_beneficial, daily_reference_value, weight_factor, source) VALUES
-- ENERGY
('energy-kcal', 'Energy', 'kcal', 100, 250, 400, FALSE, 2000, 1.0, 'FSA UK'),
-- TOTAL FAT (FSA: Low ≤3g, High >17.5g per 100g)
('fat', 'Fat', 'g', 3.0, 17.5, 17.5, FALSE, 70, 1.0, 'FSA UK'),
-- SATURATED FAT (FSA: Low ≤1.5g, High >5g per 100g)
('saturated-fat', 'Saturated Fat', 'g', 1.5, 5.0, 5.0, FALSE, 20, 1.5, 'FSA UK'),
-- TRANS FAT (WHO: <1% of energy, ~2.2g/day)
('trans-fat', 'Trans Fat', 'g', 0.5, 1.0, 2.0, FALSE, 2.2, 2.0, 'WHO'),
-- TOTAL CARBOHYDRATES
('carbohydrates', 'Carbohydrates', 'g', 20, 40, 60, FALSE, 260, 0.5, 'EU RDA'),
-- SUGARS (FSA: Low ≤5g, High >22.5g per 100g)
('sugars', 'Sugars', 'g', 5.0, 12.5, 22.5, FALSE, 50, 1.5, 'FSA UK'),
-- ADDED SUGARS (WHO: <10% of energy, ideally <5%)
('added-sugars', 'Added Sugars', 'g', 2.5, 6.0, 12.5, FALSE, 25, 2.0, 'WHO'),
-- FIBER (beneficial - higher is better)
('fiber', 'Fiber', 'g', 1.5, 3.0, 6.0, TRUE, 25, 1.0, 'FSA UK'),
-- PROTEIN (beneficial)
('proteins', 'Proteins', 'g', 4.0, 8.0, 16.0, TRUE, 50, 0.8, 'EU RDA'),
-- SALT (FSA: Low ≤0.3g, High >1.5g per 100g)
('salt', 'Salt', 'g', 0.3, 1.5, 1.5, FALSE, 6.0, 1.2, 'FSA UK'),
-- SODIUM (converted: salt = sodium × 2.5)
('sodium', 'Sodium', 'g', 0.12, 0.6, 0.6, FALSE, 2.4, 1.2, 'FSA UK'),
-- CHOLESTEROL (mg)
('cholesterol', 'Cholesterol', 'mg', 20, 60, 100, FALSE, 300, 0.8, 'WHO'),

-- ============================================================
-- VITAMINS - Based on EU RDA
-- ============================================================
-- Vitamin A
('vitamin-a', 'Vitamin A', 'µg', 120, 240, 400, TRUE, 800, 0.6, 'EU RDA'),
-- Vitamin C
('vitamin-c', 'Vitamin C', 'mg', 12, 24, 40, TRUE, 80, 0.6, 'EU RDA'),
-- Vitamin D
('vitamin-d', 'Vitamin D', 'µg', 0.75, 1.5, 2.5, TRUE, 5, 0.8, 'EU RDA'),
-- Vitamin E
('vitamin-e', 'Vitamin E', 'mg', 1.8, 3.6, 6.0, TRUE, 12, 0.5, 'EU RDA'),
-- Vitamin K
('vitamin-k', 'Vitamin K', 'µg', 11.25, 22.5, 37.5, TRUE, 75, 0.4, 'EU RDA'),
-- Vitamin B1 (Thiamin)
('vitamin-b1', 'Vitamin B1', 'mg', 0.165, 0.33, 0.55, TRUE, 1.1, 0.4, 'EU RDA'),
-- Vitamin B2 (Riboflavin)
('vitamin-b2', 'Vitamin B2', 'mg', 0.21, 0.42, 0.7, TRUE, 1.4, 0.4, 'EU RDA'),
-- Vitamin B3 (Niacin)
('vitamin-b3', 'Vitamin B3', 'mg', 2.4, 4.8, 8.0, TRUE, 16, 0.4, 'EU RDA'),
-- Vitamin B6
('vitamin-b6', 'Vitamin B6', 'mg', 0.21, 0.42, 0.7, TRUE, 1.4, 0.4, 'EU RDA'),
-- Vitamin B9 (Folate)
('vitamin-b9', 'Folate', 'µg', 30, 60, 100, TRUE, 200, 0.5, 'EU RDA'),
-- Vitamin B12
('vitamin-b12', 'Vitamin B12', 'µg', 0.375, 0.75, 1.25, TRUE, 2.5, 0.5, 'EU RDA'),

-- ============================================================
-- MINERALS - Based on EU RDA
-- ============================================================
-- Calcium
('calcium', 'Calcium', 'mg', 120, 240, 400, TRUE, 800, 0.6, 'EU RDA'),
-- Iron
('iron', 'Iron', 'mg', 2.1, 4.2, 7.0, TRUE, 14, 0.7, 'EU RDA'),
-- Magnesium
('magnesium', 'Magnesium', 'mg', 56, 112, 187, TRUE, 375, 0.5, 'EU RDA'),
-- Zinc
('zinc', 'Zinc', 'mg', 1.5, 3.0, 5.0, TRUE, 10, 0.5, 'EU RDA'),
-- Potassium
('potassium', 'Potassium', 'mg', 300, 600, 1000, TRUE, 2000, 0.5, 'EU RDA'),
-- Phosphorus
('phosphorus', 'Phosphorus', 'mg', 105, 210, 350, TRUE, 700, 0.4, 'EU RDA'),
-- Iodine
('iodine', 'Iodine', 'µg', 22.5, 45, 75, TRUE, 150, 0.4, 'EU RDA'),
-- Selenium
('selenium', 'Selenium', 'µg', 8.25, 16.5, 27.5, TRUE, 55, 0.4, 'EU RDA'),
-- Copper
('copper', 'Copper', 'mg', 0.15, 0.3, 0.5, TRUE, 1.0, 0.3, 'EU RDA'),
-- Manganese
('manganese', 'Manganese', 'mg', 0.3, 0.6, 1.0, TRUE, 2.0, 0.3, 'EU RDA'),

-- ============================================================
-- OTHER NUTRIENTS
-- ============================================================
-- Omega-3 (beneficial)
('omega-3-fat', 'Omega-3', 'g', 0.1, 0.3, 0.5, TRUE, 2.0, 0.7, 'EFSA'),
-- Omega-6
('omega-6-fat', 'Omega-6', 'g', 1.0, 3.0, 6.0, TRUE, 10, 0.3, 'EFSA'),
-- Monounsaturated Fat (beneficial)
('monounsaturated-fat', 'Monounsaturated Fat', 'g', 3.0, 8.0, 15.0, TRUE, 20, 0.4, 'EFSA'),
-- Polyunsaturated Fat (beneficial in moderation)
('polyunsaturated-fat', 'Polyunsaturated Fat', 'g', 2.0, 6.0, 12.0, TRUE, 16, 0.4, 'EFSA'),
-- Alcohol
('alcohol', 'Alcohol', 'g', 0, 1.0, 5.0, FALSE, 0, 1.5, 'WHO');