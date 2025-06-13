import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProductData {
  barcode: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  description: string;
  category: string;
  image?: string;
  manufacturer: string;
  countryOfOrigin: string;
  weight?: string;
  dimensions?: string;
  nutritionalInfo?: string;
  ingredients?: string;
  allergens?: string;
  expiryDate?: string;
  batchNumber?: string;
  rating?: number;
  reviewCount?: number;
  buyingSuggestions?: Array<{
    store: string;
    price: string;
    availability: string;
    url?: string;
  }>;
  aiRecommendation?: string;
  nutritionGrade?: string;
  source?: string;
}

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getProductFromOpenFoodFacts = async (barcode: string): Promise<ProductData | null> => {
    try {
      console.log('Fetching from Open Food Facts for barcode:', barcode);
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
      const response = await fetch(url, { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Open Food Facts response:', data);
        
        if (data.status === 1) { // Product found
          const product = data.product || {};
          
          return {
            barcode,
            name: product.product_name || product.product_name_en || 'Unknown Product',
            brand: product.brands || 'Unknown Brand',
            price: 'N/A', // Open Food Facts doesn't provide pricing
            currency: 'USD',
            description: product.generic_name || product.product_name || 'No description available',
            category: product.categories || 'Unknown Category',
            image: product.image_url || product.image_front_url,
            manufacturer: product.brands || product.manufacturing_places || 'Unknown Manufacturer',
            countryOfOrigin: product.countries || product.origins || 'Unknown',
            weight: product.quantity || product.net_weight,
            ingredients: product.ingredients_text || product.ingredients_text_en || 'Not available',
            allergens: product.allergens || product.allergens_tags?.join(', '),
            nutritionalInfo: formatNutritionalInfo(product.nutriments),
            nutritionGrade: product.nutrition_grades || product.nutriscore_grade,
            rating: product.popularity ? Math.min(5, (product.popularity / 20)) : undefined,
            reviewCount: product.popularity || undefined,
            source: 'Open Food Facts',
            buyingSuggestions: [
              { store: 'Local Grocery Store', price: 'Check in store', availability: 'Check availability' },
              { store: 'Online Retailers', price: 'Compare prices', availability: 'Various options' }
            ],
            aiRecommendation: generateRecommendation(product)
          };
        }
      }
    } catch (error) {
      console.error('Open Food Facts API error:', error);
      throw error;
    }
    return null;
  };

  const formatNutritionalInfo = (nutriments: any): string => {
    if (!nutriments || typeof nutriments !== 'object') return 'Not available';
    
    const info = [];
    if (nutriments.energy_kcal_100g) info.push(`Energy: ${nutriments.energy_kcal_100g} kcal/100g`);
    if (nutriments.fat_100g) info.push(`Fat: ${nutriments.fat_100g}g/100g`);
    if (nutriments.carbohydrates_100g) info.push(`Carbs: ${nutriments.carbohydrates_100g}g/100g`);
    if (nutriments.proteins_100g) info.push(`Protein: ${nutriments.proteins_100g}g/100g`);
    if (nutriments.salt_100g) info.push(`Salt: ${nutriments.salt_100g}g/100g`);
    
    return info.length > 0 ? info.join(', ') : 'Not available';
  };

  const generateRecommendation = (product: any): string => {
    if (!product || typeof product !== 'object') {
      return 'Product information available from Open Food Facts database.';
    }

    const recommendations = [];
    
    if (product.nutriscore_grade) {
      const grade = product.nutriscore_grade.toUpperCase();
      if (grade === 'A' || grade === 'B') {
        recommendations.push('This product has a good nutritional score.');
      } else if (grade === 'D' || grade === 'E') {
        recommendations.push('Consider alternatives with better nutritional value.');
      }
    }
    
    if (product.ecoscore_grade) {
      recommendations.push(`Environmental impact: ${product.ecoscore_grade.toUpperCase()}`);
    }
    
    if (product.nova_group) {
      const novaLevel = parseInt(product.nova_group);
      if (novaLevel >= 3) {
        recommendations.push('This is a processed food. Consider fresh alternatives when possible.');
      }
    }
    
    return recommendations.length > 0 
      ? recommendations.join(' ') 
      : 'Product information available from Open Food Facts database.';
  };

  const lookupProduct = async (barcode: string): Promise<ProductData | null> => {
    setIsLoading(true);
    console.log('Looking up product with barcode via Open Food Facts:', barcode);

    try {
      const product = await getProductFromOpenFoodFacts(barcode);
      
      if (product) {
        toast({
          title: "Product Found!",
          description: `Found ${product.name} in Open Food Facts database`,
        });
        return product;
      } else {
        toast({
          title: "Product Not Found",
          description: "Product not found in Open Food Facts. Showing sample data.",
          variant: "destructive",
        });
        return generateMockProduct(barcode);
      }

    } catch (error) {
      console.error('Product lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "Unable to fetch product details. Showing sample data.",
        variant: "destructive",
      });
      
      return generateMockProduct(barcode);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockProduct = (barcode: string): ProductData => {
    // Generate different mock products based on barcode patterns
    const mockProducts = [
      {
        name: "Organic Whole Milk",
        brand: "Farm Fresh",
        price: "4.99",
        currency: "USD",
        description: "Fresh organic whole milk from grass-fed cows. Rich in calcium and vitamins.",
        category: "Dairy",
        manufacturer: "Farm Fresh Dairy Co.",
        countryOfOrigin: "United States",
        weight: "1 Gallon (3.78L)",
        ingredients: "Organic Milk, Vitamin D3",
        allergens: "Contains: Milk",
        rating: 4.3,
        reviewCount: 287,
        buyingSuggestions: [
          { store: 'Amazon Fresh', price: '4.99', availability: 'In Stock' },
          { store: 'Walmart', price: '4.79', availability: 'In Stock' },
          { store: 'Target', price: '5.19', availability: 'Limited' }
        ],
        aiRecommendation: 'High-quality organic milk with excellent nutritional value. Best price at Walmart.'
      },
      {
        name: "Premium Dark Chocolate",
        brand: "ChocolateWorld",
        price: "8.99",
        currency: "USD",
        description: "Rich 70% dark chocolate made from finest cocoa beans. Perfect for chocolate lovers.",
        category: "Confectionery",
        manufacturer: "ChocolateWorld Ltd.",
        countryOfOrigin: "Belgium",
        weight: "200g",
        ingredients: "Cocoa mass, sugar, cocoa butter, vanilla extract",
        allergens: "May contain: Nuts, Milk",
        rating: 4.6,
        reviewCount: 412,
        buyingSuggestions: [
          { store: 'Amazon', price: '8.99', availability: 'In Stock' },
          { store: 'Whole Foods', price: '9.49', availability: 'In Stock' },
          { store: 'Local Gourmet Shop', price: '8.75', availability: 'In Stock' }
        ],
        aiRecommendation: 'Excellent premium chocolate with authentic Belgian taste. Great value for the quality.'
      },
      {
        name: "Wireless Bluetooth Headphones",
        brand: "TechSound",
        price: "89.99",
        currency: "USD",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        category: "Electronics",
        manufacturer: "TechSound Inc.",
        countryOfOrigin: "China",
        dimensions: "18cm x 16cm x 8cm",
        weight: "285g",
        rating: 4.1,
        reviewCount: 1203,
        buyingSuggestions: [
          { store: 'Best Buy', price: '89.99', availability: 'In Stock' },
          { store: 'Amazon', price: '84.99', availability: 'In Stock' },
          { store: 'Target', price: '92.99', availability: 'Limited' }
        ],
        aiRecommendation: 'Solid mid-range headphones with good battery life. Amazon offers the best price.'
      }
    ];

    const index = parseInt(barcode.slice(-1)) % mockProducts.length;
    const selectedProduct = mockProducts[index];

    return {
      barcode,
      ...selectedProduct
    };
  };

  return { lookupProduct, isLoading };
};
