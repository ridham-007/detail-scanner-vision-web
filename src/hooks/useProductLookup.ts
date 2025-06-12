
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
}

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const lookupProduct = async (barcode: string): Promise<ProductData | null> => {
    setIsLoading(true);
    console.log('Looking up product with barcode:', barcode);

    try {
      // First try Open Food Facts API
      const openFoodFactsResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const openFoodFactsData = await openFoodFactsResponse.json();

      if (openFoodFactsData.status === 1 && openFoodFactsData.product) {
        const product = openFoodFactsData.product;
        console.log('Product found in Open Food Facts:', product);

        const productData: ProductData = {
          barcode,
          name: product.product_name || product.product_name_en || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          price: 'N/A',
          currency: '',
          description: product.generic_name || product.description || 'No description available',
          category: product.categories_tags?.join(', ') || 'Uncategorized',
          image: product.image_url || product.image_front_url,
          manufacturer: product.manufacturing_places || product.brands || 'Unknown',
          countryOfOrigin: product.countries || 'Unknown',
          weight: product.quantity,
          ingredients: product.ingredients_text || product.ingredients_text_en,
          allergens: product.allergens,
          nutritionalInfo: product.nutrition_grades,
        };

        return productData;
      }

      // Fallback: try UPC Item DB API
      const upcResponse = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
      const upcData = await upcResponse.json();

      if (upcData.code === 'OK' && upcData.items && upcData.items.length > 0) {
        const item = upcData.items[0];
        console.log('Product found in UPC Item DB:', item);

        const productData: ProductData = {
          barcode,
          name: item.title || 'Unknown Product',
          brand: item.brand || 'Unknown Brand',
          price: item.lowest_recorded_price?.toString() || 'N/A',
          currency: item.currency || 'USD',
          description: item.description || 'No description available',
          category: item.category || 'Uncategorized',
          image: item.images?.[0],
          manufacturer: item.brand || 'Unknown',
          countryOfOrigin: 'Unknown',
        };

        return productData;
      }

      // If no product found in either API, return mock data based on barcode patterns
      console.log('Product not found in databases, generating mock data');
      return generateMockProduct(barcode);

    } catch (error) {
      console.error('Product lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "Unable to fetch product details. Showing sample data.",
        variant: "destructive",
      });
      
      // Return mock data as fallback
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
        expiryDate: "2024-07-15",
        batchNumber: "FF2024156"
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
        expiryDate: "2025-02-28",
        batchNumber: "CW2024089"
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
        weight: "285g"
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
