-- Insert Food Type subcategories
INSERT INTO public.subcategories (category_id, name, slug, code, sort_order) 
SELECT 
  c.id,
  'Fruits',
  'fruits',
  'FRUIT',
  1
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Vegetables',
  'vegetables', 
  'VEG',
  2
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Grains',
  'grains',
  'GRAIN',
  3
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Dairy',
  'dairy',
  'DAIRY',
  4
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Meat & Poultry',
  'meat-poultry',
  'MEAT',
  5
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Seafood',
  'seafood',
  'SEAFOOD',
  6
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Snacks',
  'snacks',
  'SNACK',
  7
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Beverages',
  'beverages',
  'BEV',
  8
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Bakery',
  'bakery',
  'BAKERY',
  9
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Frozen Foods',
  'frozen-foods',
  'FROZEN',
  10
FROM public.categories c WHERE c.slug = 'food-type'
UNION ALL
SELECT 
  c.id,
  'Condiments & Sauces',
  'condiments-sauces',
  'CONDIMENT',
  11
FROM public.categories c WHERE c.slug = 'food-type';

-- Insert Nutrition Profile subcategories
INSERT INTO public.subcategories (category_id, name, slug, code, sort_order) 
SELECT 
  c.id,
  'High Protein',
  'high-protein',
  'HIGH_PROTEIN',
  1
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'Low Sugar',
  'low-sugar',
  'LOW_SUGAR',
  2
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'Low Fat',
  'low-fat',
  'LOW_FAT',
  3
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'High Fiber',
  'high-fiber',
  'HIGH_FIBER',
  4
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'Gluten Free',
  'gluten-free',
  'GLUTEN_FREE',
  5
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'Organic',
  'organic',
  'ORGANIC',
  6
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'Vegan',
  'vegan',
  'VEGAN',
  7
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'Keto Friendly',
  'keto-friendly',
  'KETO',
  8
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'Low Sodium',
  'low-sodium',
  'LOW_SODIUM',
  9
FROM public.categories c WHERE c.slug = 'nutrition-profile'
UNION ALL
SELECT 
  c.id,
  'Heart Healthy',
  'heart-healthy',
  'HEART_HEALTHY',
  10
FROM public.categories c WHERE c.slug = 'nutrition-profile';

-- Insert Meal Context subcategories
INSERT INTO public.subcategories (category_id, name, slug, code, sort_order) 
SELECT 
  c.id,
  'Breakfast',
  'breakfast',
  'BREAKFAST',
  1
FROM public.categories c WHERE c.slug = 'meal-context'
UNION ALL
SELECT 
  c.id,
  'Lunch',
  'lunch',
  'LUNCH',
  2
FROM public.categories c WHERE c.slug = 'meal-context'
UNION ALL
SELECT 
  c.id,
  'Dinner',
  'dinner',
  'DINNER',
  3
FROM public.categories c WHERE c.slug = 'meal-context'
UNION ALL
SELECT 
  c.id,
  'Snacks',
  'snacks',
  'SNACK_TIME',
  4
FROM public.categories c WHERE c.slug = 'meal-context'
UNION ALL
SELECT 
  c.id,
  'Desserts',
  'desserts',
  'DESSERT',
  5
FROM public.categories c WHERE c.slug = 'meal-context'
UNION ALL
SELECT 
  c.id,
  'Beverages',
  'beverages',
  'DRINK',
  6
FROM public.categories c WHERE c.slug = 'meal-context'
UNION ALL
SELECT 
  c.id,
  'On-the-Go',
  'on-the-go',
  'PORTABLE',
  7
FROM public.categories c WHERE c.slug = 'meal-context';