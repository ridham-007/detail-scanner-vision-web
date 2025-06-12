import { useState, useEffect } from 'react';
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
}

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Try to get API key from environment variable first, then fallback to localStorage
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const storedApiKey = localStorage.getItem('openai_api_key');
    
    if (envApiKey) {
      setApiKey(envApiKey);
    } else if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const updateApiKey = (key: string) => {
    setApiKey(key);
    // Store in localStorage as backup
    if (key.trim()) {
      localStorage.setItem('openai_api_key', key);
    } else {
      localStorage.removeItem('openai_api_key');
    }
  };

  const getApiKey = (): string => {
    // Prioritize environment variable over user input
    return import.meta.env.VITE_OPENAI_API_KEY || apiKey;
  };

  const enhanceProductWithAI = async (basicProduct: ProductData, userApiKey: string): Promise<ProductData> => {
    try {
      const prompt = `Analyze this product and provide detailed information:
      
Product: ${basicProduct.name}
Brand: ${basicProduct.brand}
Category: ${basicProduct.category}
Barcode: ${basicProduct.barcode}

Please provide:
1. Current market rating (0-5 stars)
2. Estimated review count
3. Top 3 buying suggestions with stores, prices, and availability
4. Brief AI recommendation (pros/cons, value assessment)

Respond in JSON format:
{
  "rating": number,
  "reviewCount": number,
  "buyingSuggestions": [
    {
      "store": "Store Name",
      "price": "$X.XX",
      "availability": "In Stock/Limited/Out of Stock"
    }
  ],
  "aiRecommendation": "Brief recommendation text"
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a product analysis expert. Provide accurate, helpful product information and buying advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);

      return {
        ...basicProduct,
        rating: aiResponse.rating,
        reviewCount: aiResponse.reviewCount,
        buyingSuggestions: aiResponse.buyingSuggestions,
        aiRecommendation: aiResponse.aiRecommendation,
      };

    } catch (error) {
      console.error('AI enhancement error:', error);
      // Return basic product with fallback data if AI fails
      return {
        ...basicProduct,
        rating: 3.5,
        reviewCount: 150,
        buyingSuggestions: [
          { store: 'Amazon', price: basicProduct.price, availability: 'In Stock' },
          { store: 'Walmart', price: (parseFloat(basicProduct.price.replace('$', '')) * 0.95).toFixed(2), availability: 'In Stock' },
          { store: 'Target', price: (parseFloat(basicProduct.price.replace('$', '')) * 1.05).toFixed(2), availability: 'Limited' }
        ],
        aiRecommendation: 'Good value product. Consider checking multiple stores for best price.'
      };
    }
  };

  const lookupProduct = async (barcode: string): Promise<ProductData | null> => {
    setIsLoading(true);
    console.log('Looking up product with barcode:', barcode);

    try {
      // First try Open Food Facts API
      const openFoodFactsResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const openFoodFactsData = await openFoodFactsResponse.json();

      let basicProduct: ProductData;

      if (openFoodFactsData.status === 1 && openFoodFactsData.product) {
        const product = openFoodFactsData.product;
        console.log('Product found in Open Food Facts:', product);

        basicProduct = {
          barcode,
          name: product.product_name || product.product_name_en || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          price: '4.99',
          currency: 'USD',
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
      } else {
        // Fallback: try UPC Item DB API
        const upcResponse = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
        const upcData = await upcResponse.json();

        if (upcData.code === 'OK' && upcData.items && upcData.items.length > 0) {
          const item = upcData.items[0];
          console.log('Product found in UPC Item DB:', item);

          basicProduct = {
            barcode,
            name: item.title || 'Unknown Product',
            brand: item.brand || 'Unknown Brand',
            price: item.lowest_recorded_price?.toString() || '9.99',
            currency: item.currency || 'USD',
            description: item.description || 'No description available',
            category: item.category || 'Uncategorized',
            image: item.images?.[0],
            manufacturer: item.brand || 'Unknown',
            countryOfOrigin: 'Unknown',
          };
        } else {
          // Generate mock data as final fallback
          console.log('Product not found in databases, generating mock data');
          basicProduct = generateMockProduct(barcode);
        }
      }

      // Enhance with AI if API key is available
      const currentApiKey = getApiKey();
      if (currentApiKey.trim()) {
        const enhancedProduct = await enhanceProductWithAI(basicProduct, currentApiKey);
        return enhancedProduct;
      } else {
        // Add basic suggestions without AI
        return {
          ...basicProduct,
          rating: 3.5,
          reviewCount: 100,
          buyingSuggestions: [
            { store: 'Amazon', price: basicProduct.price, availability: 'In Stock' },
            { store: 'Local Store', price: (parseFloat(basicProduct.price.replace('$', '')) * 0.9).toFixed(2), availability: 'Check Availability' }
          ],
          aiRecommendation: 'Connect OpenAI API for detailed analysis and recommendations.'
        };
      }

    } catch (error) {
      console.error('Product lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "Unable to fetch product details. Showing sample data.",
        variant: "destructive",
      });
      
      // Return mock data as fallback
      const mockProduct = generateMockProduct(barcode);
      return {
        ...mockProduct,
        rating: 3.0,
        reviewCount: 50,
        buyingSuggestions: [
          { store: 'Sample Store', price: mockProduct.price, availability: 'Unknown' }
        ],
        aiRecommendation: 'Sample data shown. Add OpenAI API key for real analysis.'
      };
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

  return { lookupProduct, isLoading, apiKey, setApiKey: updateApiKey };
};
