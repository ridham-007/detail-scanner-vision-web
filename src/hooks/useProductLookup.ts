
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
}

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getProductFromChatGPT = async (barcode: string, apiKey: string): Promise<ProductData> => {
    try {
      const prompt = `Based on this barcode number: ${barcode}, please provide complete product information. If you can identify the product from the barcode, provide real details. If not, provide realistic placeholder data for a common consumer product.

Please provide a comprehensive response in the following JSON format:
{
  "name": "Product Name",
  "brand": "Brand Name",
  "price": "X.XX",
  "currency": "USD",
  "description": "Detailed product description",
  "category": "Product Category",
  "manufacturer": "Manufacturer Name",
  "countryOfOrigin": "Country",
  "weight": "Weight/Size",
  "dimensions": "Dimensions if applicable",
  "nutritionalInfo": "Nutritional information if food product",
  "ingredients": "Ingredients list if applicable",
  "allergens": "Allergen information if applicable",
  "rating": 4.2,
  "reviewCount": 150,
  "buyingSuggestions": [
    {
      "store": "Store Name",
      "price": "X.XX",
      "availability": "In Stock"
    }
  ],
  "aiRecommendation": "Your analysis and buying recommendation"
}

Make the response realistic and detailed. Include at least 3 buying suggestions with different stores and slightly varied prices.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a product information expert. Provide detailed, accurate product information based on barcodes. If you cannot identify the exact product from a barcode, provide realistic placeholder data for a common consumer product that would typically have that barcode format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error('ChatGPT API request failed');
      }

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);

      return {
        barcode,
        ...aiResponse,
      };

    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw error;
    }
  };

  const lookupProduct = async (barcode: string): Promise<ProductData | null> => {
    setIsLoading(true);
    console.log('Looking up product with barcode via ChatGPT:', barcode);

    try {
      const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!envApiKey?.trim()) {
        toast({
          title: "API Key Required",
          description: "OpenAI API key is required to fetch product details.",
          variant: "destructive",
        });
        return generateMockProduct(barcode);
      }

      const product = await getProductFromChatGPT(barcode, envApiKey);
      return product;

    } catch (error) {
      console.error('Product lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "Unable to fetch product details from ChatGPT. Showing sample data.",
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
